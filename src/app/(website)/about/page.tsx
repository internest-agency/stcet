import AboutHero from "@/src/components/sections/about/AboutHero";
import ChairmansMessage from "@/src/components/sections/about/ChairmansMessage";
import GoverningCouncil from "@/src/components/sections/about/GoverningCouncil";
import OurFounders from "@/src/components/sections/about/OurFounders";
import OurLegacy from "@/src/components/sections/about/OurLegacy";
import OurTrust from "@/src/components/sections/about/OurTrust";
import VisionMission from "@/src/components/sections/about/VisionMission";
import { getPublishedAboutContent } from "@/src/lib/queries/about";
import { getPublishedGoverningCouncilMembers } from "@/src/lib/queries/governing-council";

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
