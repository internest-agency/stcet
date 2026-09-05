import AboutHero from "@/src/components/sections/about/AboutHero";
import BeyondTheClassroom from "@/src/components/sections/about/BeyondTheClassroom";
import ChairmansMessage from "@/src/components/sections/about/ChairmansMessage";
import GoverningCouncil from "@/src/components/sections/about/GoverningCouncil";
import OurFounders from "@/src/components/sections/about/OurFounders";
import OurInstitution from "@/src/components/sections/about/OurInstitution";
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
      <OurTrust />
      <OurInstitution />
      <VisionMission />
      <GoverningCouncil />
      <BeyondTheClassroom />
    </>
  );
}
