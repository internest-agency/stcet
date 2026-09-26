import ContactMain from "@/src/components/sections/contact/ContactMain";
import ContactMap from "@/src/components/sections/contact/ContactMap";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import Button from "@/src/components/ui/Button";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { FaCircleArrowRight } from "react-icons/fa6";

export default function ContactPage() {
  return (
    <>
      <EditorialHero
        image="/images/contact/contact-hero.webp"
        imageAlt="STCET students"
      >
        <Breadcrumb
          items={[{ label: "Contact Us" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Let’s Start a <span className="text-accent-400">Conversation.</span>
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
            Get in Touch
          </Button>
        </div>
      </EditorialHero>
      <ContactMain />
      <ContactMap />
    </>
  );
}
