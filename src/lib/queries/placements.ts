import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

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
