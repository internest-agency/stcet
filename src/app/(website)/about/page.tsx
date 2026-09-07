import AboutHero from "@/src/components/sections/about/AboutHero";
import ChairmansMessage from "@/src/components/sections/about/ChairmansMessage";
import GoverningCouncil from "@/src/components/sections/about/GoverningCouncil";
import OurFounders from "@/src/components/sections/about/OurFounders";
import OurLegacy from "@/src/components/sections/about/OurLegacy";
import OurTrust from "@/src/components/sections/about/OurTrust";
import VisionMission from "@/src/components/sections/about/VisionMission";

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurLegacy />
      <OurFounders />
      <ChairmansMessage />
      <GoverningCouncil />
      <OurTrust />
      <VisionMission />
    </>
  );
}
