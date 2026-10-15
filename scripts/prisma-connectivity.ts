import "dotenv/config";

import { getPrismaClient } from "../src/lib/prisma-client";

// Uses the application's real getPrismaClient() (same adapter, pool options and
// DATABASE_URL as production), so it exercises exactly the pool that the
// deployed app uses.
//
//   npx tsx scripts/prisma-connectivity.ts
//
// Read-only. Prints only a sanitized classification, never credentials.

function classify(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  const cause =
    error instanceof Error && error.cause instanceof Error
      ? ` ${error.cause.message}`
      : "";
  const text = `${message}${cause}`;
  if (/ENOTFOUND|getaddrinfo|EAI_AGAIN/i.test(text))
    return "DNS_FAILURE: the database hostname could not be resolved.";
  if (/ETIMEDOUT|ECONNREFUSED|EHOSTUNREACH|ENETUNREACH/i.test(text))
    return "NETWORK_UNREACHABLE: the TCP connection could not be established.";
  if (/ECONNRESET|EPIPE|PROTOCOL_CONNECTION_LOST|Handshake/i.test(text))
    return "CONNECTION_RESET: the server dropped the connection mid-stream.";
  if (/ER_ACCESS_DENIED_ERROR|Access denied|1045/i.test(text))
    return "ACCESS_DENIED: bad credentials, or this host is not allowed to connect.";
  if (/unknown database|1049/i.test(text))
    return "UNKNOWN_DATABASE: the database name does not exist.";
  if (/45028|pool timeout/i.test(text))
    return "POOL_TIMEOUT: the pool handed out no connection in time. With active=0 idle=0 this usually means the pool never opened one.";
  return "OTHER";
}

function describe(error: unknown) {
  const parts: string[] = [];
  let current: unknown = error;
  let depth = 0;
  while (current && depth < 6) {
    if (current instanceof Error) {
      const code = (current as NodeJS.ErrnoException).code;
      parts.push(`${current.name}${code ? ` [${code}]` : ""}: ${current.message}`);
      current = (current as { cause?: unknown }).cause;
    } else {
      parts.push(String(current));
      break;
    }
    depth++;
  }
  return parts.join("\n  caused by: ");
}

async function main() {
  const prisma = getPrismaClient();
  const started = Date.now();
  try {
    const first = await prisma.$queryRaw`SELECT 1 AS ok`;
    const firstMs = Date.now() - started;

    const reuseStart = Date.now();
    const second = await prisma.$queryRaw`SELECT 1 AS ok`;
    const reuseMs = Date.now() - reuseStart;

    const countStart = Date.now();
    const facultyCount = await prisma.faculty.count();
    const countMs = Date.now() - countStart;

    process.stdout.write(`SELECT 1: PASS in ${firstMs}ms ${JSON.stringify(first)}\n`);
    process.stdout.write(`SELECT 1 (reuse): PASS in ${reuseMs}ms ${JSON.stringify(second)}\n`);
    process.stdout.write(`faculty.count(): PASS in ${countMs}ms -> ${facultyCount}\n`);
    process.stdout.write("CONNECTIVITY OK\n");
  } catch (error) {
    process.stdout.write(`CONNECTIVITY FAILED in ${Date.now() - started}ms\n`);
    process.stdout.write(`classification: ${classify(error)}\n`);
    process.stdout.write(`detail:\n  ${describe(error)}\n`);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect().catch(() => undefined);
  }
}

main().catch((error: unknown) => {
  process.stdout.write(`${describe(error)}\n`);
  process.exitCode = 1;
});
