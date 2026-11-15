"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { invalidateSiteSettingsCache } from "@/src/lib/admin/settings";
import { validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { z } from "zod";
const schema = z.object({ id: z.coerce.number().int().positive().optional(), pagePath: z.string().trim().regex(/^\/[a-z0-9/-]*$/).max(191), pageTitle: z.string().trim().min(2).max(191), seoTitle: z.string().trim().max(191).optional().nullable(), metaDescription: z.string().trim().max(320).optional().nullable(), canonicalUrl: z.string().trim().url().max(2048).optional().nullable(), ogImage: z.string().trim().max(2048).optional().nullable(), noIndex: z.boolean().default(false) });
export async function savePageSeo(formData: FormData): Promise<never> { const admin = await requireAdministrator(); const parsed = schema.safeParse({ id: formData.get("id") || undefined, pagePath: formData.get("pagePath"), pageTitle: formData.get("pageTitle"), seoTitle: formData.get("seoTitle") || null, metaDescription: formData.get("metaDescription") || null, canonicalUrl: formData.get("canonicalUrl") || null, ogImage: formData.get("ogImage") || null, noIndex: formData.get("noIndex") === "on" }); if (!parsed.success) redirect("/admin/seo?error=invalid"); if (!(await validateImageReferences([parsed.data.ogImage ?? ""]))) redirect("/admin/seo?error=image"); const prisma = getPrismaClient(); try { const record = parsed.data.id ? await prisma.pageSeo.update({ where: { id: parsed.data.id }, data: { ...parsed.data, id: undefined, seoTitle: parsed.data.seoTitle ?? null, metaDescription: parsed.data.metaDescription ?? null, canonicalUrl: parsed.data.canonicalUrl ?? null, ogImage: parsed.data.ogImage ?? null } }) : await prisma.pageSeo.upsert({ where: { pagePath: parsed.data.pagePath }, create: { ...parsed.data, seoTitle: parsed.data.seoTitle ?? null, metaDescription: parsed.data.metaDescription ?? null, canonicalUrl: parsed.data.canonicalUrl ?? null, ogImage: parsed.data.ogImage ?? null }, update: { pageTitle: parsed.data.pageTitle, seoTitle: parsed.data.seoTitle ?? null, metaDescription: parsed.data.metaDescription ?? null, canonicalUrl: parsed.data.canonicalUrl ?? null, ogImage: parsed.data.ogImage ?? null, noIndex: parsed.data.noIndex } }); await prisma.adminAuditLog.create({ data: { actorId: admin.id, action: "update", entityType: "PageSeo", entityId: String(record.id), details: { pagePath: record.pagePath } } }); } catch { redirect("/admin/seo?error=save"); } revalidatePath(parsed.data.pagePath); revalidatePath("/admin/seo"); redirect("/admin/seo?saved=1"); }

const customCodeSchema = z.object({
  customHeadCode: z.string().max(50000).optional().nullable(),
  customBodyEndCode: z.string().max(50000).optional().nullable(),
});

export async function saveCustomCode(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();

  if (!isDatabaseConfigured()) {
    redirect(
      `/admin/seo?code_error=${encodeURIComponent(
        "custom_code: Database is not configured.",
      )}`,
    );
  }

  const parsed = customCodeSchema.safeParse({
    customHeadCode: formData.get("customHeadCode") ?? null,
    customBodyEndCode: formData.get("customBodyEndCode") ?? null,
  });

  if (!parsed.success) {
    const message = parsed.error.issues
      .map((issue) => `${issue.path.join(".") || "code"}: ${issue.message}`)
      .join("; ");
    redirect(`/admin/seo?code_error=${encodeURIComponent(message)}`);
  }

  const prisma = getPrismaClient();
  const data = {
    customHeadCode: parsed.data.customHeadCode?.trim()
      ? parsed.data.customHeadCode
      : null,
    customBodyEndCode: parsed.data.customBodyEndCode?.trim()
      ? parsed.data.customBodyEndCode
      : null,
  };

  try {
    const existing = await prisma.siteSettings.findFirst({
      select: { id: true },
    });

    let settingsId: number;
    if (existing) {
      const record = await prisma.siteSettings.update({
        where: { id: existing.id },
        data,
        select: { id: true },
      });
      settingsId = record.id;
    } else {
      const record = await prisma.siteSettings.create({
        data: { collegeName: "STCET", ...data },
        select: { id: true },
      });
      settingsId = record.id;
    }

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "update",
        entityType: "SiteSettings",
        entityId: String(settingsId),
        details: { section: "customCode" },
      },
    });
  } catch (error) {
    console.error("[saveCustomCode] Database error:", error);
    const detail =
      error instanceof Error ? error.message : "Unknown database error";
    redirect(
      `/admin/seo?code_error=${encodeURIComponent(`custom_code: ${detail}`)}`,
    );
  }

  invalidateSiteSettingsCache();
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");
  redirect("/admin/seo?code_saved=1");
}