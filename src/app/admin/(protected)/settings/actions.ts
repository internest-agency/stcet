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

const optionalUrlField = (label: string) =>
  z
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
      { message: `${label} must be a valid URL (http/https), or left empty.` },
    )
    .optional()
    .nullable()
    .transform((v) => (v == null || v === "" ? null : v.trim()));

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
        if (url.protocol !== "https:") return false;
        const host = url.hostname.toLowerCase();
        return (
          host === "cpaas.zoho.com" ||
          host.endsWith(".zoho.com") ||
          host.endsWith("zeptomail.com")
        );
      } catch {
        return false;
      }
    },
    "Enter a valid ZeptoMail/Zoho CPaaS API endpoint (HTTPS, e.g. https://cpaas.zoho.com/v1.1/email)",
  )
  .optional()
  .nullable();

const baseSchema = z.object({
  collegeName: z.string().trim().min(2, "College name must be at least 2 characters.").max(191),
  contactEmail: z
    .string()
    .trim()
    .max(255)
    .optional()
    .nullable()
    .refine(
      (v) => !v || v === "" || z.string().email().safeParse(v).success,
      "Contact email must be a valid email address.",
    )
    .transform((v) => (v == null || v === "" ? null : v)),
  phoneNumber: z.string().trim().max(50).optional().nullable().transform((v) => v || null),
  alternativePhone: z.string().trim().max(50).optional().nullable().transform((v) => v || null),
  address: z.string().trim().max(10_000).optional().nullable().transform((v) => v || null),
  footerText: z.string().trim().max(10_000).optional().nullable().transform((v) => v || null),
  defaultSeoTitle: z.string().trim().max(191).optional().nullable().transform((v) => v || null),
  defaultMetaDescription: z.string().trim().max(320).optional().nullable().transform((v) => v || null),
  logoPath: z.string().trim().max(2048).optional().nullable().transform((v) => v || null),
  faviconPath: z.string().trim().max(2048).optional().nullable().transform((v) => v || null),
  socialInstagram: optionalUrlField("Instagram URL"),
  socialYoutube: optionalUrlField("YouTube URL"),
  socialFacebook: optionalUrlField("Facebook URL"),
  socialLinkedin: optionalUrlField("LinkedIn URL"),
  socialX: optionalUrlField("X (Twitter) URL"),
  socialWhatsapp: optionalUrlField("WhatsApp URL"),
  googleMapsEmbed: googleMapsEmbedSchema.transform((v) => (v == null || v === "" ? null : v)),
  // ZeptoMail
  zeptoEnabled: z.boolean().optional().default(false),
  zeptoApiEndpoint: zeptoEndpointSchema.transform((v) => (v == null || v === "" ? null : v)),
  zeptoToken: z.string().optional().nullable().transform((v) => (v == null || v === "" ? null : v)),
  zeptoSenderEmail: z.string().trim().max(255).optional().nullable().transform((v) => (v == null || v === "" ? null : v)),
  zeptoSenderName: z.string().trim().max(191).optional().nullable().transform((v) => (v == null || v === "" ? null : v)),
  zeptoAdminEmail: z.string().trim().max(255).optional().nullable().transform((v) => (v == null || v === "" ? null : v)),
  zeptoNotifyContact: z.boolean().optional().default(false),
  zeptoNotifyEnquiry: z.boolean().optional().default(false),
  footerLinks: z.string().trim().optional().nullable(),
});

const schema = baseSchema.superRefine((data, ctx) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (data.zeptoEnabled) {
    if (!data.zeptoSenderEmail || data.zeptoSenderEmail.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoSenderEmail"],
        message: "Sender email is required when email notifications are enabled.",
      });
    } else if (!emailRegex.test(data.zeptoSenderEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoSenderEmail"],
        message: "Sender email must be a valid email address.",
      });
    }

    if (!data.zeptoAdminEmail || data.zeptoAdminEmail.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoAdminEmail"],
        message: "Admin notification email is required when email notifications are enabled.",
      });
    } else if (!emailRegex.test(data.zeptoAdminEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoAdminEmail"],
        message: "Admin notification email must be a valid email address.",
      });
    }
  } else {
    // When disabled, validate format only if a non-empty value is provided
    if (data.zeptoSenderEmail && data.zeptoSenderEmail.trim() !== "" && !emailRegex.test(data.zeptoSenderEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoSenderEmail"],
        message: "Sender email must be a valid email address.",
      });
    }
    if (data.zeptoAdminEmail && data.zeptoAdminEmail.trim() !== "" && !emailRegex.test(data.zeptoAdminEmail)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["zeptoAdminEmail"],
        message: "Admin notification email must be a valid email address.",
      });
    }
  }
});

