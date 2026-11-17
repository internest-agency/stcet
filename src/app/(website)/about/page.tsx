import type { Metadata } from "next";
import AboutHero from "@/src/components/sections/about/AboutHero";
import ChairmansMessage from "@/src/components/sections/about/ChairmansMessage";
import GoverningCouncil from "@/src/components/sections/about/GoverningCouncil";
import OurFounders from "@/src/components/sections/about/OurFounders";
import OurLegacy from "@/src/components/sections/about/OurLegacy";
import OurTrust from "@/src/components/sections/about/OurTrust";
import VisionMission from "@/src/components/sections/about/VisionMission";
import { getPublishedAboutContent } from "@/src/lib/queries/about";
import { getPublishedGoverningCouncilMembers } from "@/src/lib/queries/governing-council";
import { getPageMetadata } from "@/src/lib/queries/seo";

export async function generateMetadata(): Promise<Metadata> {
  return getPageMetadata("/about", {
    title: "About Us | S. Thangapazham College of Engineering & Technology",
    description:
      "Learn about the history, leadership, vision, and mission of S. Thangapazham College of Engineering & Technology.",
  });
}

export default async function AboutPage() {
  const [content, councilMembers] = await Promise.all([
    getPublishedAboutContent(),
    getPublishedGoverningCouncilMembers(),
  ]);

  return (
    <>
      <AboutHero />
      <OurLegacy />
      <OurFounders founders={content?.founders} />
      <ChairmansMessage message={content?.chairman ?? undefined} />
      <GoverningCouncil members={councilMembers} />
      <OurTrust content={content?.trust ?? undefined} />
      <VisionMission content={content?.visionMission ?? undefined} />
    </>
  );
}
