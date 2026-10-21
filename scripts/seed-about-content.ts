/**
 * Seeds the About page content tables from the bundled defaults in
 * `src/lib/content/about-content.ts`.
 *
 * Idempotent:
 *  - singleton sections (chairman message, vision & mission, trust) are only
 *    created when no row exists, so re-running never overwrites admin edits;
 *  - ordered lists (founders, mission items, trust pillars) are only seeded
 *    when their table is empty.
 *
 *   npx tsx scripts/seed-about-content.ts
 */
import "dotenv/config";

import { getPrismaClient } from "../src/lib/prisma-client";
import { sanitizeHtml } from "../src/lib/content/html";
import {
  aboutChairmanMessage,
  aboutFounders,
  aboutMissionItems,
  aboutTrust,
  aboutTrustPillars,
  aboutVisionMission,
} from "../src/lib/content/about-content";

function rich(value: string | null | undefined): string | null {
  if (value === null || value === undefined || value === "") return null;
  const clean = sanitizeHtml(value);
  return clean || null;
}

function text(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function main() {
  const prisma = getPrismaClient();

  const founderCount = await prisma.aboutFounder.count();
  if (founderCount === 0) {
    await prisma.aboutFounder.createMany({
      data: aboutFounders.map((founder, index) => ({
        name: founder.name,
        designation: text(founder.designation),
        roleLabel: text(founder.roleLabel),
        imagePath: text(founder.imagePath),
        biography: rich(founder.biography),
        quote: rich(founder.quote),
        sortOrder: index,
        isPublished: true,
      })),
    });
    console.log(`seeded ${aboutFounders.length} founders`);
  } else {
    console.log(`founders already present (${founderCount}) — skipped`);
  }

  const chairman = await prisma.aboutChairmanMessage.findFirst();
  if (!chairman) {
    await prisma.aboutChairmanMessage.create({
      data: {
        eyebrow: text(aboutChairmanMessage.eyebrow),
        heading: rich(aboutChairmanMessage.heading),
        quote: rich(aboutChairmanMessage.quote),
        body: rich(aboutChairmanMessage.body),
        closingStatement: rich(aboutChairmanMessage.closingStatement),
        name: text(aboutChairmanMessage.name),
        designation: text(aboutChairmanMessage.designation),
        imagePath: text(aboutChairmanMessage.imagePath),
        isPublished: true,
      },
    });
    console.log("seeded chairman message");
  } else {
    console.log("chairman message already present — skipped");
  }

  const visionMission = await prisma.aboutVisionMission.findFirst();
  if (!visionMission) {
    await prisma.aboutVisionMission.create({
      data: {
        visionEyebrow: text(aboutVisionMission.visionEyebrow),
        visionHeading: rich(aboutVisionMission.visionHeading),
        visionStatement: rich(aboutVisionMission.visionStatement),
        visionTags: text(aboutVisionMission.visionTags),
        visionImagePath: text(aboutVisionMission.visionImagePath),
        visionCaptionTitle: text(aboutVisionMission.visionCaptionTitle),
        visionCaptionSubtitle: text(aboutVisionMission.visionCaptionSubtitle),
        missionHeading: rich(aboutVisionMission.missionHeading),
        missionIntro: rich(aboutVisionMission.missionIntro),
        missionTags: text(aboutVisionMission.missionTags),
        isPublished: true,
      },
    });
    console.log("seeded vision & mission");
  } else {
    console.log("vision & mission already present — skipped");
  }

  const missionItemCount = await prisma.aboutMissionItem.count();
  if (missionItemCount === 0) {
    await prisma.aboutMissionItem.createMany({
      data: aboutMissionItems.map((item, index) => ({
        title: item.title,
        description: rich(item.description),
        icon: text(item.icon),
        sortOrder: index,
        isPublished: true,
      })),
    });
    console.log(`seeded ${aboutMissionItems.length} mission items`);
  } else {
    console.log(`mission items already present (${missionItemCount}) — skipped`);
  }

  const trust = await prisma.aboutTrust.findFirst();
  if (!trust) {
    await prisma.aboutTrust.create({
      data: {
        eyebrow: text(aboutTrust.eyebrow),
        heading: rich(aboutTrust.heading),
        intro: rich(aboutTrust.intro),
        closingEyebrow: text(aboutTrust.closingEyebrow),
        closingLabel: text(aboutTrust.closingLabel),
        closingStatement: rich(aboutTrust.closingStatement),
        closingFooter: text(aboutTrust.closingFooter),
        isPublished: true,
      },
    });
    console.log("seeded trust content");
  } else {
    console.log("trust content already present — skipped");
  }

  const pillarCount = await prisma.aboutTrustPillar.count();
  if (pillarCount === 0) {
    await prisma.aboutTrustPillar.createMany({
      data: aboutTrustPillars.map((pillar, index) => ({
        title: pillar.title,
        description: rich(pillar.description),
        tag: text(pillar.tag),
        icon: text(pillar.icon),
        sortOrder: index,
        isPublished: true,
      })),
    });
    console.log(`seeded ${aboutTrustPillars.length} trust pillars`);
  } else {
    console.log(`trust pillars already present (${pillarCount}) — skipped`);
  }

  await prisma.$disconnect().catch(() => undefined);
  process.exit(0);
}

main().catch((error) => {
  console.error("seed-about-content fatal:", error);
  process.exit(1);
});
