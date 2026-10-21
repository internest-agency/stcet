import "server-only";

import { connection } from "next/server";
import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface PublicFacultyGroup {
  id: number;
  name: string;
  sortOrder: number;
}

/**
 * Saved faculty groups in their administrator-configured order. Used by the
 * public Faculty page so group headings follow `sortOrder` (then `id`) rather
 * than being sorted alphabetically.
 */
export async function getFacultyGroups(): Promise<PublicFacultyGroup[]> {
  if (!isDatabaseConfigured()) return [];

  await connection();

  try {
    return await getPrismaClient().facultyGroup.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: { id: true, name: true, sortOrder: true },
    });
  } catch {
    console.error(
      "Faculty groups unavailable; falling back to faculty-provided order.",
    );
    return [];
  }
}

export interface AdminFacultyGroup {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  memberCount: number;
}

/** Groups with their faculty counts for the admin management screen. */
export async function getAdminFacultyGroups(): Promise<AdminFacultyGroup[]> {
  await requireAdmin();
  const prisma = getPrismaClient();

  const groups = await prisma.facultyGroup.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      sortOrder: true,
      _count: { select: { members: true } },
    },
  });

  return groups.map((group) => ({
    id: group.id,
    name: group.name,
    slug: group.slug,
    sortOrder: group.sortOrder,
    memberCount: group._count.members,
  }));
}

/** Lightweight id/name list for the faculty create/edit dropdown. */
export async function getFacultyGroupOptions(): Promise<
  { id: number; name: string }[]
> {
  await requireAdmin();
  return getPrismaClient().facultyGroup.findMany({
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    select: { id: true, name: true },
  });
}
