import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export async function getPublicAdmissionsData() {
  if (!isDatabaseConfigured()) return null;

  await connection();

  try {
    const prisma = getPrismaClient();

    const [
      intro,
      routes,
      tneaSteps,
      quotaInfo,
      notices,
      links,
      contacts,
    ] = await Promise.all([
      prisma.admissionsIntro.findFirst({
        where: { isPublished: true },
        orderBy: { id: "desc" },
      }),
      prisma.admissionRoute.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
      prisma.tNEACounselling.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { stepNumber: "asc" }],
      }),
      prisma.managementQuotaInfo.findFirst({
        where: { isPublished: true },
        orderBy: { id: "desc" },
      }),
      prisma.importantNotices.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
      prisma.applicationLink.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
      prisma.admissionContact.findMany({
        where: { isPublished: true },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      }),
    ]);

    const hasAnyContent =
      Boolean(intro) ||
      routes.length > 0 ||
      tneaSteps.length > 0 ||
      Boolean(quotaInfo) ||
      notices.length > 0 ||
      links.length > 0 ||
      contacts.length > 0;

    if (!hasAnyContent) return null;

    return {
      intro,
      routes,
      tneaSteps,
      quotaInfo,
      notices,
      links,
      contacts,
    };
  } catch (error) {
    console.error("Admissions query failed; falling back to bundled content.", error);
    return null;
  }
}
