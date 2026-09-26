import WhySTCET from "@/src/components/sections/admissions/WhySTCET";
import AdmissionRoutes from "@/src/components/sections/admissions/AdmissionRoutes";
import ManagementQuota from "@/src/components/sections/admissions/ManagementQuota";
import ImportantInformation from "@/src/components/sections/admissions/ImportantInformation";
import TNEAApplication from "@/src/components/sections/admissions/TNEAApplication";
import TNEAAcademicRequirements from "@/src/components/sections/admissions/TNEAAcademicRequirements";
import EditorialHero from "@/src/components/ui/EditorialHero";
import { FaCircleArrowRight } from "react-icons/fa6";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Button from "@/src/components/ui/Button";

export default function AdmissionsPage() {
  return (
    <>
      <EditorialHero
        image="/images/admissions/admissions-hero.webp"
        imageAlt="STCET students"
      >
        <Breadcrumb
          items={[{ label: "Admissions" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Begin Your{" "}
          <span className="text-accent-400">Engineering Journey.</span>
        </SectionHeading>

        <p className="mt-7 max-w-lg text-white/70">
          Admissions are open for the 2026–27 academic year through TNEA
          Counselling and Management Quota, subject to applicable eligibility
          and admission norms.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href="/enquire-now#application"
            variant="accent"
            size="md"
            rightIcon={<FaCircleArrowRight />}
          >
            Apply Now
          </Button>

          <Button
            href="/contact"
            variant="primary"
            size="md"
            rightIcon={<FaCircleArrowRight />}
          >
            Contact Us
          </Button>
        </div>
      </EditorialHero>
      <WhySTCET />
      <AdmissionRoutes />
      <TNEAApplication />
      <TNEAAcademicRequirements />
      <ManagementQuota />
      <ImportantInformation />
    </>
  );
}
