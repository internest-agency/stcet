"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import { infrastructureFacilitySchema } from "@/src/lib/admin/infrastructure-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";

export type InfrastructureFacilityFormState = {
  formError?: string;
  fieldErrors?: Record<string, string>;
};

function refreshInfrastructure() {
  revalidatePath("/admin/infrastructure");
  revalidatePath("/infrastructure");
}

function getPrismaErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002": {
        const target = error.meta?.target as string[] | undefined;
        if (target?.includes("title")) {
          return "A facility with this title already exists.";
        }
        return "A duplicate value was provided for a unique field.";
      }
      case "P2003":
        return "A referenced record does not exist.";
      case "P2025":
        return "The record you are trying to update does not exist.";
      default:
        return `Database error: ${error.code}`;
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    console.error("Prisma validation error:", error.message);
    return `Invalid data: ${error.message}`;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred while saving the facility.";
}

export async function saveInfrastructureFacility(
  _previousState: InfrastructureFacilityFormState,
  formData: FormData,
): Promise<InfrastructureFacilityFormState> {
  const admin = await requireAdmin();
  const parsed = infrastructureFacilitySchema.safeParse({
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description") || null,
    imagePath: formData.get("imagePath") || null,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    isPublished: formData.get("isPublished") === "on",
    layout: formData.get("layout") || null,
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const [field, errors] of Object.entries(parsed.error.flatten().fieldErrors)) {
      if (errors?.[0]) fieldErrors[field] = errors[0];
    }
    return { formError: "Please correct the highlighted facility details.", fieldErrors };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.infrastructureFacility.findUnique({ where: { id } })
    : null;

  if (updating && !previous) return { formError: "This facility no longer exists." };
  if (previous?.isPublished && !isAdministrator(admin)) {
    return { formError: "Only an administrator can edit a published facility." };
  }

  const description = parsed.data.description
    ? sanitizeHtml(parsed.data.description)
    : null;

  if (
    !(await validateImageReferences(
      [parsed.data.imagePath ?? ""],
      previous?.imagePath ? [previous.imagePath] : [],
    ))
  ) {
    return { formError: "Select an uploaded and verified facility image." };
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        category: parsed.data.category,
        title: parsed.data.title,
        description,
        imagePath: parsed.data.imagePath ?? null,
        sortOrder: parsed.data.sortOrder,
        isActive: parsed.data.isActive,
        isPublished,
        layout: parsed.data.layout ?? "image-top",
      };
      const record = updating
        ? await tx.infrastructureFacility.update({ where: { id }, data })
        : await tx.infrastructureFacility.create({ data });

      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "InfrastructureFacility",
          entityId: String(record.id),
          details: {
            title: record.title,
            category: record.category,
            isPublished,
            isActive: record.isActive,
            layout: record.layout,
          },
        },
      });
      return record;
    });

    if (previous?.imagePath && previous.imagePath !== saved.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    console.error("Infrastructure facility save failed", error);
    if (error instanceof Prisma.PrismaClientValidationError) {
      console.error("Prisma validation error details:", error.message);
    }
    return { formError: getPrismaErrorMessage(error) };
  }

  refreshInfrastructure();
  redirect("/admin/infrastructure?saved=1");
}

export async function deleteInfrastructureFacility(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin/infrastructure?error=invalid");
  }

  const prisma = getPrismaClient();
  const facility = await prisma.infrastructureFacility.findUnique({ where: { id } });
  if (!facility) redirect("/admin/infrastructure?error=missing");

  await prisma.$transaction(async (tx) => {
    await tx.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "InfrastructureFacility",
        entityId: String(id),
        details: { title: facility.title },
      },
    });
    await tx.infrastructureFacility.delete({ where: { id } });
  });

  await cleanupUnreferencedUploads([facility.imagePath ?? ""]);
  refreshInfrastructure();
  redirect("/admin/infrastructure?deleted=1");
}