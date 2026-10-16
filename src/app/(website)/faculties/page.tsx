import type { Metadata } from "next";
import FacultyGrid from "@/src/components/sections/faculty/FacultyGrid";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import EditorialHero from "@/src/components/ui/EditorialHero";
import SectionHeading from "@/src/components/ui/SectionHeading";
import { getPublishedFaculty } from "@/src/lib/queries/faculty";
import { getPageSeo } from "@/src/lib/queries/seo";

const PAGE_PATH = "/faculty";
const DEFAULT_TITLE =
  "Faculty | S. Thangapazham College of Engineering & Technology";
const DEFAULT_DESCRIPTION =
  "Meet the faculty and staff of S. Thangapazham College of Engineering & Technology, and explore their departments, qualifications, and areas of specialization.";
const DEFAULT_IMAGE = "/images/committee-hero.webp";

export const generateMetadata = async (): Promise<Metadata> => {
  const seo = await getPageSeo(PAGE_PATH);

  return {
    title: seo.seoTitle || DEFAULT_TITLE,
    description: seo.metaDescription || DEFAULT_DESCRIPTION,
    alternates: { canonical: seo.canonicalUrl || PAGE_PATH },
    robots: seo.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: seo.seoTitle || "Faculty | STCET",
      description: seo.metaDescription || DEFAULT_DESCRIPTION,
      images: seo.ogImage ? [seo.ogImage] : [DEFAULT_IMAGE],
    },
  };
};

export default async function FacultyPage() {
  const members = await getPublishedFaculty();

  return (
    <>
      <EditorialHero
        image={DEFAULT_IMAGE}
        imageAlt="S. Thangapazham College of Engineering & Technology"
      >
        <Breadcrumb
          items={[{ label: "Campus" }, { label: "Faculty" }]}
          className="mb-8 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Our <span className="text-accent-400">Faculty</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-200">
          Meet the educators and researchers who guide students across the
          college.
        </p>
      </EditorialHero>
      <FacultyGrid members={members} />
    </>
  );
}
