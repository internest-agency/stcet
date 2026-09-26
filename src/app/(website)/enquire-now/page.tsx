import EnquiryForm from "@/src/components/sections/enquiry/EnquiryForm";
import EnquirySupport from "@/src/components/sections/enquiry/EnquirySupport";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Button from "@/src/components/ui/Button";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { FaCircleArrowRight } from "react-icons/fa6";

export default function EnquiryPage() {
  return (
    <>
      <EditorialHero
        image="/images/admissions/admissions-hero.webp"
        imageAlt="STCET students"
      >
        <Breadcrumb
          items={[{ label: "Enquire Now" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Let’s Start Your <span className="text-accent-400">Engineering</span>{" "}
          Journey.
        </SectionHeading>

        <p className="mt-7 max-w-lg text-white/70">
          Have questions about admissions, programmes, campus facilities or
          student life? Our team is here to help you find the information you
          need and guide you through the next step.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href="#application"
            variant="accent"
            rightIcon={<FaCircleArrowRight />}
          >
            Apply Now
          </Button>
        </div>
      </EditorialHero>
      <EnquiryForm />
      <EnquirySupport />
    </>
  );
}
