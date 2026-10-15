import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { Prisma } from "@/src/generated/prisma/client";

import {
  SUBMISSION_STATUSES,
  SubmissionStatus,
} from "@/src/lib/types/submissions";

export { SUBMISSION_STATUSES, type SubmissionStatus };

/* =========================================================
   DASHBOARD STATS
========================================================= */

export async function getAdminSubmissionStats() {
  try {
    await connection();
  } catch {}
  if (!isDatabaseConfigured()) return null;

  const prisma = getPrismaClient();

  try {
    const [
      totalEnquiries,
      newEnquiries,
      unresolvedEnquiries,
      totalContactMessages,
      newContactMessages,
      unresolvedContactMessages,
      recentEnquiries,
      recentContactMessages,
    ] = await Promise.all([
      prisma.enquiry.count(),
      prisma.enquiry.count({ where: { status: "New" } }),
      prisma.enquiry.count({
        where: { status: { notIn: ["Resolved", "Spam"] } },
      }),
      prisma.contactMessage.count(),
      prisma.contactMessage.count({ where: { status: "New" } }),
      prisma.contactMessage.count({
        where: { status: { notIn: ["Resolved", "Spam"] } },
      }),
      prisma.enquiry.findMany({
        orderBy: { submittedAt: "desc" },
        take: 5,
        select: {
          id: true,
          enquiryNumber: true,
          studentName: true,
          studentEmail: true,
          studentMobile: true,
          coursePreference1: true,
          status: true,
          submittedAt: true,
        },
      }),
      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          subject: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

    return {
      totalEnquiries,
      newEnquiries,
      unresolvedEnquiries,
      totalContactMessages,
      newContactMessages,
      unresolvedContactMessages,
      unresolvedSubmissions: unresolvedEnquiries + unresolvedContactMessages,
      recentEnquiries,
      recentContactMessages,
    };
  } catch (error) {
    console.error("Failed to load admin submission stats:", error);
    return null;
  }
}

/* =========================================================
   ENQUIRIES LIST & FILTER
========================================================= */

export type EnquiriesFilterParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  course?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: "asc" | "desc";
};

export async function getAdminEnquiries(params: EnquiriesFilterParams = {}) {
  try {
    await connection();
  } catch {}
  if (!isDatabaseConfigured()) {
    return { items: [], total: 0, totalPages: 0, page: 1, pageSize: 10 };
  }

  const prisma = getPrismaClient();

  const page = Math.max(1, Number(params.page || 1));
  const pageSize = Math.min(100, Math.max(5, Number(params.pageSize || 10)));
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const where: Prisma.EnquiryWhereInput = {};

  // Status filter
  if (params.status && params.status !== "All") {
    where.status = params.status;
  }

  // Course filter
  if (params.course && params.course !== "All") {
    where.OR = [
      { coursePreference1: { contains: params.course } },
      { coursePreference2: { contains: params.course } },
      { coursePreference3: { contains: params.course } },
    ];
  }

  // Date range
  if (params.startDate || params.endDate) {
    where.submittedAt = {};
    if (params.startDate) {
      const start = new Date(params.startDate);
      start.setHours(0, 0, 0, 0);
      where.submittedAt.gte = start;
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      where.submittedAt.lte = end;
    }
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const q = params.search.trim();
    const searchConditions: Prisma.EnquiryWhereInput[] = [
      { studentName: { contains: q } },
      { studentEmail: { contains: q } },
      { studentMobile: { contains: q } },
      { enquiryNumber: { contains: q } },
      { parentName: { contains: q } },
    ];

    if (where.OR) {
      where.AND = [{ OR: where.OR }, { OR: searchConditions }];
      delete where.OR;
    } else {
      where.OR = searchConditions;
    }
  }

  try {
    const [total, items] = await Promise.all([
      prisma.enquiry.count({ where }),
      prisma.enquiry.findMany({
        where,
        orderBy: { submittedAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("Failed to query enquiries:", error);
    return { items: [], total: 0, totalPages: 0, page, pageSize };
  }
}

/* =========================================================
   CONTACT MESSAGES LIST & FILTER
========================================================= */

export type ContactMessagesFilterParams = {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  sortOrder?: "asc" | "desc";
};

export async function getAdminContactMessages(
  params: ContactMessagesFilterParams = {},
) {
  try {
    await connection();
  } catch {}
  if (!isDatabaseConfigured()) {
    return { items: [], total: 0, totalPages: 0, page: 1, pageSize: 10 };
  }

  const prisma = getPrismaClient();

  const page = Math.max(1, Number(params.page || 1));
  const pageSize = Math.min(100, Math.max(5, Number(params.pageSize || 10)));
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const where: Prisma.ContactMessageWhereInput = {};

  // Status filter
  if (params.status && params.status !== "All") {
    where.status = params.status;
  }

  // Date range
  if (params.startDate || params.endDate) {
    where.createdAt = {};
    if (params.startDate) {
      const start = new Date(params.startDate);
      start.setHours(0, 0, 0, 0);
      where.createdAt.gte = start;
    }
    if (params.endDate) {
      const end = new Date(params.endDate);
      end.setHours(23, 59, 59, 999);
      where.createdAt.lte = end;
    }
  }

  // Search filter
  if (params.search && params.search.trim()) {
    const q = params.search.trim();
    where.OR = [
      { name: { contains: q } },
      { email: { contains: q } },
      { phone: { contains: q } },
      { subject: { contains: q } },
      { message: { contains: q } },
    ];
  }

  try {
    const [total, items] = await Promise.all([
      prisma.contactMessage.count({ where }),
      prisma.contactMessage.findMany({
        where,
        orderBy: { createdAt: sortOrder },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return {
      items,
      total,
      totalPages: Math.ceil(total / pageSize) || 1,
      page,
      pageSize,
    };
  } catch (error) {
    console.error("Failed to query contact messages:", error);
    return { items: [], total: 0, totalPages: 0, page, pageSize };
  }
}
