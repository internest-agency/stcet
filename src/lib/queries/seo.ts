import "server-only";

import type { Metadata } from "next";
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

export interface PageMetadataDefaults {
  title: string;
  description: string;
  image?: string;
}

export async function getPageMetadata(
  pagePath: string,
  defaults: PageMetadataDefaults
): Promise<Metadata> {
  const seo = await getPageSeo(pagePath);
  const title = seo.seoTitle || defaults.title;
  const description = seo.metaDescription || defaults.description;
  const canonical = seo.canonicalUrl || pagePath;
  const image = seo.ogImage || defaults.image;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    robots: seo.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
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