import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface PageSeo {
  pagePath: string;
  pageTitle: string;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  noIndex: boolean;
}

export async function getPageSeo(pagePath: string): Promise<PageSeo> {
  if (!isDatabaseConfigured()) {
    return {
      pagePath,
      pageTitle: "",
      seoTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogImage: null,
      noIndex: false,
    };
  }

  await connection();

  try {
    const prisma = getPrismaClient();
    const record = await prisma.pageSeo.findUnique({
      where: { pagePath },
    });

    if (!record) {
      return {
        pagePath,
        pageTitle: "",
        seoTitle: null,
        metaDescription: null,
        canonicalUrl: null,
        ogImage: null,
        noIndex: false,
      };
    }

    return {
      pagePath: record.pagePath,
      pageTitle: record.pageTitle,
      seoTitle: record.seoTitle,
      metaDescription: record.metaDescription,
      canonicalUrl: record.canonicalUrl,
      ogImage: record.ogImage,
      noIndex: record.noIndex,
    };
  } catch (error) {
    console.error("Failed to fetch SEO data:", error);
    return {
      pagePath,
      pageTitle: "",
      seoTitle: null,
      metaDescription: null,
      canonicalUrl: null,
      ogImage: null,
      noIndex: false,
    };
  }
}