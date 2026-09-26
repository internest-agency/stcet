import CareerApplicationForm from "@/src/components/sections/careers/CareerApplicationForm";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Button from "@/src/components/ui/Button";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { FaCircleArrowRight } from "react-icons/fa6";

export default function CareerPage() {
  return (
    <>
      <EditorialHero
        image="/images/careers/career-hero.webp"
        imageAlt="STCET students"
      >
        <Breadcrumb
          items={[{ label: "Careers" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Join Our Team.
        </SectionHeading>

        <p className="mt-7 max-w-lg text-white/70">
          We are looking for passionate, talented, and committed professionals
          who would like to be part of a growing institution committed to
          excellence in education, innovation, and student development.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href="#application"
            variant="accent"
            rightIcon={<FaCircleArrowRight />}
          >
            Apply Now
          </Button>

          <Button
            href="/contact"
            variant="primary"
            rightIcon={<FaCircleArrowRight />}
          >
            Contact Us
          </Button>
        </div>
      </EditorialHero>
      <CareerApplicationForm />
    </>
  );
}
