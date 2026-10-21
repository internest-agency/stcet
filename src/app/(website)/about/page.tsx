import AboutHero from "@/src/components/sections/about/AboutHero";
import ChairmansMessage from "@/src/components/sections/about/ChairmansMessage";
import GoverningCouncil from "@/src/components/sections/about/GoverningCouncil";
import OurFounders from "@/src/components/sections/about/OurFounders";
import OurLegacy from "@/src/components/sections/about/OurLegacy";
import OurTrust from "@/src/components/sections/about/OurTrust";
import VisionMission from "@/src/components/sections/about/VisionMission";
import { getPublishedAboutContent } from "@/src/lib/queries/about";

export default async function AboutPage() {
  const content = await getPublishedAboutContent();

  return (
    <>
      <AboutHero />
      <OurLegacy />
      <OurFounders founders={content?.founders} />
      <ChairmansMessage message={content?.chairman ?? undefined} />
      <GoverningCouncil />
      <OurTrust content={content?.trust ?? undefined} />
      <VisionMission content={content?.visionMission ?? undefined} />
    </>
  );
}
