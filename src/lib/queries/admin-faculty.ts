import "server-only";

import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";

const PAGE_SIZE = 15;

export type FacultySort = "updated" | "name" | "order" | "designation";

export async function getAdminFaculty(options: {
  query?: string;
  designation?: string;
  status?: "all" | "published" | "draft";
  sort?: FacultySort;
  page?: number;
}) {
  await requireAdmin();

  const page =
    Number.isSafeInteger(options.page) && (options.page ?? 0) > 0
      ? options.page!
      : 1;
  const query = options.query?.trim().slice(0, 100);
  const designation = options.designation?.trim().slice(0, 191) || "";
  const status = options.status ?? "all";
  const sort = options.sort ?? "updated";

  const where = {
    ...(designation ? { designation } : {}),
    ...(status === "published" ? { isPublished: true } : {}),
    ...(status === "draft" ? { isPublished: false } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query } },
            { designation: { contains: query } },
            { department: { contains: query } },
            { auFin: { contains: query } },
          ],
        }
      : {}),
  };

  const orderBy =
    sort === "name"
      ? [{ name: "asc" as const }, { id: "asc" as const }]
      : sort === "order"
        ? [{ sortOrder: "asc" as const }, { id: "asc" as const }]
        : sort === "designation"
          ? [{ designation: "asc" as const }, { name: "asc" as const }]
          : [{ updatedAt: "desc" as const }, { id: "desc" as const }];

  const prisma = getPrismaClient();
  const total = await prisma.faculty.count({ where });
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const members = await prisma.faculty.findMany({
    where,
    orderBy,
    skip: (currentPage - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
    select: {
      id: true,
      name: true,
      designation: true,
      department: true,
      auFin: true,
      aicteId: true,
      qualification: true,
      specialization: true,
      experience: true,
      email: true,
      phone: true,
      photo: true,
      bio: true,
      sortOrder: true,
      isPublished: true,
      updatedAt: true,
    },
  });

  return {
    members,
    total,
    page: currentPage,
    pageSize: PAGE_SIZE,
    pageCount,
  };
}

export async function getAdminFacultyFacets() {
  await requireAdmin();
  const prisma = getPrismaClient();
  const [designations, departments] = await Promise.all([
    prisma.faculty.findMany({
      distinct: ["designation"],
      orderBy: { designation: "asc" },
      select: { designation: true },
    }),
    prisma.faculty.findMany({
      distinct: ["department"],
      orderBy: { department: "asc" },
      select: { department: true },
    }),
  ]);

  return {
    designations: designations
      .map((row) => row.designation)
      .filter((value): value is string => Boolean(value)),
    departments: departments
      .map((row) => row.department)
      .filter((value): value is string => Boolean(value)),
  };
}
