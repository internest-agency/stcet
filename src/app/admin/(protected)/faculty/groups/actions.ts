"use server";

import { revalidatePath } from "next/cache";
import {
  getCurrentAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import {
  facultyGroupSchema,
  facultyGroupSlug,
} from "@/src/lib/admin/faculty-group-validation";
import { getPrismaClient } from "@/src/lib/prisma";

export type FacultyGroupActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

function refreshGroups() {
  revalidatePath("/admin/faculty/groups");
  revalidatePath("/admin/faculty");
  revalidatePath("/faculty");
  revalidatePath("/faculties");
  revalidatePath("/");
}

/** Resolve a unique slug, appending `-2`, `-3`, ... when the base is taken. */
async function uniqueSlug(
  name: string,
  excludeGroupId: number | null,
): Promise<string> {
  const prisma = getPrismaClient();
  const base = facultyGroupSlug(name);
  let candidate = base;
  for (let suffix = 2; suffix <= 200; suffix += 1) {
    const clash = await prisma.facultyGroup.findFirst({
      where: {
        slug: candidate,
        ...(excludeGroupId ? { id: { not: excludeGroupId } } : {}),
      },
      select: { id: true },
    });
    if (!clash) return candidate;
    candidate = `${base}-${suffix}`;
  }
  return `${base}-${Date.now()}`;
}

export async function saveFacultyGroup(
  formData: FormData,
): Promise<FacultyGroupActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Please log in again." };
  }

  const parsed = facultyGroupSchema.safeParse({
    name: formData.get("name"),
    sortOrder: formData.get("sortOrder") ?? 0,
  });
  if (!parsed.success) {
    return { success: false, error: "Enter a group name and a valid display order." };
  }

  const id = Number(formData.get("id"));
  const isUpdate = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();

  const previous = isUpdate
    ? await prisma.facultyGroup.findUnique({ where: { id } })
    : null;
  if (isUpdate && !previous) {
    return { success: false, error: "That group no longer exists. Refresh and try again." };
  }

  // Reject duplicate names (case-insensitive, whitespace-trimmed) up front so
  // two groups never differ only by capitalisation or spacing.
  const duplicate = await prisma.facultyGroup.findFirst({
    where: {
      name: { equals: parsed.data.name },
      ...(isUpdate ? { id: { not: id } } : {}),
    },
    select: { id: true },
  });
  if (duplicate) {
    return { success: false, error: `A group named "${parsed.data.name}" already exists.` };
  }

  const slug = await uniqueSlug(parsed.data.name, isUpdate ? id : null);

  try {
    const group = await prisma.$transaction(async (transaction) => {
      const saved = isUpdate
        ? await transaction.facultyGroup.update({
            where: { id },
            data: { name: parsed.data.name, sortOrder: parsed.data.sortOrder, slug },
          })
        : await transaction.facultyGroup.create({
            data: { name: parsed.data.name, sortOrder: parsed.data.sortOrder, slug },
          });

      // Keep the legacy denormalised `group` text in sync for renamed groups.
      if (isUpdate && previous && previous.name !== saved.name) {
        await transaction.faculty.updateMany({
          where: { groupId: saved.id },
          data: { group: saved.name },
        });
      }

      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: isUpdate ? "update" : "create",
          entityType: "FacultyGroup",
          entityId: String(saved.id),
          details: { name: saved.name, sortOrder: saved.sortOrder },
        },
      });

      return saved;
    });

    refreshGroups();
    return {
      success: true,
      message: isUpdate ? "Group updated." : `Group "${group.name}" added.`,
    };
  } catch (error) {
    console.error("Failed to save faculty group", error);
    return { success: false, error: "The group could not be saved. Please try again." };
  }
}

export async function deleteFacultyGroup(
  formData: FormData,
): Promise<FacultyGroupActionResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid group to delete." };
  }

  const prisma = getPrismaClient();
  const group = await prisma.facultyGroup.findUnique({
    where: { id },
    select: { id: true, name: true, _count: { select: { members: true } } },
  });
  if (!group) {
    return { success: false, error: "That group no longer exists." };
  }

  if (group._count.members > 0) {
    const noun = group._count.members === 1 ? "member" : "members";
    return {
      success: false,
      error: `"${group.name}" still has ${group._count.members} faculty ${noun}. Reassign them to another group (or leave the group empty) before deleting.`,
    };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "FacultyGroup",
          entityId: String(id),
          details: { name: group.name },
        },
      });
      await transaction.facultyGroup.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Failed to delete faculty group", error);
    return { success: false, error: "The group could not be deleted. Please try again." };
  }

  refreshGroups();
  return { success: true, message: `Group "${group.name}" removed.` };
}

/** Reorder groups so their `sortOrder` matches a supplied id sequence. */
export async function reorderFacultyGroups(
  formData: FormData,
): Promise<FacultyGroupActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Please log in again." };
  }

  const order = String(formData.get("order") ?? "")
    .split(",")
    .map((value) => Number(value.trim()))
    .filter((value) => Number.isSafeInteger(value) && value > 0);

  if (!order.length) {
    return { success: false, error: "No group order was provided." };
  }

  const prisma = getPrismaClient();
  const groups = await prisma.facultyGroup.findMany({ select: { id: true } });
  const known = new Set(groups.map((group) => group.id));
  if (order.length !== groups.length && !order.every((id) => known.has(id))) {
    return { success: false, error: "The group order is out of date. Refresh and try again." };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      for (let position = 0; position < order.length; position += 1) {
        await transaction.facultyGroup.update({
          where: { id: order[position] },
          data: { sortOrder: position },
        });
      }
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: "FacultyGroup",
          entityId: order.join(","),
          details: { order },
        },
      });
    });
  } catch (error) {
    console.error("Failed to reorder faculty groups", error);
    return { success: false, error: "The group order could not be saved. Please try again." };
  }

  refreshGroups();
  return { success: true, message: "Group order updated." };
}

/** Move one group up or down by one position (persisting a contiguous order). */
export async function moveFacultyGroup(
  formData: FormData,
): Promise<FacultyGroupActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Please log in again." };
  }

  const direction = formData.get("direction") === "up" ? "up" : "down";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid group to reorder." };
  }

  const prisma = getPrismaClient();

  try {
    await prisma.$transaction(async (transaction) => {
      const ordered = await transaction.facultyGroup.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        select: { id: true, sortOrder: true },
      });
      const index = ordered.findIndex((group) => group.id === id);
      const target = direction === "up" ? index - 1 : index + 1;

      if (index === -1 || target < 0 || target >= ordered.length) {
        // Out-of-range moves are a no-op rather than an error.
        return;
      }

      const reordered = [...ordered];
      const [moved] = reordered.splice(index, 1);
      reordered.splice(target, 0, moved);

      for (let position = 0; position < reordered.length; position += 1) {
        if (reordered[position].sortOrder !== position) {
          await transaction.facultyGroup.update({
            where: { id: reordered[position].id },
            data: { sortOrder: position },
          });
        }
      }

      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: "FacultyGroup",
          entityId: String(id),
          details: { direction },
        },
      });
    });
  } catch (error) {
    console.error("Failed to move faculty group", error);
    return { success: false, error: "The group could not be reordered. Please try again." };
  }

  refreshGroups();
  return { success: true, message: "Group order updated." };
}
