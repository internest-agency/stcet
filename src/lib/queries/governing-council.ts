import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

/** Serializable shape passed from the server page into the client section. */
export interface PublicGoverningCouncilMember {
  id: number;
  name: string;
  role: string;
  biography: string | null;
  imagePath: string | null;
  imageAlt: string | null;
}

/**
 * Load the published Governing Council members for the public About page.
 *
 * Returns `[]` when nothing has been stored yet (or the database is
 * unavailable) so the section still renders without crashing.
 */
export async function getPublishedGoverningCouncilMembers(): Promise<
  PublicGoverningCouncilMember[]
> {
  if (!isDatabaseConfigured()) return [];
  await connection();

  try {
    const prisma = getPrismaClient();
    return await prisma.governingCouncilMember.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        role: true,
        biography: true,
        imagePath: true,
        imageAlt: true,
      },
    });
  } catch (error) {
    console.error(
      "Governing council query failed; rendering an empty council listing.",
      error,
    );
    return [];
  }
}
