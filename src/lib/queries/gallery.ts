import "server-only";

import { connection } from "next/server";
import {
  fallbackGalleryCategories,
  fallbackGalleryItems,
  fallbackHomeGalleryItems,
  type GalleryItem,
} from "@/src/lib/content/gallery";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface PublicGalleryPageData {
  categories: string[];
  items: GalleryItem[];
}

function toItems(
  images: {
    id: number;
    title: string;
    imagePath: string;
    category: { name: string };
  }[],
): GalleryItem[] {
  return images.map((image) => ({
    id: image.id,
    title: image.title,
    category: image.category.name,
    image: image.imagePath,
  }));
}

function categoriesFor(items: GalleryItem[]): string[] {
  return ["All", ...new Set(items.map((item) => item.category))];
}

export async function getHomeGalleryItems(): Promise<GalleryItem[]> {
  if (!isDatabaseConfigured()) return fallbackHomeGalleryItems;

  await connection();

  try {
    const prisma = getPrismaClient();
    const images = await prisma.galleryImage.findMany({
      where: {
        isPublished: true,
        showOnHome: true,
        category: { isActive: true },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        imagePath: true,
        category: { select: { name: true } },
      },
    });
    if (images.length === 0) return fallbackHomeGalleryItems;
    return toItems(images);
  } catch {
    console.error(
      "Home gallery data unavailable; rendering bundled home gallery content.",
    );
    return fallbackHomeGalleryItems;
  }
}

export async function getGalleryPageData(): Promise<PublicGalleryPageData> {
  if (!isDatabaseConfigured()) {
    return {
      categories: fallbackGalleryCategories,
      items: fallbackGalleryItems,
    };
  }

  await connection();

  try {
    const prisma = getPrismaClient();
    const images = await prisma.galleryImage.findMany({
      where: {
        isPublished: true,
        showOnGalleryPage: true,
        category: { isActive: true },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        imagePath: true,
        category: { select: { name: true } },
      },
    });
    if (images.length === 0) {
      return {
        categories: fallbackGalleryCategories,
        items: fallbackGalleryItems,
      };
    }
    const items = toItems(images);
    return { categories: categoriesFor(items), items };
  } catch {
    console.error(
      "Gallery page data unavailable; rendering bundled gallery content.",
    );
    return {
      categories: fallbackGalleryCategories,
      items: fallbackGalleryItems,
    };
  }
}
