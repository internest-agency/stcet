"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  isAdministrator,
  requireAdmin,
  requireAdministrator,
} from "@/src/lib/admin/authorization";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import {
  galleryCategorySchema,
  galleryImageSchema,
} from "@/src/lib/admin/gallery-validation";
import { getPrismaClient } from "@/src/lib/prisma";

function duplicateError(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function refreshGallery() {
  revalidatePath("/admin/gallery");
  revalidatePath("/gallery");
}

function categoryInput(formData: FormData) {
  return galleryCategorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
  });
}

export async function saveGalleryCategory(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const parsed = categoryInput(formData);
  if (!parsed.success) redirect("/admin/gallery?error=category-invalid");

  const id = Number(formData.get("categoryId"));
  const isUpdate = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();

  try {
    await prisma.$transaction(async (transaction) => {
      const category = isUpdate
        ? await transaction.galleryCategory.update({
            where: { id },
            data: parsed.data,
          })
        : await transaction.galleryCategory.create({ data: parsed.data });

      await transaction.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: isUpdate ? "update" : "create",
          entityType: "GalleryCategory",
          entityId: String(category.id),
          details: {
            name: category.name,
            slug: category.slug,
            isActive: category.isActive,
          },
        },
      });
    });
  } catch (error) {
    if (duplicateError(error)) {
      redirect("/admin/gallery?error=category-duplicate");
    }
    redirect("/admin/gallery?error=save");
  }

  refreshGallery();
  redirect("/admin/gallery?saved=category");
}

export async function deleteGalleryCategory(
  formData: FormData,
): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("categoryId"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin/gallery?error=category-invalid");
  }

  const prisma = getPrismaClient();
  const category = await prisma.galleryCategory.findUnique({
    where: { id },
    include: { _count: { select: { images: true } } },
  });
  if (!category) redirect("/admin/gallery?error=category-missing");
  if (category._count.images > 0) {
    redirect("/admin/gallery?error=category-in-use");
  }

  await prisma.$transaction(async (transaction) => {
    await transaction.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "GalleryCategory",
        entityId: String(category.id),
        details: { name: category.name, slug: category.slug },
      },
    });
    await transaction.galleryCategory.delete({ where: { id } });
  });

  refreshGallery();
  redirect("/admin/gallery?deleted=category");
}

export async function saveGalleryImage(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = galleryImageSchema.safeParse({
    title: formData.get("title"),
    altText: formData.get("altText"),
    categoryId: formData.get("categoryId"),
    imagePath: formData.get("imagePath"),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) redirect("/admin/gallery?error=image-invalid");

  const id = Number(formData.get("imageId"));
  const isUpdate = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = isUpdate
    ? await prisma.galleryImage.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          imagePath: true,
          categoryId: true,
          isPublished: true,
        },
      })
    : null;

  if (isUpdate && !previous) redirect("/admin/gallery?error=image-missing");
  if (previous?.isPublished && !isAdministrator(admin)) {
    redirect("/admin/gallery?error=forbidden");
  }

  const category = await prisma.galleryCategory.findUnique({
    where: { id: parsed.data.categoryId },
    select: { id: true, isActive: true },
  });
  if (
    !category ||
    (!category.isActive && category.id !== previous?.categoryId)
  ) {
    redirect("/admin/gallery?error=category-inactive");
  }

  if (
    !(await validateImageReferences(
      [parsed.data.imagePath],
      previous ? [previous.imagePath] : [],
    ))
  ) {
    redirect("/admin/gallery?error=image-unregistered");
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  const data = {
    title: parsed.data.title,
    altText: parsed.data.altText,
    categoryId: parsed.data.categoryId,
    imagePath: parsed.data.imagePath,
    sortOrder: parsed.data.sortOrder,
    isPublished,
  };

  try {
    const image = await prisma.$transaction(async (transaction) => {
      const saved = isUpdate
        ? await transaction.galleryImage.update({ where: { id }, data })
        : await transaction.galleryImage.create({ data });

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
          entityType: "GalleryImage",
          entityId: String(saved.id),
          details: {
            title: saved.title,
            categoryId: saved.categoryId,
            isPublished: saved.isPublished,
          },
        },
      });

      return saved;
    });

    if (previous && previous.imagePath !== image.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    if (!isUpdate || parsed.data.imagePath !== previous?.imagePath) {
      await cleanupUnreferencedUploads([parsed.data.imagePath]);
    }
    if (duplicateError(error)) redirect("/admin/gallery?error=image-duplicate");
    redirect("/admin/gallery?error=save");
  }

  refreshGallery();
  redirect("/admin/gallery?saved=image");
}

export async function deleteGalleryImage(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("imageId"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    redirect("/admin/gallery?error=image-invalid");
  }

  const prisma = getPrismaClient();
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) redirect("/admin/gallery?error=image-missing");

  await prisma.$transaction(async (transaction) => {
    await transaction.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "GalleryImage",
        entityId: String(image.id),
        details: { title: image.title, imagePath: image.imagePath },
      },
    });
    await transaction.galleryImage.delete({ where: { id } });
  });

  await cleanupUnreferencedUploads([image.imagePath]);
  refreshGallery();
  redirect("/admin/gallery?deleted=image");
}
