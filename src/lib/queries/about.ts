import "server-only";
import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import type {
  AboutChairmanMessageContent,
  AboutFounderContent,
  AboutMissionItemContent,
  AboutTrustContent,
  AboutTrustPillarContent,
  AboutVisionMissionContent,
} from "@/src/lib/content/about-content";

export type PublishedAboutContent = {
  founders: AboutFounderContent[];
  chairman: AboutChairmanMessageContent | null;
  visionMission: AboutVisionMissionContent | null;
  trust: AboutTrustContent | null;
};

/**
 * Load the published About page content for the public site.
 *
 * Returns `null` when nothing has been stored yet (or the database is
 * unavailable) so the page can fall back to the bundled defaults instead of
 * rendering empty sections.
 */
export async function getPublishedAboutContent(): Promise<PublishedAboutContent | null> {
  if (!isDatabaseConfigured()) return null;
  await connection();

  try {
    const prisma = getPrismaClient();
    const [founders, chairman, visionMission, missionItems, trust, pillars] =
      await Promise.all([
        prisma.aboutFounder.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        prisma.aboutChairmanMessage.findFirst({
          where: { isPublished: true },
          orderBy: { id: "asc" },
        }),
        prisma.aboutVisionMission.findFirst({
          where: { isPublished: true },
          orderBy: { id: "asc" },
        }),
        prisma.aboutMissionItem.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        prisma.aboutTrust.findFirst({
          where: { isPublished: true },
          orderBy: { id: "asc" },
        }),
        prisma.aboutTrustPillar.findMany({
          where: { isPublished: true },
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
      ]);

    if (
      !founders.length &&
      !chairman &&
      !visionMission &&
      !missionItems.length &&
      !trust &&
      !pillars.length
    ) {
      return null;
    }

    const founderList: AboutFounderContent[] = founders.map((founder) => ({
      id: founder.id,
      name: founder.name,
      designation: founder.designation,
      roleLabel: founder.roleLabel,
      imagePath: founder.imagePath,
      biography: founder.biography,
      quote: founder.quote,
    }));

    const missionList: AboutMissionItemContent[] = missionItems.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      icon: item.icon,
    }));

    const pillarList: AboutTrustPillarContent[] = pillars.map((pillar) => ({
      id: pillar.id,
      title: pillar.title,
      description: pillar.description,
      tag: pillar.tag,
      icon: pillar.icon,
    }));

    return {
      founders: founderList,
      chairman: chairman
        ? {
            id: chairman.id,
            eyebrow: chairman.eyebrow,
            heading: chairman.heading,
            quote: chairman.quote,
            body: chairman.body,
            closingStatement: chairman.closingStatement,
            name: chairman.name,
            designation: chairman.designation,
            imagePath: chairman.imagePath,
          }
        : null,
      visionMission: visionMission
        ? {
            id: visionMission.id,
            visionEyebrow: visionMission.visionEyebrow,
            visionHeading: visionMission.visionHeading,
            visionStatement: visionMission.visionStatement,
            visionTags: visionMission.visionTags,
            visionImagePath: visionMission.visionImagePath,
            visionCaptionTitle: visionMission.visionCaptionTitle,
            visionCaptionSubtitle: visionMission.visionCaptionSubtitle,
            missionHeading: visionMission.missionHeading,
            missionIntro: visionMission.missionIntro,
            missionTags: visionMission.missionTags,
            missionItems: missionList,
          }
        : null,
      trust: trust
        ? {
            id: trust.id,
            eyebrow: trust.eyebrow,
            heading: trust.heading,
            intro: trust.intro,
            closingEyebrow: trust.closingEyebrow,
            closingLabel: trust.closingLabel,
            closingStatement: trust.closingStatement,
            closingFooter: trust.closingFooter,
            pillars: pillarList,
          }
        : null,
    };
  } catch (error) {
    console.error("About content query failed; using bundled content.", error);
    return null;
  }
}
