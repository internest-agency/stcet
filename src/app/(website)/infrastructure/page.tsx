import CampusFutureSection from "@/src/components/sections/infrastructure/CampusFutureSection";
import EngineeringLaboratories from "@/src/components/sections/infrastructure/EngineeringLaboratories";
import LaboratoryExplorer from "@/src/components/sections/infrastructure/LaboratoryExplorer";
import LibrarySection from "@/src/components/sections/infrastructure/LibrarySection";
import SeminarSection from "@/src/components/sections/infrastructure/SeminarSection";
import StudentFacilities from "@/src/components/sections/infrastructure/StudentFacilities";
import ExperienceSTCET from "@/src/components/sections/infrastructure/ExperienceSTCET";
import AcademicFacilities from "@/src/components/sections/infrastructure/AcademicFacilites";
import Container from "@/src/components/ui/Container";
import EditorialHero from "@/src/components/ui/EditorialHero";
import { FaCircleArrowRight } from "react-icons/fa6";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Button from "@/src/components/ui/Button";

export default function InfrastructurePage() {
  return (
    <>
      <EditorialHero
        image="/images/infrastructure/hero.webp"
        imageAlt="STCET infrastructure"
      >
        <Breadcrumb
          items={[{ label: "Infrastructure" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Infrastructure That Inspires{" "}
          <span className="text-accent-400">Learning</span>
        </SectionHeading>

        <p className="mt-7 text-white/70">
          A thoughtfully designed campus with academic spaces, laboratories and
          student facilities that support learning, exploration and a
          well-rounded college experience.
        </p>

        <div className="mt-8">
          <Button
            href="#campus-future"
            variant="accent"
            rightIcon={<FaCircleArrowRight />}
          >
            Explore Our Campus
          </Button>
        </div>
      </EditorialHero>
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
