/**
 * Seeds the Governing Council members from the bundled defaults in
 * `src/lib/content/governing-council-content.ts`.
 *
 * Idempotent:
 *  - members are only inserted when the table is empty, so re-running never
 *    duplicates rows and never overwrites administrator-edited records.
 *
 *   npx tsx scripts/seed-governing-council.ts
 */
import "dotenv/config";

import { getPrismaClient } from "../src/lib/prisma-client";
import { governingCouncilMembers } from "../src/lib/content/governing-council-content";

function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function main() {
  const prisma = getPrismaClient();

  const count = await prisma.governingCouncilMember.count();
  if (count > 0) {
    console.log(
      `governing council members already present (${count}) — skipped`,
    );
    await prisma.$disconnect().catch(() => undefined);
    process.exit(0);
  }

  await prisma.governingCouncilMember.createMany({
    data: governingCouncilMembers.map((member, index) => ({
      name: member.name,
      role: member.role,
      imagePath: text(member.imagePath),
      biography: text(member.biography),
      sortOrder: index,
      isPublished: true,
    })),
  });

  console.log(`seeded ${governingCouncilMembers.length} governing council members`);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(0);
}

main().catch((error) => {
  console.error("seed-governing-council fatal:", error);
  process.exit(1);
});
