"use server";

import { revalidatePath } from "next/cache";
import {
  getCurrentAdmin,
  isAdministrator,
} from "@/src/lib/admin/authorization";
import {
  FACULTY_BULK_MAX,
  facultyBulkIdsSchema,
  type FacultyBulkResult,
} from "@/src/lib/admin/faculty-validation";
import { cleanupUnreferencedUploads } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

const invalidSelection = `Select between 1 and ${FACULTY_BULK_MAX} valid faculty records.`;

function refreshFaculty() {
  revalidatePath("/admin/faculty");
  revalidatePath("/admin/dashboard");
  revalidatePath("/faculty");
  revalidatePath("/");
}

async function authorise(): Promise<
  | { ok: true; adminId: number }
  | { ok: false; error: string }
> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      ok: false,
      error: "Your session has expired. Sign in again to continue.",
    };
  }
  if (!isAdministrator(admin)) {
    return {
      ok: false,
      error: "Only administrators can perform bulk faculty actions.",
    };
  }
  return { ok: true, adminId: admin.id };
}

function validateIds(ids: unknown): number[] | null {
  const parsed = facultyBulkIdsSchema.safeParse(ids);
  if (!parsed.success) return null;
  return [...new Set(parsed.data)];
}

async function setPublished(ids: number[], isPublished: boolean) {
  const auth = await authorise();
  if (!auth.ok) return { success: false, error: auth.error } as FacultyBulkResult;

  const safeIds = validateIds(ids);
  if (!safeIds) {
    return { success: false, error: invalidSelection } as FacultyBulkResult;
  }

  const prisma = getPrismaClient();
  try {
    const members = await prisma.faculty.findMany({
      where: { id: { in: safeIds } },
      select: { id: true, name: true, isPublished: true },
    });
    if (!members.length) {
      return {
        success: false,
        error: "None of the selected faculty members exist.",
      } as FacultyBulkResult;
    }

    const memberIds = members.map((member) => member.id);
    const changedIds = members
      .filter((member) => member.isPublished !== isPublished)
      .map((member) => member.id);

    await prisma.$transaction([
      prisma.faculty.updateMany({
        where: { id: { in: changedIds } },
        data: { isPublished },
      }),
      prisma.adminAuditLog.createMany({
        data: members.map((member) => ({
          actorId: auth.adminId,
          action: isPublished ? "publish" : "unpublish",
          entityType: "Faculty",
          entityId: String(member.id),
          details: {
            name: member.name,
            isPublished,
            bulk: true,
          },
        })),
      }),
    ]);

    refreshFaculty();
    return {
      success: true,
      count: memberIds.length,
      ids: memberIds,
    } as FacultyBulkResult;
  } catch (error) {
    console.error("Bulk faculty publish/unpublish failed:", error);
    return {
      success: false,
      error: isPublished
        ? "The selected faculty members could not be published. Please try again."
        : "The selected faculty members could not be unpublished. Please try again.",
    } as FacultyBulkResult;
  }
}

export async function bulkPublishFaculty(
  ids: number[],
): Promise<FacultyBulkResult> {
  return setPublished(ids, true);
}

export async function bulkUnpublishFaculty(
  ids: number[],
): Promise<FacultyBulkResult> {
  return setPublished(ids, false);
}

export async function bulkDeleteFaculty(
  ids: number[],
): Promise<FacultyBulkResult> {
  const auth = await authorise();
  if (!auth.ok) return { success: false, error: auth.error };

  const safeIds = validateIds(ids);
  if (!safeIds) return { success: false, error: invalidSelection };

  const prisma = getPrismaClient();
  try {
    const members = await prisma.faculty.findMany({
      where: { id: { in: safeIds } },
      select: { id: true, name: true, designation: true, photo: true },
    });
    if (!members.length) {
      return {
        success: false,
        error: "None of the selected faculty members exist.",
      };
    }

    const memberIds = members.map((member) => member.id);

    await prisma.$transaction([
      prisma.faculty.deleteMany({ where: { id: { in: memberIds } } }),
      prisma.adminAuditLog.createMany({
        data: members.map((member) => ({
          actorId: auth.adminId,
          action: "delete",
          entityType: "Faculty",
          entityId: String(member.id),
          details: {
            name: member.name,
            designation: member.designation,
            bulk: true,
          },
        })),
      }),
    ]);

    const photos = members
      .map((member) => member.photo)
      .filter((photo): photo is string => Boolean(photo));
    if (photos.length) {
      await cleanupUnreferencedUploads(photos);
    }

    refreshFaculty();
    return { success: true, count: memberIds.length, ids: memberIds };
  } catch (error) {
    console.error("Bulk faculty delete failed:", error);
    return {
      success: false,
      error: "The selected faculty members could not be deleted. Please try again.",
    };
  }
}
