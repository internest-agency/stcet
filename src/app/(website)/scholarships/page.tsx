import ScholarshipsHero from "@/src/components/sections/scholarships/ScholarshipsHero";
import ScholarshipOverview from "@/src/components/sections/scholarships/ScholarshipOverview";
import GovernmentSchemes from "@/src/components/sections/scholarships/GovernmentSchemes";
import CommunitySupport from "@/src/components/sections/enquiry/CommunitySupport";
import AICTEPragati from "@/src/components/sections/scholarships/AICTEPragati";
import ScholarshipAtAGlance from "@/src/components/sections/enquiry/ScholarshipAtAGlance";
import ScholarshipImportantNote from "@/src/components/sections/scholarships/ScholarshipImportantNote";

export default function ScholarshipsPage() {
  return (
    <>
      <ScholarshipsHero />
      <ScholarshipOverview />
      <GovernmentSchemes />
      <CommunitySupport />
      <AICTEPragati />
      <ScholarshipAtAGlance />
      <ScholarshipImportantNote />
    </>
  );
}
