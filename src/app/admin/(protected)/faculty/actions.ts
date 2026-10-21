"use server";

import { revalidatePath } from "next/cache";
import { getCurrentAdmin, isAdministrator, requireAdministrator } from "@/src/lib/admin/authorization";
import {
  facultyEditorSchema,
  type FacultyEditorInput,
} from "@/src/lib/admin/faculty-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

export type FacultyActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

function readFaculty(formData: FormData) {
  return facultyEditorSchema.safeParse({
    name: formData.get("name"),
    designation: formData.get("designation"),
    department: formData.get("department") ?? "",
    group: formData.get("group") ?? "",
    groupId: formData.get("groupId") ?? "",
    auFin: formData.get("auFin") ?? "",
    aicteId: formData.get("aicteId") ?? "",
    qualification: formData.get("qualification") ?? "",
    specialization: formData.get("specialization") ?? "",
    experience: formData.get("experience") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    photo: formData.get("photo") ?? "",
    bio: formData.get("bio") ?? "",
    sortOrder: formData.get("sortOrder") ?? "0",
    isPublished: formData.get("isPublished") === "on",
  });
}

function facultyData(
  content: FacultyEditorInput,
  isPublished: boolean,
  group: { id: number; name: string } | null,
) {
  return {
    name: content.name,
    designation: content.designation,
    department: content.department || null,
    group: group?.name ?? null,
    groupId: group?.id ?? null,
    auFin: content.auFin || null,
    aicteId: content.aicteId || null,
    qualification: content.qualification || null,
    specialization: content.specialization || null,
    experience: content.experience ?? null,
    email: content.email || null,
    phone: content.phone || null,
    photo: content.photo || null,
    bio: content.bio || null,
    sortOrder: content.sortOrder,
    isPublished,
  };
}

  function refreshFaculty() {
  revalidatePath("/admin/faculty");
  revalidatePath("/admin/faculty/groups");
  revalidatePath("/faculty");
  revalidatePath("/faculties");
  revalidatePath("/");
}

export async function saveFaculty(formData: FormData): Promise<FacultyActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Please log in again." };
  }

  const parsed = readFaculty(formData);
  if (!parsed.success) {
    return { success: false, error: "Review the faculty details and try again." };
  }

  const id = Number(formData.get("facultyId"));
  const isUpdate = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();

  const previous = isUpdate
    ? await prisma.faculty.findUnique({
        where: { id },
        select: { id: true, name: true, photo: true, isPublished: true },
      })
    : null;

  if (isUpdate && !previous) {
    return { success: false, error: "That faculty member no longer exists." };
  }

  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Editors cannot change published faculty profiles. Ask an administrator to unpublish it first.",
    };
  }

  const resolvedGroup = parsed.data.groupId
    ? await prisma.facultyGroup.findUnique({ where: { id: parsed.data.groupId }, select: { id: true, name: true } })
    : null;
  if (parsed.data.groupId && !resolvedGroup) {
    return { success: false, error: "Select a valid faculty group." };
  }

  const photo = parsed.data.photo || "";
  if (
    !(await validateImageReferences(
      [photo],
      previous?.photo ? [previous.photo] : [],
    ))
  ) {
    return { success: false, error: "Upload a valid photograph before saving the profile." };
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  const data = facultyData(parsed.data, isPublished, resolvedGroup);

  try {
    const member = await prisma.$transaction(async (transaction) => {
      const saved = isUpdate
        ? await transaction.faculty.update({ where: { id }, data })
        : await transaction.faculty.create({ data });

      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: previous
            ? previous.isPublished === isPublished
              ? "update"
              : isPublished
                ? "publish"
                : "unpublish"
            : isPublished
              ? "create_publish"
              : "create",
          entityType: "Faculty",
          entityId: String(saved.id),
          details: {
            name: saved.name,
            designation: saved.designation,
            isPublished: saved.isPublished,
          },
        },
      });

      return saved;
    });

    if (previous && previous.photo && previous.photo !== member.photo) {
      await cleanupUnreferencedUploads([previous.photo]);
    }

    refreshFaculty();
    return { success: true, message: "Faculty profile saved." };
  } catch (error) {
    // Do not cleanup newly uploaded photo on failure; keep it to preserve user input in modal.
    console.error("Failed to save faculty", error);
    return {
      success: false,
      error: "The faculty change could not be saved. Check the database and try again.",
    };
  }
}

export async function deleteFaculty(id: number): Promise<FacultyActionResult> {
  const admin = await requireAdministrator();
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "That faculty member is not valid." };
  }

  const prisma = getPrismaClient();
  const member = await prisma.faculty.findUnique({ where: { id } });
  if (!member) {
    return { success: false, error: "That faculty member no longer exists." };
  }

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "Faculty",
          entityId: String(member.id),
          details: {
            name: member.name,
            designation: member.designation,
          },
        },
      });
      await transaction.faculty.delete({ where: { id } });
    });

    if (member.photo) {
      await cleanupUnreferencedUploads([member.photo]);
    }
    refreshFaculty();
    return { success: true, message: "Faculty member removed." };
  } catch (error) {
    console.error("Failed to delete faculty", error);
    return {
      success: false,
      error: "The faculty member could not be deleted. Please try again.",
    };
  }
}
