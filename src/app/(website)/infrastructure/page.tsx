import InfrastructureHero from "@/src/components/sections/infrastructure/InfrastructureHero";
import CampusFutureSection from "@/src/components/sections/infrastructure/CampusFutureSection";
import EngineeringLaboratories from "@/src/components/sections/infrastructure/EngineeringLaboratories";
import LaboratoryExplorer from "@/src/components/sections/infrastructure/LaboratoryExplorer";
import LibrarySection from "@/src/components/sections/infrastructure/LibrarySection";
import SeminarSection from "@/src/components/sections/infrastructure/SeminarSection";
import StudentFacilities from "@/src/components/sections/infrastructure/StudentFacilities";
import ExperienceSTCET from "@/src/components/sections/infrastructure/ExperienceSTCET";
import AcademicFacilities from "@/src/components/sections/infrastructure/AcademicFacilites";
import Container from "@/src/components/ui/Container";

export default function InfrastructurePage() {
  return (
    <>
      <InfrastructureHero />
      <CampusFutureSection />
      <AcademicFacilities />
      <EngineeringLaboratories />
      <LaboratoryExplorer />
      <Container className="grid lg:grid-cols-[1.5fr_1fr]">
        <LibrarySection />
        <SeminarSection />
      </Container>
      <StudentFacilities />
      <ExperienceSTCET />
    </>
  );
}
