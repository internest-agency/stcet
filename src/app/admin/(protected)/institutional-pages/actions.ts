"use server";
import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin, isAdministrator } from "@/src/lib/admin/authorization";
import { institutionalPageSchema, pageSectionSchema } from "@/src/lib/admin/institutional-validation";
import { cleanupUnreferencedUploads, validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

/**
 * Result returned by the page/section form actions. Returning a value (rather
 * than redirecting) lets the client keep the editor open and preserve the
 * user's input when validation or persistence fails.
 */
export type SaveResult =
  | { success: true; message: string }
  | { success: false; error: string };

function duplicate(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export async function saveInstitutionalPage(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Your session has expired. Sign in again to continue." };

  const parsed = institutionalPageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    introduction: formData.get("introduction") || null,
    seoTitle: formData.get("seoTitle") || null,
    metaDescription: formData.get("metaDescription") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) return { success: false, error: "Check the required fields and try again." };

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.institutionalPage.findUnique({ where: { id } }) : null;
  if (updating && !previous) return { success: false, error: "This page no longer exists. Refresh and try again." };
  if (previous?.isPublished && !isAdministrator(admin)) return { success: false, error: "Only administrators can edit a published page." };

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try {
    await prisma.$transaction(async (tx) => {
      const page = updating
        ? await tx.institutionalPage.update({
            where: { id },
            data: {
              ...parsed.data,
              introduction: parsed.data.introduction ?? null,
              seoTitle: parsed.data.seoTitle ?? null,
              metaDescription: parsed.data.metaDescription ?? null,
              isPublished,
            },
          })
        : await tx.institutionalPage.create({
            data: {
              ...parsed.data,
              introduction: parsed.data.introduction ?? null,
              seoTitle: parsed.data.seoTitle ?? null,
              metaDescription: parsed.data.metaDescription ?? null,
              isPublished,
            },
          });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "InstitutionalPage",
          entityId: String(page.id),
          details: { slug: page.slug, isPublished },
        },
      });
    });
  } catch (error) {
    console.error("Institutional page save failed:", error);
    if (duplicate(error)) return { success: false, error: "A page with this slug already exists." };
    return { success: false, error: "The page could not be saved. Please try again." };
  }

  revalidatePath("/admin/institutional-pages");
  revalidatePath(`/${parsed.data.slug}`);
  if (previous && previous.slug !== parsed.data.slug) revalidatePath(`/${previous.slug}`);
  return { success: true, message: updating ? "Page updated." : "Page created." };
}

export async function savePageSection(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Your session has expired. Sign in again to continue." };

  const parsed = pageSectionSchema.safeParse({
    pageId: formData.get("pageId"),
    title: formData.get("title"),
    content: formData.get("content") || null,
    imagePath: formData.get("imagePath") || null,
    layout: formData.get("layout"),
    sortOrder: formData.get("sortOrder"),
  });
  if (!parsed.success) return { success: false, error: "Check the section title and layout, then try again." };

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.pageSection.findUnique({ where: { id } }) : null;
  if (updating && !previous) return { success: false, error: "This section no longer exists. Refresh and try again." };

  if (!(await validateImageReferences([parsed.data.imagePath ?? ""], previous?.imagePath ? [previous.imagePath] : []))) {
    return { success: false, error: "The selected image could not be verified. Upload it again." };
  }

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const section = updating
        ? await tx.pageSection.update({
            where: { id },
            data: { ...parsed.data, content: parsed.data.content ?? null, imagePath: parsed.data.imagePath ?? null },
          })
        : await tx.pageSection.create({
            data: { ...parsed.data, content: parsed.data.content ?? null, imagePath: parsed.data.imagePath ?? null },
          });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "PageSection",
          entityId: String(section.id),
          details: { pageId: section.pageId, title: section.title },
        },
      });
      return section;
    });
    if (previous?.imagePath && previous.imagePath !== saved.imagePath) await cleanupUnreferencedUploads([previous.imagePath]);
  } catch (error) {
    console.error("Page section save failed:", error);
    return { success: false, error: "The section could not be saved. Please try again." };
  }

  revalidatePath("/admin/institutional-pages");
  return { success: true, message: updating ? "Section updated." : "Section added." };
}

export async function deletePageSection(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Your session has expired. Sign in again to continue." };
  if (!isAdministrator(admin)) return { success: false, error: "Only administrators can delete sections." };

  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) return { success: false, error: "Select a valid section to delete." };

  const prisma = getPrismaClient();
  const section = await prisma.pageSection.findUnique({ where: { id } });
  if (!section) return { success: false, error: "This section no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({ data: { actorId: admin.id, action: "delete", entityType: "PageSection", entityId: String(id) } });
      await tx.pageSection.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Page section delete failed:", error);
    return { success: false, error: "The section could not be deleted. Please try again." };
  }

  await cleanupUnreferencedUploads([section.imagePath ?? ""]);
  revalidatePath("/admin/institutional-pages");
  return { success: true, message: "Section deleted." };
}

export type DeleteInstitutionalPageResult = { success: true } | { success: false; error: string };

export async function deleteInstitutionalPage(pageId: unknown): Promise<DeleteInstitutionalPageResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: "Your session has expired. Sign in again to continue." };
  if (!isAdministrator(admin)) return { success: false, error: "Only administrators can delete institutional pages." };

  const id = typeof pageId === "number" ? pageId : Number(pageId);
  if (!Number.isSafeInteger(id) || id <= 0) return { success: false, error: "Select a valid institutional page to delete." };

  const prisma = getPrismaClient();
  let page: { id: number; slug: string; title: string; sections: { imagePath: string | null }[] } | null = null;
  try {
    page = await prisma.institutionalPage.findUnique({ where: { id }, select: { id: true, slug: true, title: true, sections: { select: { imagePath: true } } } });
  } catch (error) {
    console.error("Institutional page lookup failed:", error);
    return { success: false, error: "The page could not be deleted. Please try again." };
  }
  if (!page) return { success: false, error: "This institutional page no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({ data: { actorId: admin.id, action: "delete", entityType: "InstitutionalPage", entityId: String(page.id), details: { slug: page.slug, title: page.title, sections: page.sections.length } } });
      await tx.institutionalPage.delete({ where: { id: page.id } });
    });
  } catch (error) {
    console.error("Institutional page delete failed:", error);
    return { success: false, error: "The page could not be deleted. Please try again." };
  }

  const images = page.sections.map((section) => section.imagePath).filter((image): image is string => Boolean(image));
  if (images.length) await cleanupUnreferencedUploads(images);

  revalidatePath("/admin/institutional-pages");
  revalidatePath(`/${page.slug}`);
  return { success: true };
}
