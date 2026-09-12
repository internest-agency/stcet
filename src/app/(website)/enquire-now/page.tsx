import EnquiryHero from "@/src/components/sections/enquiry/EnquiryHero";
import EnquiryIntroduction from "@/src/components/sections/enquiry/EnquiryIntroduction";
import EnquiryForm from "@/src/components/sections/enquiry/EnquiryForm";
import EnquirySupport from "@/src/components/sections/enquiry/EnquirySupport";

export default function EnquiryPage() {
  return (
    <>
      <EnquiryHero />
      <EnquiryIntroduction />
      <EnquiryForm />
      <EnquirySupport />
    </>
  );
}
