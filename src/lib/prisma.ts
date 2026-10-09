import "server-only";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/src/generated/prisma/client";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

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
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const client = createPrismaClient();

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = client;
  }

  return client;
}
