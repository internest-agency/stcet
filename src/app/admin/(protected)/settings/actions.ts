"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdministrator } from "@/src/lib/admin/authorization";
import { validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";
import { invalidateSiteSettingsCache } from "@/src/lib/admin/settings";
import { z } from "zod";
import { Prisma } from "@/src/generated/prisma/client";
import { parseGoogleMapsEmbed, isValidGoogleMapsEmbedUrl } from "@/src/lib/admin/settings";
import { encryptAndPack, unpackAndDecrypt, unpackEncrypted } from "@/src/lib/admin/encryption";

const footerLinkSchema = z.object({
  label: z.string().min(1).max(500),
  url: z.string().min(1).max(2048),
});

const footerLinksSchema = z.object({
  importantLinks: z.array(footerLinkSchema).default([]),
  quickLinks: z.array(footerLinkSchema).default([]),
});

const socialLinkSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "" || value === "#") return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" || url.protocol === "http:";
      } catch {
        return false;
      }
    },
    "Enter a valid HTTPS URL or # for placeholder.",
  )
  .optional()
  .nullable();

const googleMapsEmbedSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "") return true;
      if (value.includes("<iframe")) {
        const result = parseGoogleMapsEmbed(value);
        return result.valid;
      }
      return isValidGoogleMapsEmbedUrl(value);
    },
    "Enter a valid Google Maps iframe embed code or HTTPS embed URL from www.google.com/maps/embed",
  )
  .optional()
  .nullable();

const zeptoEndpointSchema = z
  .string()
  .trim()
  .refine(
    (value) => {
      if (value === "") return true;
      try {
        const url = new URL(value);
        return url.protocol === "https:" && url.hostname.endsWith("zeptomail.com");
      } catch {
        return false;
      }
    },
    "Enter a valid ZeptoMail API endpoint (HTTPS, zeptomail.com domain)",
  )
  .optional()
  .nullable();

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
  socialInstagram: socialLinkSchema,
  socialYoutube: socialLinkSchema,
  socialFacebook: socialLinkSchema,
  socialLinkedin: socialLinkSchema,
  socialX: socialLinkSchema,
  socialWhatsapp: socialLinkSchema,
  googleMapsEmbed: googleMapsEmbedSchema,
  // ZeptoMail
  zeptoEnabled: z.boolean().optional(),
  zeptoApiEndpoint: zeptoEndpointSchema,
  zeptoToken: z.string().optional().nullable(), // plaintext from form, will be encrypted
  zeptoSenderEmail: z.string().trim().email().max(255).optional().nullable(),
  zeptoSenderName: z.string().trim().max(191).optional().nullable(),
  zeptoAdminEmail: z.string().trim().email().max(255).optional().nullable(),
  zeptoNotifyContact: z.boolean().optional(),
  zeptoNotifyEnquiry: z.boolean().optional(),
  footerLinks: z.string().trim().optional().nullable(),
});

export async function saveSettings(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();

  // Check if this is a test email request
  const action = formData.get("action");
  if (action === "testEmail") {
    return sendTestEmail();
  }

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
    socialInstagram: formData.get("socialInstagram") || null,
    socialYoutube: formData.get("socialYoutube") || null,
    socialFacebook: formData.get("socialFacebook") || null,
    socialLinkedin: formData.get("socialLinkedin") || null,
    socialX: formData.get("socialX") || null,
    socialWhatsapp: formData.get("socialWhatsapp") || null,
    googleMapsEmbed: formData.get("googleMapsEmbed") || null,
    zeptoEnabled: formData.get("zeptoEnabled") === "on",
    zeptoApiEndpoint: formData.get("zeptoApiEndpoint") || null,
    zeptoToken: formData.get("zeptoToken") || null,
    zeptoSenderEmail: formData.get("zeptoSenderEmail") || null,
    zeptoSenderName: formData.get("zeptoSenderName") || null,
    zeptoAdminEmail: formData.get("zeptoAdminEmail") || null,
    zeptoNotifyContact: formData.get("zeptoNotifyContact") === "on",
    zeptoNotifyEnquiry: formData.get("zeptoNotifyEnquiry") === "on",
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

  // Build socialLinks object from individual fields
  const socialLinks: Record<string, string | null> = {
    instagram: parsed.data.socialInstagram ?? null,
    youtube: parsed.data.socialYoutube ?? null,
    facebook: parsed.data.socialFacebook ?? null,
    linkedin: parsed.data.socialLinkedin ?? null,
    x: parsed.data.socialX ?? null,
    whatsapp: parsed.data.socialWhatsapp ?? null,
  };

  // Parse footerLinks JSON
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
      footerLinks = Prisma.JsonNull;
    }
  }

  // Extract Google Maps embed URL
  let googleMapsEmbedUrl: string | null = null;
  if (parsed.data.googleMapsEmbed) {
    const embedInput = parsed.data.googleMapsEmbed.trim();
    if (embedInput.includes("<iframe")) {
      const result = parseGoogleMapsEmbed(embedInput);
      if (result.valid && result.url) {
        googleMapsEmbedUrl = result.url;
      }
    } else if (isValidGoogleMapsEmbedUrl(embedInput)) {
      googleMapsEmbedUrl = embedInput;
    }
  }

  // Encrypt ZeptoMail token if provided
  let zeptoTokenEncrypted: string | null = null;
  let zeptoTokenSalt: string | null = null;
  if (parsed.data.zeptoToken && parsed.data.zeptoToken.trim() !== "") {
    try {
      const packed = await encryptAndPack(parsed.data.zeptoToken.trim());
      const unpacked = unpackEncrypted(packed);
      if (unpacked) {
        zeptoTokenEncrypted = packed;
        zeptoTokenSalt = unpacked.salt;
      }
    } catch (error) {
      console.error("[saveSettings] Token encryption failed:", error);
      redirect("/admin/settings?error=zepto_encrypt");
    }
  }

  const zeptoEndpoint =
    parsed.data.zeptoApiEndpoint?.trim() || "https://api.zeptomail.com/v1.1/email";

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
    googleMapsEmbedUrl,
    // ZeptoMail
    zeptoEnabled: parsed.data.zeptoEnabled ?? false,
    zeptoApiEndpoint: parsed.data.zeptoEnabled ? zeptoEndpoint : null,
    zeptoTokenEncrypted,
    zeptoTokenSalt,
    zeptoSenderEmail: parsed.data.zeptoSenderEmail?.trim() ?? null,
    zeptoSenderName: parsed.data.zeptoSenderName?.trim() ?? null,
    zeptoAdminEmail: parsed.data.zeptoAdminEmail?.trim() ?? null,
    zeptoNotifyContact: parsed.data.zeptoNotifyContact ?? false,
    zeptoNotifyEnquiry: parsed.data.zeptoNotifyEnquiry ?? false,
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

  invalidateSiteSettingsCache();
  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

