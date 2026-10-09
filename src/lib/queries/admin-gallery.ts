import "server-only";

import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";

const PAGE_SIZE = 12;

export async function getAdminGalleryData(options: {
  query?: string;
  categoryId?: number;
  page?: number;
}) {
  await requireAdmin();

  const page =
    Number.isSafeInteger(options.page) && (options.page ?? 0) > 0
      ? options.page!
      : 1;
  const search = options.query?.trim().slice(0, 100);
  const categoryId = Number.isSafeInteger(options.categoryId)
    ? options.categoryId
    : undefined;
  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search } },
            { altText: { contains: search } },
            { imagePath: { contains: search } },
          ],
        }
      : {}),
  };

  const prisma = getPrismaClient();
  const [categories, total, images] = await Promise.all([
    prisma.galleryCategory.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        sortOrder: true,
        isActive: true,
        _count: { select: { images: true } },
      },
    }),
    prisma.galleryImage.count({ where }),
    prisma.galleryImage.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        title: true,
        altText: true,
        imagePath: true,
        isPublished: true,
        sortOrder: true,
        categoryId: true,
        category: { select: { name: true } },
        updatedAt: true,
      },
    }),
  ]);
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const currentImages =
    currentPage === page
      ? images
      : await prisma.galleryImage.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          skip: (currentPage - 1) * PAGE_SIZE,
          take: PAGE_SIZE,
          select: {
            id: true,
            title: true,
            altText: true,
            imagePath: true,
            isPublished: true,
            sortOrder: true,
            categoryId: true,
            category: { select: { name: true } },
            updatedAt: true,
          },
        });

  return {
    categories,
    images: currentImages,
    total,
    page: currentPage,
    pageCount,
  };
}
