import ScholarshipsHero from "@/src/components/sections/scholarships/ScholarshipsHero";
import ScholarshipOverview from "@/src/components/sections/scholarships/ScholarshipOverview";
import ScholarshipSchemes from "@/src/components/sections/scholarships/ScholarshipSchemes";
import ScholarshipNote from "@/src/components/sections/scholarships/ScholarshipNote";

export default function ScholarshipsPage() {
  return (
    <>
      <ScholarshipsHero />
      <ScholarshipOverview />
      <ScholarshipSchemes />
      <ScholarshipNote />
    </>
  );
}