async function sendTestEmail(): Promise<never> {
  const admin = await requireAdministrator();
  const prisma = getPrismaClient();

  // Get current settings
  const settings = await prisma.siteSettings.findFirst({
    select: {
      id: true,
      zeptoEnabled: true,
      zeptoApiEndpoint: true,
      zeptoTokenEncrypted: true,
      zeptoTokenSalt: true,
      zeptoSenderEmail: true,
      zeptoSenderName: true,
      zeptoAdminEmail: true,
    },
  });

  if (!settings || !settings.zeptoEnabled) {
    redirect("/admin/settings?error=zepto_disabled");
  }

  if (!settings.zeptoTokenEncrypted || !settings.zeptoTokenSalt) {
    redirect("/admin/settings?error=zepto_no_token");
  }

  if (!settings.zeptoSenderEmail || !settings.zeptoAdminEmail) {
    redirect("/admin/settings?error=zepto_incomplete");
  }

  // Decrypt token
  let token: string;
  try {
    token = await unpackAndDecrypt(settings.zeptoTokenEncrypted);
  } catch {
    redirect("/admin/settings?error=zepto_decrypt");
  }

  // Send test email via ZeptoMail
  const endpoint = settings.zeptoApiEndpoint || "https://api.zeptomail.com/v1.1/email";
  const senderEmail = settings.zeptoSenderEmail;
  const senderName = settings.zeptoSenderName || "STCET Website";
  const adminEmail = settings.zeptoAdminEmail;

  const testSubject = "Test Email — STCET ZeptoMail Configuration";
  const testHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">STCET Website</h1>
      </div>
      <div style="padding: 20px; background: #f9f9f9;">
        <h2 style="color: #1e3a5f;">Test Email Successful</h2>
        <p>This is a test email from your STCET website ZeptoMail configuration.</p>
        <p><strong>Sent at:</strong> ${new Date().toISOString()}</p>
        <p><strong>Triggered by:</strong> ${admin.name} (${admin.email})</p>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
        <p style="color: #666; font-size: 14px;">
          If you received this email, your ZeptoMail integration is working correctly.
          You will now receive notifications for the enabled form types.
        </p>
      </div>
    </div>
  `;

  const payload = {
    from: { address: senderEmail, name: senderName },
    to: [{ email_address: { address: adminEmail, name: "STCET Admin" } }],
    subject: testSubject,
    htmlbody: testHtml,
  };

  let resultMessage = "";
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Zoho-enczapikey ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    let responseData: unknown;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (response.ok) {
      resultMessage = `Test email sent successfully. ZeptoMail response: ${JSON.stringify(responseData)}`;
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          zeptoLastTestAt: new Date(),
          zeptoLastTestResult: "success",
        },
      });
    } else {
      resultMessage = `ZeptoMail API error (${response.status}): ${JSON.stringify(responseData)}`;
      await prisma.siteSettings.update({
        where: { id: settings.id },
        data: {
          zeptoLastTestAt: new Date(),
          zeptoLastTestResult: `error_${response.status}`,
        },
      });
    }
  } catch (error) {
    console.error("[sendTestEmail] Failed:", error);
    resultMessage = `Network error: ${error instanceof Error ? error.message : "Unknown error"}`;
    await prisma.siteSettings.update({
      where: { id: settings.id },
      data: {
        zeptoLastTestAt: new Date(),
        zeptoLastTestResult: "network_error",
      },
    });
  }

  invalidateSiteSettingsCache();
  revalidatePath("/admin/settings");
  redirect(`/admin/settings?test_result=${encodeURIComponent(resultMessage)}`);
}