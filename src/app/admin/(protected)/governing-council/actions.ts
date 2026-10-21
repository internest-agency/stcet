"use server";

import { revalidatePath } from "next/cache";
import {
  getCurrentAdmin,
  isAdministrator,
  requireAdministrator,
  type CurrentAdmin,
} from "@/src/lib/admin/authorization";
import { governingCouncilMemberSchema } from "@/src/lib/admin/governing-council-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";

/** Mirrors the About/institutional result contract so the client can keep the form open on failure. */
export type GoverningCouncilResult =
  | { success: true; message: string }
  | { success: false; error: string };

function refresh() {
  revalidatePath("/admin/governing-council");
  revalidatePath("/about");
}

function sanitize(value: unknown): unknown {
  return typeof value === "string" ? sanitizeHtml(value) : value;
}

/**
 * Resolve the publish flag. Only administrators can change it; content editors
 * keep the existing state (or published for new rows) so saving never silently
 * unpublishes live content.
 */
function resolvePublished(
  admin: CurrentAdmin,
  requested: boolean,
  previous: { isPublished: boolean } | null,
) {
  if (isAdministrator(admin)) return requested;
  return previous ? previous.isPublished : true;
}

export async function saveGoverningCouncilMember(
  formData: FormData,
): Promise<GoverningCouncilResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = governingCouncilMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    imagePath: formData.get("imagePath") || null,
    imageAlt: formData.get("imageAlt") || null,
    biography: sanitize(formData.get("biography") || null),
    sortOrder: formData.get("sortOrder") ?? 0,
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Enter a name and role, then check the fields and try again." };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.governingCouncilMember.findUnique({ where: { id } })
    : null;
  if (updating && !previous) {
    return { success: false, error: "This council member no longer exists. Refresh and try again." };
  }

  if (
    !(await validateImageReferences(
      [parsed.data.imagePath ?? ""],
      previous?.imagePath ? [previous.imagePath] : [],
    ))
  ) {
    return { success: false, error: "The selected photograph could not be verified. Upload it again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        name: parsed.data.name,
        role: parsed.data.role,
        imagePath: parsed.data.imagePath ?? null,
        imageAlt: parsed.data.imageAlt ?? null,
        biography: parsed.data.biography ?? null,
        sortOrder: parsed.data.sortOrder,
        isPublished,
      };
      const member = updating
        ? await tx.governingCouncilMember.update({ where: { id }, data })
        : await tx.governingCouncilMember.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "GoverningCouncilMember",
          entityId: String(member.id),
          details: { name: member.name, role: member.role, isPublished },
        },
      });
      return member;
    });

    if (previous?.imagePath && previous.imagePath !== saved.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    console.error("Governing council member save failed:", error);
    return { success: false, error: "The council member could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: updating ? "Council member updated." : "Council member added." };
}

export async function deleteGoverningCouncilMember(
  formData: FormData,
): Promise<GoverningCouncilResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid council member to delete." };
  }

  const prisma = getPrismaClient();
  const member = await prisma.governingCouncilMember.findUnique({ where: { id } });
  if (!member) {
    return { success: false, error: "This council member no longer exists." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "GoverningCouncilMember",
          entityId: String(id),
          details: { name: member.name },
        },
      });
      await tx.governingCouncilMember.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Governing council member delete failed:", error);
    return { success: false, error: "The council member could not be deleted. Please try again." };
  }

  await cleanupUnreferencedUploads([member.imagePath ?? ""]);
  refresh();
  return { success: true, message: "Council member removed." };
}

/** Return a new ordering with `id` shifted one step, or null when it cannot move. */
function reorder<T extends { id: number; sortOrder: number }>(
  items: T[],
  id: number,
  direction: "up" | "down",
): T[] | null {
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= items.length) return null;
  const ordered = [...items];
  const [moved] = ordered.splice(index, 1);
  ordered.splice(target, 0, moved);
  return ordered;
}

export async function moveGoverningCouncilMember(
  formData: FormData,
): Promise<GoverningCouncilResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const direction = formData.get("direction") === "up" ? "up" : "down";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid council member to reorder." };
  }

  const prisma = getPrismaClient();

  try {
    await prisma.$transaction(async (tx) => {
      const ordered = reorder(
        await tx.governingCouncilMember.findMany({
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        id,
        direction,
      );
      if (ordered) {
        for (let position = 0; position < ordered.length; position += 1) {
          if (ordered[position].sortOrder !== position) {
            await tx.governingCouncilMember.update({
              where: { id: ordered[position].id },
              data: { sortOrder: position },
            });
          }
        }
      }

      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: "GoverningCouncilMember",
          entityId: String(id),
          details: { direction },
        },
      });
    });
  } catch (error) {
    console.error("Governing council reorder failed:", error);
    return { success: false, error: "The council member could not be reordered. Please try again." };
  }

  refresh();
  return { success: true, message: "Order updated." };
}
