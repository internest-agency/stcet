/**
 * Seeds the Placement Leadership content tables from the bundled defaults in
 * `src/lib/content/placement-leadership-content.ts`.
 *
 * Idempotent:
 *  - the singleton section is only created when no row exists, so re-running
 *    never overwrites admin edits;
 *  - the ordered items list is only seeded when its table is empty.
 *
 *   npx tsx scripts/seed-placement-leadership.ts
 */
import "dotenv/config";

import { getPrismaClient } from "../src/lib/prisma-client";
import { sanitizeHtml } from "../src/lib/content/html";
import {
  placementLeadershipContent,
  placementLeadershipItems,
} from "../src/lib/content/placement-leadership-content";

function rich(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  const clean = sanitizeHtml(value);
  return clean || null;
}

function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function main() {
  const prisma = getPrismaClient();

  const existing = await prisma.placementLeadership.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });
  let leadershipId: number;
  if (!existing) {
    const created = await prisma.placementLeadership.create({
      data: {
        eyebrow: text(placementLeadershipContent.eyebrow),
        heading: text(placementLeadershipContent.heading),
        description: rich(placementLeadershipContent.description),
        officerName: text(placementLeadershipContent.officerName),
        officerDesignation: text(placementLeadershipContent.officerDesignation),
        officerImagePath: text(placementLeadershipContent.officerImagePath),
        officerImageAlt: text(placementLeadershipContent.officerImageAlt),
        isPublished: true,
      },
      select: { id: true },
    });
    leadershipId = created.id;
    console.log("seeded placement leadership section");
  } else {
    leadershipId = existing.id;
    console.log("placement leadership section already present — skipped");
  }

  const itemCount = await prisma.placementLeadershipItem.count();
  if (itemCount === 0) {
    await prisma.placementLeadershipItem.createMany({
      data: placementLeadershipItems.map((item, index) => ({
        leadershipId,
        title: item.title,
        description: text(item.description),
        sortOrder: index,
        isPublished: true,
      })),
    });
    console.log(`seeded ${placementLeadershipItems.length} leadership items`);
  } else {
    console.log(`leadership items already present (${itemCount}) — skipped`);
  }

  await prisma.$disconnect().catch(() => undefined);
  process.exit(0);
}

main().catch((error) => {
  console.error("seed-placement-leadership fatal:", error);
  process.exit(1);
});
