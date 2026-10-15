import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

// -- Module-level cache ----------------------------------------------
let cachedSettings: Settings | null = null;
let lastCacheTime = 0;

function getCachedSettings(): typeof cachedSettings | null {
  const now = Date.now();
  if (cachedSettings && now - lastCacheTime < 60_000) {
    return cachedSettings;
  }
  return null;
}

function setCachedSettings(settings: typeof cachedSettings | null) {
  cachedSettings = settings;
  lastCacheTime = Date.now();
}

// -- Exported API -----------------------------------------------------

export async function getSiteSettings(): Promise<Settings> {
  const cached = getCachedSettings();
  if (cached) {
    return cached;
  }

  let settings: Settings = {
    collegeName: null,
    logoPath: null,
    faviconPath: null,
    contactEmail: null,
    phoneNumber: null,
    alternativePhone: null,
    address: null,
    socialLinks: null,
    footerLinks: null,
    footerText: null,
    defaultSeoTitle: null,
    defaultMetaDescription: null,
  };

  if (isDatabaseConfigured()) {
    try {
      const prisma = getPrismaClient();
      const record = await prisma.siteSettings.findFirst({
        select: {
          collegeName: true,
          logoPath: true,
          faviconPath: true,
          contactEmail: true,
          phoneNumber: true,
          alternativePhone: true,
          address: true,
          socialLinks: true,
          footerLinks: true,
          footerText: true,
          defaultSeoTitle: true,
          defaultMetaDescription: true,
        },
      });

      if (record) {
        const rawSocialLinks = record.socialLinks ?? null;
        const socialLinksObj = typeof rawSocialLinks === "string"
          ? JSON.parse(rawSocialLinks)
          : (rawSocialLinks ?? null);

        const rawFooterLinks = record.footerLinks ?? null;
        let parsedFooterLinks: Record<string, unknown> | null = null;
        if (typeof rawFooterLinks === "string") {
          try {
            parsedFooterLinks = JSON.parse(rawFooterLinks);
          } catch {
            parsedFooterLinks = null;
          }
        } else if (typeof rawFooterLinks === "object" && rawFooterLinks !== null && !Array.isArray(rawFooterLinks)) {
          parsedFooterLinks = rawFooterLinks;
        }

        settings = {
          collegeName: record.collegeName ?? null,
          logoPath: record.logoPath ?? null,
          faviconPath: record.faviconPath ?? null,
          contactEmail: record.contactEmail ?? null,
          phoneNumber: record.phoneNumber ?? null,
          alternativePhone: record.alternativePhone ?? null,
          address: record.address ?? null,
          socialLinks: socialLinksObj,
          footerLinks: parsedFooterLinks,
          footerText: record.footerText ?? null,
          defaultSeoTitle: record.defaultSeoTitle ?? null,
          defaultMetaDescription: record.defaultMetaDescription ?? null,
        };
      }
    } catch (error) {
      console.error("Failed to fetch site settings", error);
    }
  }

  setCachedSettings(settings);
  return settings;
}

// -- Internal helpers --------------------------------------------------

export function invalidateSiteSettingsCache() {
  setCachedSettings(null);
}

function parseSocialLinks(value: unknown) {
  const valid: SocialLink[] = [];
  const invalid: string[] = [];

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { valid, invalid };
  }

  const obj = value as Record<string, unknown>;

  Object.entries(SocialLinksConfig).forEach(([key, label]) => {
    const candidate = obj[key as keyof typeof obj];
    if (typeof candidate !== "string") {
      return;
    }

    try {
      const url = new URL(candidate as string);
      if (url.protocol !== "https:" && url.protocol !== "http:") {
        invalid.push(candidate as string);
        return;
      }
      valid.push({
        key: key as keyof typeof SocialLinksConfig,
        label,
        href: url.toString(),
      });
    } catch {
      invalid.push(candidate as string);
    }
  });

  return { valid, invalid };
}

// -- Shared config ------------------------------------------------------

export const SocialLinksConfig = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  linkedin: "LinkedIn",
  x: "X",
};

export interface SocialLink {
  key: keyof typeof SocialLinksConfig;
  label: string;
  href: string;
  Icon?: React.ComponentType<{ "aria-hidden"?: boolean; className?: string }>;
}

export interface Settings {
  collegeName: string | null;
  logoPath: string | null;
  faviconPath: string | null;
  contactEmail: string | null;
  phoneNumber: string | null;
  alternativePhone: string | null;
  address: string | null;
  socialLinks: unknown;
  footerLinks: Record<string, unknown> | null;
  footerText: string | null;
  defaultSeoTitle: string | null;
  defaultMetaDescription: string | null;
}
