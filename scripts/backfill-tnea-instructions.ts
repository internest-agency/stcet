import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * One-off, idempotent backfill for the TNEA Application Steps module.
 *
 * Before the `instructions` column existed, the step's checklist was stored as
 * blank-line separated text inside `description`, and the public page rendered
 * the entire value as a paragraph *and* split it into checklist items (which
 * duplicated the content). This splits each existing record without losing
 * anything: the first non-empty line becomes the short description and the
 * remaining lines become `instructions`. Rows that already have an
 * `instructions` value are skipped, so the script is safe to re-run.
 */
function splitDescription(description: string | null) {
  const lines = (description ?? "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length <= 1) {
    return { description: lines[0] ?? null, instructions: [] as string[] };
  }

  return { description: lines[0], instructions: lines.slice(1) };
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 2,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const rows = await prisma.tNEACounselling.findMany({
      select: { id: true, description: true, instructions: true },
    });

    const pending = rows.filter((row) => row.instructions === null);
    let updated = 0;

    for (const row of pending) {
      const { description, instructions } = splitDescription(row.description);

      await prisma.tNEACounselling.update({
        where: { id: row.id },
        data: { description, instructions },
      });

      updated += 1;
      console.log(
        `  step ${row.id}: short description ${description ? "set" : "empty"}, ${instructions.length} instruction(s)`,
      );
    }

    console.log(
      `Backfill complete. ${updated} step(s) updated, ${rows.length - pending.length} already migrated.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Backfill failed:", error);
  process.exitCode = 1;
});
