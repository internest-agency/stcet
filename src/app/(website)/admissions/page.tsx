import AdmissionsHero from "@/src/components/sections/admissions/AdmissionsHero";
import WhySTCET from "@/src/components/sections/admissions/WhySTCET";
import AdmissionRoutes from "@/src/components/sections/admissions/AdmissionRoutes";
import ManagementQuota from "@/src/components/sections/admissions/ManagementQuota";
import ImportantInformation from "@/src/components/sections/admissions/ImportantInformation";
import TNEAApplication from "@/src/components/sections/admissions/TNEAApplication";
import TNEAAcademicRequirements from "@/src/components/sections/admissions/TNEAAcademicRequirements";

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHero />
      <WhySTCET />
      <AdmissionRoutes />
      <TNEAApplication />
      <TNEAAcademicRequirements />
      <ManagementQuota />
      <ImportantInformation />
    </>
  );
}
