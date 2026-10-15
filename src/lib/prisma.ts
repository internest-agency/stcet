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
const prismaSchemaRevision = "20261013130000";

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
