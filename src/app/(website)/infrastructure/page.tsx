import CampusFutureSection from "@/src/components/sections/infrastructure/CampusFutureSection";
import CentralLibrary from "@/src/components/sections/infrastructure/CentralLibrary";
import InteractiveLaboratoryExplorer from "@/src/components/sections/infrastructure/CurriculumExplorer";
import EngineeringLaboratories from "@/src/components/sections/infrastructure/EngineeringLaboratories";
import InfrastructureHero from "@/src/components/sections/infrastructure/InfrastructureHero";
import SportsRecreation from "@/src/components/sections/infrastructure/SportsRecreation";
import StudentFacilities from "@/src/components/sections/infrastructure/StudentFacilities";

export default function InfrastructurePage() {
  return (
    <>
      <InfrastructureHero />
      <CampusFutureSection />
      <EngineeringLaboratories />
      <InteractiveLaboratoryExplorer />
      <CentralLibrary />
      <StudentFacilities />
      <SportsRecreation />
    </>
  );
}
