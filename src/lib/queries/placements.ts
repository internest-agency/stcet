import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import type { PlacementLeadershipContent } from "@/src/lib/content/placement-leadership-content";

export async function getPublishedPlacementContent() {
  if (!isDatabaseConfigured()) return { companies: [], programmes: [], interactions: [] };
  await connection();
  try {
    const prisma = getPrismaClient();
    const [companies, programmes, interactions] = await Promise.all([
      prisma.placementCompany.findMany({ where: { isPublished: true, isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      prisma.trainingProgramme.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
      prisma.industryInteraction.findMany({ where: { isPublished: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
    ]);
    return { companies, programmes, interactions };
  } catch (error) {
    console.error("Placement content query failed; using bundled content.", error);
    return { companies: [], programmes: [], interactions: [] };
  }
}

/**
 * Load the published "Placement Leadership" section for the public site.
 *
 * Returns `null` when nothing has been stored yet (or the database is
 * unavailable) so the public component can fall back to the bundled defaults
 * instead of rendering an empty section.
 */
export async function getPublishedPlacementLeadership(): Promise<PlacementLeadershipContent | null> {
  if (!isDatabaseConfigured()) return null;
  await connection();
  try {
    const prisma = getPrismaClient();
    const leadership = await prisma.placementLeadership.findFirst({
      where: { isPublished: true },
      orderBy: { id: "asc" },
      include: {
        items: {
          where: { isPublished: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        },
      },
    });

    if (!leadership) return null;

    return {
      id: leadership.id,
      eyebrow: leadership.eyebrow,
      heading: leadership.heading,
      description: leadership.description,
      officerName: leadership.officerName,
      officerDesignation: leadership.officerDesignation,
      officerImagePath: leadership.officerImagePath,
      officerImageAlt: leadership.officerImageAlt,
      items: leadership.items.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
      })),
    };
  } catch (error) {
    console.error("Placement leadership query failed; using bundled content.", error);
    return null;
  }
}
