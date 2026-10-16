import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

/**
 * Bulk content data needed to generate the XML sitemap.
 *
 * Deliberately fetched in a fixed number of queries (three) rather than one
 * query per URL, so the sitemap stays cheap as the site grows. Every field is
 * the minimum required to decide eligibility, canonical URL and lastModified.
 */
export interface SitemapCourse {
  slug: string;
  canonicalUrl: string | null;
  noIndex: boolean;
  isPublished: boolean;
  updatedAt: Date;
}

export interface SitemapInstitutionalPage {
  slug: string;
  updatedAt: Date;
}

export interface SitemapPageSeo {
  pagePath: string;
  canonicalUrl: string | null;
  noIndex: boolean;
  updatedAt: Date;
}

export interface SitemapData {
  courses: SitemapCourse[];
  institutionalPages: SitemapInstitutionalPage[];
  pageSeo: SitemapPageSeo[];
}

const EMPTY: SitemapData = {
  courses: [],
  institutionalPages: [],
  pageSeo: [],
};

/**
 * Loads every database-backed input the sitemap needs.
 *
 * - `courses` includes UNPUBLISHED rows on purpose: a static bundled course
 *   slug is only safe to list when no database record shadows its URL, and an
 *   unpublished record makes `/courses/<slug>` return a 404.
 * - `institutionalPages` is restricted to published rows; the public route only
 *   renders published pages.
 * - `pageSeo` carries the admin-managed canonical/`noindex` overrides applied to
 *   otherwise-static pages.
 *
 * On any failure (or when no database is configured) it returns empty arrays so
 * the sitemap can still emit the static public routes instead of failing.
 */
export async function getSitemapData(): Promise<SitemapData> {
  if (!isDatabaseConfigured()) return EMPTY;

  await connection();

  try {
    const prisma = getPrismaClient();

    const [courses, institutionalPages, pageSeo] = await Promise.all([
      prisma.course.findMany({
        select: {
          slug: true,
          canonicalUrl: true,
          noIndex: true,
          isPublished: true,
          updatedAt: true,
        },
      }),
      prisma.institutionalPage.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      }),
      prisma.pageSeo.findMany({
        select: {
          pagePath: true,
          canonicalUrl: true,
          noIndex: true,
          updatedAt: true,
        },
      }),
    ]);

    return { courses, institutionalPages, pageSeo };
  } catch (error) {
    console.error(
      "Sitemap data query failed; serving static routes only.",
      error,
    );
    return EMPTY;
  }
}
