import "server-only";

import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";

const PAGE_SIZE = 10;

export async function getAdminCourses(options: {
  query?: string;
  status?: "all" | "published" | "draft";
  page?: number;
}) {
  await requireAdmin();

  const page =
    Number.isSafeInteger(options.page) && (options.page ?? 0) > 0
      ? options.page!
      : 1;
  const query = options.query?.trim().slice(0, 100);
  const status = options.status ?? "all";
  const where = {
    ...(status === "published" ? { isPublished: true } : {}),
    ...(status === "draft" ? { isPublished: false } : {}),
    ...(query
      ? {
          OR: [{ name: { contains: query } }, { slug: { contains: query } }],
        }
      : {}),
  };

  const prisma = getPrismaClient();
  const total = await prisma.course.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const courses = await prisma.course.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      slug: true,
      degree: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  return {
    courses,
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    pageCount,
  };
}

export async function getAdminCourseById(id: number) {
  await requireAdmin();
  return getPrismaClient().course.findUnique({
    where: { id },
    include: {
      modules: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      opportunities: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      reasons: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
      careerPathways: {
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        include: { roles: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } },
      },
      futurePaths: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
    },
  });
}

export async function getAdminDashboardStats() {
  await requireAdmin();
  const prisma = getPrismaClient();
  const [totalCourses, publishedCourses, recentCourses] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { isPublished: true } }),
    prisma.course.findMany({
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      take: 6,
      select: {
        id: true,
        name: true,
        slug: true,
        isPublished: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    totalCourses,
    publishedCourses,
    draftCourses: totalCourses - publishedCourses,
    recentCourses,
  };
}
