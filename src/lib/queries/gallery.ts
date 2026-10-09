import "server-only";

import { connection } from "next/server";
import {
  fallbackGalleryCategories,
  fallbackGalleryItems,
  type GalleryItem,
} from "@/src/lib/content/gallery";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface PublicGalleryData {
  categories: string[];
  items: GalleryItem[];
}

const fallback: PublicGalleryData = {
  categories: fallbackGalleryCategories,
  items: fallbackGalleryItems,
};

export async function getPublicGalleryData(): Promise<PublicGalleryData> {
  if (!isDatabaseConfigured()) return fallback;

  await connection();

  try {
    const prisma = getPrismaClient();
    const totalImages = await prisma.galleryImage.count();
    if (totalImages === 0) return fallback;

    const images = await prisma.galleryImage.findMany({
      where: {
        isPublished: true,
        category: { isActive: true },
      },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        title: true,
        imagePath: true,
        category: { select: { name: true, sortOrder: true } },
      },
    });

    const activeNames = [
      ...new Set(images.map((image) => image.category.name)),
    ];
    const items = images.map((image) => ({
      id: image.id,
      title: image.title,
      category: image.category.name,
      image: image.imagePath,
    }));

    return {
      categories: ["All", ...activeNames],
      items,
    };
  } catch {
    console.error(
      "Gallery data unavailable; rendering bundled gallery content.",
    );
    return fallback;
  }
}
