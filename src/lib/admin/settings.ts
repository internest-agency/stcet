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
    googleMapsEmbedUrl: null,
    // ZeptoMail
    zeptoEnabled: false,
    zeptoApiEndpoint: null,
    zeptoTokenEncrypted: null,
    zeptoTokenSalt: null,
    zeptoSenderEmail: null,
    zeptoSenderName: null,
    zeptoAdminEmail: null,
    zeptoNotifyContact: true,
    zeptoNotifyEnquiry: true,
    zeptoLastTestAt: null,
    zeptoLastTestResult: null,
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
          googleMapsEmbedUrl: true,
          // ZeptoMail
          zeptoEnabled: true,
          zeptoApiEndpoint: true,
          zeptoTokenEncrypted: true,
          zeptoTokenSalt: true,
          zeptoSenderEmail: true,
          zeptoSenderName: true,
          zeptoAdminEmail: true,
          zeptoNotifyContact: true,
          zeptoNotifyEnquiry: true,
          zeptoLastTestAt: true,
          zeptoLastTestResult: true,
        },
      });

      if (record) {
        const rawSocialLinks = record.socialLinks ?? null;
        const socialLinksObj =
          typeof rawSocialLinks === "string"
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
        } else if (
          typeof rawFooterLinks === "object" &&
          rawFooterLinks !== null &&
          !Array.isArray(rawFooterLinks)
        ) {
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
          googleMapsEmbedUrl: record.googleMapsEmbedUrl ?? null,
          // ZeptoMail
          zeptoEnabled: record.zeptoEnabled ?? false,
          zeptoApiEndpoint: record.zeptoApiEndpoint ?? null,
          zeptoTokenEncrypted: record.zeptoTokenEncrypted ?? null,
          zeptoTokenSalt: record.zeptoTokenSalt ?? null,
          zeptoSenderEmail: record.zeptoSenderEmail ?? null,
          zeptoSenderName: record.zeptoSenderName ?? null,
          zeptoAdminEmail: record.zeptoAdminEmail ?? null,
          zeptoNotifyContact: record.zeptoNotifyContact ?? true,
          zeptoNotifyEnquiry: record.zeptoNotifyEnquiry ?? true,
          zeptoLastTestAt: record.zeptoLastTestAt ?? null,
          zeptoLastTestResult: record.zeptoLastTestResult ?? null,
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

function isPlaceholder(value: string) {
  const trimmed = value.trim();
  return trimmed === "" || trimmed === "#";
}

function isValidSocialUrl(value: string) {
  const trimmed = value.trim();
  if (isPlaceholder(trimmed)) return false;

  try {
    const url = new URL(trimmed);
    // Only allow https (and http for legacy, but warn)
    if (url.protocol !== "https:" && url.protocol !== "http:") return false;
    // WhatsApp uses https://wa.me/... format
    return true;
  } catch {
    return false;
  }
}

export function parseSocialLinks(value: unknown) {
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

    if (isPlaceholder(candidate)) {
      // Placeholder values (# or blank) are intentionally skipped
      return;
    }

    if (isValidSocialUrl(candidate)) {
      valid.push({
        key: key as keyof typeof SocialLinksConfig,
        label,
        href: new URL(candidate.trim()).toString(),
      });
    } else {
      invalid.push(candidate);
    }
  });

  return { valid, invalid };
}

// -- Google Maps Embed Validation ---------------------------------------

const ALLOWED_MAPS_DOMAINS = ["www.google.com", "maps.google.com"];
const ALLOWED_MAPS_PATH_PREFIX = "/maps/embed";

/**
 * Validates a Google Maps embed URL directly.
 * Must be HTTPS, from an allowed domain, and have the /maps/embed path.
 */
export function isValidGoogleMapsEmbedUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;

  try {
    const url = new URL(trimmed);
    if (url.protocol !== "https:") return false;
    if (!ALLOWED_MAPS_DOMAINS.includes(url.hostname)) return false;
    if (!url.pathname.startsWith(ALLOWED_MAPS_PATH_PREFIX)) return false;
    return true;
  } catch {
    return false;
  }
}

/**
 * Parses a Google Maps iframe embed code and extracts the src URL.
 * Returns { valid: boolean, url: string | null, error?: string }.
 * Does not use dangerouslySetInnerHTML - parses the HTML string safely.
 */
export function parseGoogleMapsEmbed(iframeHtml: string): {
  valid: boolean;
  url: string | null;
  error?: string;
} {
  const trimmed = iframeHtml.trim();
  if (!trimmed) return { valid: false, url: null, error: "Empty embed code" };

  // Extract src attribute from iframe
  const srcMatch = trimmed.match(/src\s*=\s*["']([^"']+)["']/i);
  if (!srcMatch || !srcMatch[1]) {
    return {
      valid: false,
      url: null,
      error: "No valid src attribute found in iframe",
    };
  }

  const srcUrl = srcMatch[1];
  if (!isValidGoogleMapsEmbedUrl(srcUrl)) {
    return {
      valid: false,
      url: null,
      error:
        "Google Maps embed URL must be from www.google.com/maps/embed or maps.google.com/maps/embed with HTTPS",
    };
  }

  return { valid: true, url: srcUrl };
}

export const SocialLinksConfig = {
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  x: "X",
  whatsapp: "WhatsApp",
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
  googleMapsEmbedUrl: string | null;
  // ZeptoMail
  zeptoEnabled: boolean;
  zeptoApiEndpoint: string | null;
  zeptoTokenEncrypted: string | null;
  zeptoTokenSalt: string | null;
  zeptoSenderEmail: string | null;
  zeptoSenderName: string | null;
  zeptoAdminEmail: string | null;
  zeptoNotifyContact: boolean;
  zeptoNotifyEnquiry: boolean;
  zeptoLastTestAt: Date | null;
  zeptoLastTestResult: string | null;
}
