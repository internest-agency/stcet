import type { Metadata } from "next";
import { getPublicAdmissionsData } from "@/src/lib/queries/admissions";
import WhySTCET from "@/src/components/sections/admissions/WhySTCET";
import AdmissionRoutes, {
  AdmissionRouteItem,
} from "@/src/components/sections/admissions/AdmissionRoutes";
import ManagementQuota from "@/src/components/sections/admissions/ManagementQuota";
import ImportantInformation from "@/src/components/sections/admissions/ImportantInformation";
import TNEAApplication, {
  TNEAStep,
} from "@/src/components/sections/admissions/TNEAApplication";
import TNEAAcademicRequirements from "@/src/components/sections/admissions/TNEAAcademicRequirements";
import AdmissionContacts, {
  AdmissionContactItem,
} from "@/src/components/sections/admissions/AdmissionContacts";
import EditorialHero from "@/src/components/ui/EditorialHero";
import { FaCircleArrowRight } from "react-icons/fa6";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import SectionHeading from "@/src/components/ui/SectionHeading";
import Button from "@/src/components/ui/Button";

export const metadata: Metadata = {
  title: "Admissions | S. Thangapazham College of Engineering & Technology",
  description:
    "Explore admission routes, TNEA counselling process, management quota eligibility, and application guidelines for STCET.",
};

export default async function AdmissionsPage() {
  const admissionsData = await getPublicAdmissionsData();

  const initialRoutes: AdmissionRouteItem[] | undefined =
    admissionsData?.routes && admissionsData.routes.length > 0
      ? admissionsData.routes.map((route, idx) => ({
          number: route.number || String(idx + 1).padStart(2, "0"),
          title: route.title,
          description: route.description || "",
          image:
            route.imagePath ||
            (idx === 0
              ? "/images/admissions/admission-via-tnea-couselling.webp"
              : "/images/admissions/management-quota-admission.webp"),
          href:
            route.linkHref || (idx === 0 ? "#tnea-journey" : "/enquire-now"),
          button:
            route.linkText ||
            (idx === 0 ? "Explore TNEA Process" : "Enquire Now"),
        }))
      : undefined;

  const initialSteps: TNEAStep[] | undefined =
    admissionsData?.tneaSteps && admissionsData.tneaSteps.length > 0
      ? admissionsData.tneaSteps.map((step) => ({
          number: String(step.stepNumber).padStart(2, "0"),
          navTitle: step.title,
          title: step.title,
          description: step.description || "",
          points: Array.isArray(step.instructions)
            ? step.instructions.filter(
                (instruction): instruction is string =>
                  typeof instruction === "string",
              )
            : [],
          image: step.imagePath || undefined,
          imageLabel: step.imageLabel || undefined,
        }))
      : undefined;

  const initialContacts: AdmissionContactItem[] | undefined =
    admissionsData?.contacts && admissionsData.contacts.length > 0
      ? admissionsData.contacts.map((contact) => ({
          id: contact.id,
          contactType: contact.contactType || null,
          title: contact.title,
          value: contact.value,
        }))
      : undefined;

  const heroTitle = admissionsData?.intro?.title;
  const heroDescription =
    admissionsData?.intro?.description ||
    admissionsData?.intro?.subtitle ||
    "Admissions are open for the 2026–27 academic year through TNEA Counselling and Management Quota, subject to applicable eligibility and admission norms.";

  return (
    <>
      <EditorialHero
        image="/images/admissions/stcet-campus-hero.webp"
        imageAlt="STCET students"
      >
        <Breadcrumb
          items={[{ label: "Admissions" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          {heroTitle ? (
            heroTitle
          ) : (
            <>
              Begin Your{" "}
              <span className="text-accent-400">Engineering Journey.</span>
            </>
          )}
        </SectionHeading>

        <p className="mt-7 max-w-lg text-white/70">{heroDescription}</p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            href="/enquire-now"
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
      <AdmissionRoutes initialRoutes={initialRoutes} />
      <TNEAApplication initialSteps={initialSteps} />
      <TNEAAcademicRequirements />
      <ManagementQuota quotaInfo={admissionsData?.quotaInfo} />
      <AdmissionContacts initialContacts={initialContacts} />
      <ImportantInformation
        notices={admissionsData?.notices}
        links={admissionsData?.links}
      />
    </>
  );
}