function formatZodErrors(error: z.ZodError): string {
  return error.issues
    .map((issue) => {
      const field = issue.path.length ? issue.path.join(".") : "form";
      return `${field}: ${issue.message}`;
    })
    .join("; ");
}

export async function saveSettings(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();

  // Check if this is a test email request
  const action = formData.get("action");
  if (action === "testEmail") {
    return sendTestEmail();
  }

  const raw = {
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
  };

  const parsed = schema.safeParse(raw);

  if (!parsed.success) {
    const message = formatZodErrors(parsed.error);
    redirect(`/admin/settings?error=${encodeURIComponent(message)}`);
  }

  if (
    !(await validateImageReferences([
      parsed.data.logoPath ?? "",
      parsed.data.faviconPath ?? "",
    ]))
  ) {
    redirect(
      `/admin/settings?error=${encodeURIComponent(
        "logoPath/faviconPath: One or more image references are invalid. Please re-upload the image.",
      )}`,
    );
  }

  // Build socialLinks as plain object from individual standard fields (no JSON input required)
  const socialLinks: Record<string, string | null> = {
    instagram: parsed.data.socialInstagram ?? null,
    youtube: parsed.data.socialYoutube ?? null,
    facebook: parsed.data.socialFacebook ?? null,
    linkedin: parsed.data.socialLinkedin ?? null,
    x: parsed.data.socialX ?? null,
    whatsapp: parsed.data.socialWhatsapp ?? null,
  };

  // Parse footerLinks JSON (internal transport from form helper only)
  let footerLinks: Prisma.InputJsonValue | typeof Prisma.JsonNull = Prisma.JsonNull;
  if (parsed.data.footerLinks) {
    try {
      const footerRaw = JSON.parse(parsed.data.footerLinks);
      const validated = footerLinksSchema.safeParse(footerRaw);
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

  const prisma = getPrismaClient();
  const existing = await prisma.siteSettings.findFirst({
    select: { id: true, zeptoTokenEncrypted: true, zeptoTokenSalt: true },
  });

  // Encrypt ZeptoMail token if provided; if blank keep existing token
  let zeptoTokenEncrypted: string | null = existing?.zeptoTokenEncrypted ?? null;
  let zeptoTokenSalt: string | null = existing?.zeptoTokenSalt ?? null;
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
      const detail =
        error instanceof Error && error.message
          ? error.message
          : "Unknown encryption error";
      redirect(
        `/admin/settings?error=${encodeURIComponent(
          `send_mail_token: ${detail}`,
        )}`,
      );
    }
  }

  const zeptoEndpoint =
    parsed.data.zeptoApiEndpoint?.trim() || "https://cpaas.zoho.com/v1.1/email";

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
    // ZeptoMail - allow empty when disabled; token preserved if blank
    zeptoEnabled: parsed.data.zeptoEnabled ?? false,
    zeptoApiEndpoint: zeptoEndpoint,
    zeptoTokenEncrypted,
    zeptoTokenSalt,
    zeptoSenderEmail: parsed.data.zeptoSenderEmail ?? null,
    zeptoSenderName: parsed.data.zeptoSenderName ?? null,
    zeptoAdminEmail: parsed.data.zeptoAdminEmail ?? null,
    zeptoNotifyContact: parsed.data.zeptoNotifyContact ?? false,
    zeptoNotifyEnquiry: parsed.data.zeptoNotifyEnquiry ?? false,
  };

  try {
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
    const message =
      error instanceof Error ? error.message : "Unknown database error";
    redirect(`/admin/settings?error=${encodeURIComponent(`save: ${message}`)}`);
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
    redirect(
      `/admin/settings?error=${encodeURIComponent(
        "test_email: Email notifications are disabled. Enable and save settings first.",
      )}`,
    );
  }

  if (!settings.zeptoTokenEncrypted || !settings.zeptoTokenSalt) {
    redirect(
      `/admin/settings?error=${encodeURIComponent(
        "test_email: Send Mail Token is missing. Save a valid token first.",
      )}`,
    );
  }

  if (!settings.zeptoSenderEmail || !settings.zeptoAdminEmail) {
    redirect(
      `/admin/settings?error=${encodeURIComponent(
        "test_email: Sender email and admin notification email are required.",
      )}`,
    );
  }

  // Decrypt token
  let token: string;
  try {
    token = await unpackAndDecrypt(settings.zeptoTokenEncrypted);
  } catch (error) {
    const detail =
      error instanceof Error && error.message
        ? error.message
        : "Decryption failed";
    redirect(
      `/admin/settings?error=${encodeURIComponent(
        `test_email: Could not decrypt Send Mail Token. ${detail}`,
      )}`,
    );
  }

  // Send test email via ZeptoMail
  const endpoint = settings.zeptoApiEndpoint || "https://cpaas.zoho.com/v1.1/email";
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