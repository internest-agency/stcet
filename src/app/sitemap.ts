import type { MetadataRoute } from "next";

import { getSitemapData } from "@/src/lib/queries/sitemap";
import { getSiteUrl } from "@/src/lib/site-url";

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>;

interface StaticRoute {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
}

/*
 * ============================================================
 * STATIC PUBLIC ROUTES
 * ============================================================
 *
 * Every entry mirrors a real `page.tsx` under `src/app/(website)`. Runtime
 * route discovery is not available in a metadata route, so this list is the
 * single, explicit source of truth for the fixed public pages. Add a row here
 * only when a corresponding page actually exists.
 *
 * Priority is a restrained hierarchy (the homepage is the only 1.0); it is a
 * crawl hint, not a ranking signal.
 */
const STATIC_ROUTES: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/admissions", changeFrequency: "weekly", priority: 0.9 },
  { path: "/faculty", changeFrequency: "monthly", priority: 0.7 },
  { path: "/infrastructure", changeFrequency: "monthly", priority: 0.7 },
  { path: "/placements", changeFrequency: "monthly", priority: 0.7 },
  { path: "/scholarships", changeFrequency: "monthly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.5 },
  { path: "/events", changeFrequency: "weekly", priority: 0.6 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact#application", changeFrequency: "monthly", priority: 0.6 },
  {
    path: "/enquire-now#application",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { path: "/iqac", changeFrequency: "monthly", priority: 0.5 },
  { path: "/sc-st-cell", changeFrequency: "monthly", priority: 0.4 },
  {
    path: "/anti-ragging-committee",
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    path: "/grievance-redressal-committee",
    changeFrequency: "yearly",
    priority: 0.4,
  },
  {
    path: "/internal-complaints-committee",
    changeFrequency: "yearly",
    priority: 0.4,
  },
];

/*
 * Top-level slugs that already resolve to a dedicated route. An
 * `InstitutionalPage` whose slug collides with one of these is shadowed by the
 * static route (Next resolves fixed segments before `[institutionalSlug]`), so
 * it must never be listed as a second, duplicate URL.
 */
const RESERVED_SLUGS = new Set<string>(
  [
    ...STATIC_ROUTES.map((route) => route.path.replace(/^\//, "")),
    "courses",
    "admin",
    "api",
    "uploads",
  ].filter(Boolean),
);

/*
 * Course slugs that ship bundled content in `src/lib/courses/course-content.ts`
 * and render at `/courses/<slug>` when the database has no record for them.
 * They are real, publicly reachable pages, so they belong in the sitemap unless
 * a database course record shadows the slug.
 */
const BUNDLED_COURSE_SLUGS = [
  "computer-science-engineering",
  "electronics-communication-engineering",
  "electrical-electronics-engineering",
  "information-technology",
  "computer-science-ai-ml",
];

/*
 * The sitemap reflects live publication status, so it must not be frozen at
 * build time. `force-dynamic` also means `next build` never needs a database.
 */
export const dynamic = "force-dynamic";

/**
 * Resolves a canonical value (absolute URL or site-relative path) against the
 * configured origin. Returns the absolute URL only when it stays on this site;
 * a cross-origin canonical means the page's real canonical lives elsewhere, so
 * it is excluded from the sitemap.
 */
function resolveCanonical(
  value: string | null | undefined,
  base: string,
  fallbackPath: string,
) {
  try {
    const absolute = new URL(value?.trim() || fallbackPath, base);
    return absolute.origin === new URL(base).origin
      ? absolute.toString()
      : null;
  } catch {
    return null;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const data = await getSitemapData();
  const seoByPath = new Map(
    data.pageSeo.map((record) => [record.pagePath, record]),
  );

  const entries = new Map<string, MetadataRoute.Sitemap[number]>();
  const add = (entry: MetadataRoute.Sitemap[number]) => {
    // First writer wins; a URL appears exactly once.
    if (!entries.has(entry.url)) entries.set(entry.url, entry);
  };

  // 1. Fixed public routes.
  for (const route of STATIC_ROUTES) {
    const seo = seoByPath.get(route.path);
    if (seo?.noIndex) continue;

    const url = resolveCanonical(seo?.canonicalUrl, base, route.path);
    if (!url) continue;

    add({
      url,
      lastModified: seo?.updatedAt,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    });
  }

  // 2. Published, indexable database courses.
  const allCourseSlugs = new Set(data.courses.map((course) => course.slug));
  for (const course of data.courses) {
    if (!course.isPublished || course.noIndex) continue;

    const url = resolveCanonical(
      course.canonicalUrl,
      base,
      `/courses/${course.slug}`,
    );
    if (!url) continue;

    add({
      url,
      lastModified: course.updatedAt,
      changeFrequency: "monthly",
      priority: 0.8,
    });
  }

  // 3. Bundled course pages not shadowed by any database record.
  for (const slug of BUNDLED_COURSE_SLUGS) {
    if (allCourseSlugs.has(slug)) continue;

    const url = resolveCanonical(null, base, `/courses/${slug}`);
    if (!url) continue;

    add({ url, changeFrequency: "monthly", priority: 0.8 });
  }

  // 4. Published institutional pages served by `/[institutionalSlug]`.
  for (const page of data.institutionalPages) {
    if (RESERVED_SLUGS.has(page.slug)) continue;

    const path = `/${page.slug}`;
    const seo = seoByPath.get(path);
    if (seo?.noIndex) continue;

    const url = resolveCanonical(seo?.canonicalUrl, base, path);
    if (!url) continue;

    add({
      url,
      lastModified: page.updatedAt,
      changeFrequency: "monthly",
      priority: 0.5,
    });
  }

  // 5. Published events.
  for (const event of data.events) {
    const url = resolveCanonical(null, base, `/events/${event.slug}`);
    if (!url) continue;

    add({
      url,
      lastModified: event.updatedAt,
      changeFrequency: "weekly",
      priority: 0.5,
    });
  }

  return [...entries.values()];
}
