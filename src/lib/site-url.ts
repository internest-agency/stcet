const FALLBACK_SITE_URL = "http://localhost:3000";

/**
 * Resolves the canonical public origin of the site.
 *
 * `metadataBase` requires an absolute URL so Next.js can resolve relative
 * canonical links and Open Graph images. It cannot be derived from the incoming
 * request while exporting static metadata, so it must come from the
 * environment. `NEXT_PUBLIC_BASE_URL` is the primary switch; `NEXTAUTH_URL` is
 * used as a fallback so a single production origin configures both.
 */
export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    process.env.NEXTAUTH_URL?.trim();

  if (!configured) return FALLBACK_SITE_URL;

  try {
    return new URL(configured).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}
