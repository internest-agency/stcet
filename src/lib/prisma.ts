import "server-only";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/src/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaRevision?: string;
};

// Bump with an additive Prisma migration. This forces a fresh client when a
// newly added field/model exists. Note: a *running* Next dev server still has
// to be restarted after `prisma generate`, because Turbopack can retain the
// previously compiled generated client, which then rejects new fields (e.g.
// `instructions`) with a PrismaClientValidationError.
const prismaSchemaRevision = "20261015120000";

// The MariaDB driver reports connection failures to the pool, which surfaces
// them to Prisma only as a generic "pool timeout" (45028). That hides the
// actionable cause (e.g. 1045 access denied, 1049 unknown database, unreachable
// host). Route the driver's error logger through here so the real reason is
// always logged instead of being mistaken for pool exhaustion.
const DATABASE_ERROR_LOG_INTERVAL_MS = 5000;

let lastDatabaseError: { signature: string; loggedAt: number } | null = null;

function summarizeDatabaseError(error: unknown) {
  const raw =
    error instanceof Error
      ? error.message
      : typeof error === "string"
        ? error
        : "Unknown database error";

  // Drop the per-connection id so repeated retries collapse into one line.
  return raw.replace(/\(conn:\d+,\s*/, "(").trim();
}

function reportDatabaseError(error: unknown) {
  const signature = summarizeDatabaseError(error);
  const now = Date.now();

  if (
    lastDatabaseError?.signature === signature &&
    now - lastDatabaseError.loggedAt < DATABASE_ERROR_LOG_INTERVAL_MS
  ) {
    return;
  }

  lastDatabaseError = { signature, loggedAt: now };
  console.error(`[prisma] database connection error: ${signature}`);
}

function createPrismaClient() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }

  const url = new URL(databaseUrl);
  const connectionLimit = Number(process.env.DATABASE_CONNECTION_LIMIT ?? 5);
  const connectionTimeout = Number(
    process.env.DATABASE_CONNECT_TIMEOUT_MS ?? 5000,
  );
  const timeoutMs =
    Number.isInteger(connectionTimeout) && connectionTimeout > 0
      ? connectionTimeout
      : 5000;

  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit:
      Number.isInteger(connectionLimit) && connectionLimit > 0
        ? connectionLimit
        : 5,
    connectTimeout: timeoutMs,
    acquireTimeout: timeoutMs,
    queryTimeout: timeoutMs,
    logger: {
      error: reportDatabaseError,
      warning: () => {},
    },
  });

  return new PrismaClient({ adapter });
}

export function isDatabaseConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

export function getPrismaClient() {
  if (
    globalForPrisma.prisma &&
    globalForPrisma.prismaSchemaRevision === prismaSchemaRevision
  ) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();

  globalForPrisma.prisma = client;
  globalForPrisma.prismaSchemaRevision = prismaSchemaRevision;

  return client;
}
