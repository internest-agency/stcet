import type { PrismaClient } from "../../generated/prisma/client";

/**
 * Returns true when any content record still stores `reference` as an image
 * path.
 *
 * This module intentionally has no `server-only` import (and the `server-only`
 * package cannot be resolved outside the Next bundler) so both the admin
 * cleanup helper (`src/lib/admin/uploads.ts`) and the offline
 * `scripts/cleanup-uploads.ts` command can share the exact same check.
 *
 * Keep this list in sync with every string column that stores an image path.
 * Missing a column means the cleanup job can delete an image that a live page
 * still renders.
 */
export async function isUploadReferenced(
  prisma: PrismaClient,
  reference: string,
): Promise<boolean> {
  const checks = await Promise.all([
    // Courses: hero, Open Graph, curriculum modules, career pathways.
    prisma.course.findFirst({
      where: {
        OR: [
          { heroImage: reference },
          { ogImage: reference },
          { modules: { some: { image: reference } } },
          { careerPathways: { some: { image: reference } } },
        ],
      },
      select: { id: true },
    }),
    prisma.galleryImage.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.admissionRoute.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.tNEACounselling.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.trainingProgramme.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.industryInteraction.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.placementCompany.findFirst({
      where: { logoPath: reference },
      select: { id: true },
    }),
    prisma.placementLeadership.findFirst({
      where: { officerImagePath: reference },
      select: { id: true },
    }),
    prisma.infrastructureFacility.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.committee.findFirst({
      where: { heroImage: reference },
      select: { id: true },
    }),
    prisma.pageSection.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.generalPage.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.pageSeo.findFirst({
      where: { ogImage: reference },
      select: { id: true },
    }),
    prisma.siteSettings.findFirst({
      where: {
        OR: [{ logoPath: reference }, { faviconPath: reference }],
      },
      select: { id: true },
    }),
    prisma.faculty.findFirst({
      where: { photo: reference },
      select: { id: true },
    }),
    prisma.event.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.governingCouncilMember.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.aboutFounder.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.aboutChairmanMessage.findFirst({
      where: { imagePath: reference },
      select: { id: true },
    }),
    prisma.aboutVisionMission.findFirst({
      where: { visionImagePath: reference },
      select: { id: true },
    }),
  ]);

  return checks.some((row) => row !== null);
}
