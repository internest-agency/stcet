"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";
import { invalidateSiteSettingsCache } from "@/src/lib/admin/settings";
import { z } from "zod";
import { Prisma } from "@/src/generated/prisma/client";

const footerLinkSchema = z.object({
  label: z.string().min(1).max(500),
  url: z.string().min(1).max(2048),
});

const footerLinksSchema = z.object({
  importantLinks: z.array(footerLinkSchema).default([]),
  quickLinks: z.array(footerLinkSchema).default([]),
});

const schema = z.object({
  collegeName: z.string().trim().min(2).max(191),
  contactEmail: z.string().trim().email().max(255).optional().nullable(),
  phoneNumber: z.string().trim().max(50).optional().nullable(),
  alternativePhone: z.string().trim().max(50).optional().nullable(),
  address: z.string().trim().max(10_000).optional().nullable(),
  footerText: z.string().trim().max(10_000).optional().nullable(),
  defaultSeoTitle: z.string().trim().max(191).optional().nullable(),
  defaultMetaDescription: z.string().trim().max(320).optional().nullable(),
  logoPath: z.string().trim().max(2048).optional().nullable(),
  faviconPath: z.string().trim().max(2048).optional().nullable(),
  socialLinks: z.string().trim().optional().nullable(),
  footerLinks: z.string().trim().optional().nullable(),
});

export async function saveSettings(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();

  const parsed = schema.safeParse({
    collegeName: formData.get("collegeName"),
    contactEmail: formData.get("contactEmail") || null,
    phoneNumber: formData.get("phoneNumber") || null,
    alternativePhone: formData.get("alternativePhone") || null,
    address: formData.get("address") || null,
    footerText: formData.get("footerText") || null,
    defaultSeoTitle: formData.get("defaultSeoTitle") || null,
    defaultMetaDescription: formData.get("defaultMetaDescription") || null,
    logoPath: formData.get("logoPath") || null,
    faviconPath: formData.get("faviconPath") || null,
    socialLinks: formData.get("socialLinks") || null,
    footerLinks: formData.get("footerLinks") || null,
  });

  if (
    !parsed.success ||
    !(await validateImageReferences([
      parsed.data.logoPath ?? "",
      parsed.data.faviconPath ?? "",
    ]))
  ) {
    redirect("/admin/settings?error=invalid");
  }

  // Parse socialLinks JSON
  let socialLinks: Prisma.InputJsonValue | typeof Prisma.JsonNull =
    Prisma.JsonNull;
  try {
    socialLinks = parsed.data.socialLinks
      ? (JSON.parse(parsed.data.socialLinks) as Prisma.InputJsonValue)
      : Prisma.JsonNull;
  } catch {
    redirect("/admin/settings?error=social");
  }

  // Parse footerLinks JSON (built by the form's onSubmit handler)
  let footerLinks: Prisma.InputJsonValue | typeof Prisma.JsonNull =
    Prisma.JsonNull;
  if (parsed.data.footerLinks) {
    try {
      const raw = JSON.parse(parsed.data.footerLinks);
      const validated = footerLinksSchema.safeParse(raw);
      footerLinks = validated.success
        ? (validated.data as Prisma.InputJsonValue)
        : Prisma.JsonNull;
    } catch {
      // Malformed JSON from the hidden field — treat as empty rather than error
      footerLinks = Prisma.JsonNull;
    }
  }

  const values = {
    collegeName: parsed.data.collegeName,
    socialLinks,
    footerLinks,
    logoPath: parsed.data.logoPath ?? null,
    faviconPath: parsed.data.faviconPath ?? null,
    contactEmail: parsed.data.contactEmail ?? null,
    phoneNumber: parsed.data.phoneNumber ?? null,
    alternativePhone: parsed.data.alternativePhone ?? null,
    address: parsed.data.address ?? null,
    footerText: parsed.data.footerText ?? null,
    defaultSeoTitle: parsed.data.defaultSeoTitle ?? null,
    defaultMetaDescription: parsed.data.defaultMetaDescription ?? null,
  };

  const prisma = getPrismaClient();

  try {
    const existing = await prisma.siteSettings.findFirst();
    const record = existing
      ? await prisma.siteSettings.update({ where: { id: existing.id }, data: values })
      : await prisma.siteSettings.create({ data: values });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "update",
        entityType: "SiteSettings",
        entityId: String(record.id),
      },
    });
  } catch (error) {
    console.error("[saveSettings] Database error:", error);
    redirect("/admin/settings?error=save");
  }

  // Bust the module-level settings cache so the footer and admin page
  // immediately read the freshly saved values instead of the 60-second stale cache.
  invalidateSiteSettingsCache();

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}
