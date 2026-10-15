import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

function buildClient() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 5,
    connectTimeout: 8000,
    acquireTimeout: 8000,
    queryTimeout: 8000,
  });
  return { prisma: new PrismaClient({ adapter }), target: { host: url.hostname, port: url.port || "3306", database: url.pathname.slice(1) } };
}

async function attempt(label: string, fn: () => Promise<void>) {
  for (let i = 1; i <= 3; i++) {
    try {
      await fn();
      return true;
    } catch (error) {
      const e = error as { code?: string; message?: string };
      console.log(`  [${label}] attempt ${i} FAILED -> code=${e.code ?? "?"} msg=${(e.message ?? "").split("\n")[0]}`);
      if (i === 3) return false;
      await new Promise((r) => setTimeout(r, 1500));
    }
  }
  return false;
}

async function main() {
  const { prisma, target } = buildClient();
  console.log("TARGET", target, "| localhost:", /^(localhost|127\.0\.0\.1)$/i.test(target.host));

  const t0 = Date.now();
  const ok1 = await attempt("SELECT 1", async () => {
    const rows = await prisma.$queryRaw`SELECT 1 AS ok`;
    console.log("  SELECT 1 ->", JSON.stringify(rows));
  });
  console.log("SELECT 1:", ok1 ? "PASS" : "FAIL", `(${Date.now() - t0}ms)`);

  const ok2 = await attempt("enquiry.count", async () => {
    const count = await prisma.enquiry.count();
    console.log("  prisma.enquiry.count() ->", count);
  });
  console.log("prisma.enquiry.count():", ok2 ? "PASS" : "FAIL");

  const ok3 = await attempt("siteSettings.findFirst", async () => {
    const s = await prisma.siteSettings.findFirst({ select: { id: true, collegeName: true } });
    console.log("  siteSettings.findFirst ->", s ? `id=${s.id}` : "null (empty table)");
  });
  console.log("siteSettings.findFirst():", ok3 ? "PASS" : "FAIL");

  const ok4 = await attempt("faculty.count", async () => {
    const count = await prisma.faculty.count();
    console.log("  prisma.faculty.count() ->", count);
  });
  console.log("prisma.faculty.count():", ok4 ? "PASS" : "FAIL");

  await prisma.$disconnect();
  console.log("disconnected");
  if (!(ok1 && ok2 && ok3 && ok4)) process.exitCode = 1;
}

main().catch((error: unknown) => {
  const e = error as { code?: string; message?: string };
  console.log("FATAL code=", e.code, "msg=", (e.message ?? "").split("\n")[0]);
  process.exitCode = 1;
});
