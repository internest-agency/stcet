"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import { scholarshipSchema } from "@/src/lib/admin/scholarship-validation";
import { getPrismaClient } from "@/src/lib/prisma";

function refreshScholarships() {
  revalidatePath("/admin/scholarships");
  revalidatePath("/scholarships");
}

export async function saveScholarship(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = scholarshipSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || null,
    eligibility: formData.get("eligibility") || null,
    financialBenefit: formData.get("financialBenefit") || null,
    incomeLimit: formData.get("incomeLimit") || null,
    applicationInstructions: formData.get("applicationInstructions") || null,
    applicationUrl: formData.get("applicationUrl") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) redirect("/admin/scholarships?error=invalid");

  const id = Number(formData.get("id"));
  const isUpdate = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = isUpdate
    ? await prisma.scholarship.findUnique({
        where: { id },
        select: { id: true, isPublished: true },
      })
    : null;

  if (isUpdate && !previous) redirect("/admin/scholarships?error=missing");
  if (previous?.isPublished && !isAdministrator(admin)) {
    redirect("/admin/scholarships?error=forbidden");
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try {
    await prisma.$transaction(async (transaction) => {
      const scholarship = isUpdate
        ? await transaction.scholarship.update({
            where: { id },
            data: { ...parsed.data, isPublished },
          })
        : await transaction.scholarship.create({
            data: { ...parsed.data, isPublished },
          });

      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: isUpdate
            ? previous?.isPublished === isPublished
              ? "update"
              : isPublished
                ? "publish"
                : "unpublish"
            : isPublished
              ? "create_publish"
              : "create",
          entityType: "Scholarship",
          entityId: String(scholarship.id),
          details: { name: scholarship.name, isPublished },
        },
      });
    });
  } catch {
    redirect("/admin/scholarships?error=save");
  }

  refreshScholarships();
  redirect("/admin/scholarships?saved=1");
}

export async function deleteScholarship(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin/scholarships?error=invalid");
  }

  const prisma = getPrismaClient();
  const scholarship = await prisma.scholarship.findUnique({ where: { id } });
  if (!scholarship) redirect("/admin/scholarships?error=missing");

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "Scholarship",
          entityId: String(scholarship.id),
          details: { name: scholarship.name },
        },
      });
      await transaction.scholarship.delete({ where: { id } });
    });
  } catch {
    redirect("/admin/scholarships?error=delete");
  }

  refreshScholarships();
  redirect("/admin/scholarships?deleted=1");
}
