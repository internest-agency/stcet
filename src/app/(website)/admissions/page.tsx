import AdmissionsHero from "@/src/components/sections/admissions/AdmissionsHero";
import AdmissionOverview from "@/src/components/sections/admissions/AdmissionOverview";
import TNEAProcess from "@/src/components/sections/admissions/TNEAProcess";
import TNEACutoff from "@/src/components/sections/admissions/TNEACutoff";
import ManagementQuota from "@/src/components/sections/admissions/ManagementQuota";
import AdmissionEligibility from "@/src/components/sections/admissions/AdmissionEligibility";

export default function AdmissionsPage() {
  return (
    <>
      <AdmissionsHero />
      <AdmissionOverview />
      <TNEAProcess />
      <TNEACutoff />
      <ManagementQuota />
      <AdmissionEligibility />
    </>
  );
}
