import "server-only";

import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export async function getAdminAdmissionsData() {
  if (!isDatabaseConfigured()) {
    return {
      intro: null,
      routes: [],
      tneaSteps: [],
      quotaInfo: null,
      documents: [],
      notices: [],
      links: [],
      contacts: [],
    };
  }

  const prisma = getPrismaClient();

  const [
    intro,
    routes,
    tneaSteps,
    quotaInfo,
    documents,
    notices,
    links,
    contacts,
  ] = await Promise.all([
    prisma.admissionsIntro.findFirst({
      orderBy: { id: "desc" },
    }),
    prisma.admissionRoute.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.tNEACounselling.findMany({
      orderBy: [{ sortOrder: "asc" }, { stepNumber: "asc" }],
    }),
    prisma.managementQuotaInfo.findFirst({
      orderBy: { id: "desc" },
    }),
    prisma.admissionDocuments.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.importantNotices.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.applicationLink.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
    prisma.admissionContact.findMany({
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    }),
  ]);

  return {
    intro,
    routes,
    tneaSteps,
    quotaInfo,
    documents,
    notices,
    links,
    contacts,
  };
}
