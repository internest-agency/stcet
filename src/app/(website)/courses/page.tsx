import type { Metadata } from "next";
import EditorialHero from "@/src/components/ui/EditorialHero";
import Breadcrumb from "@/src/components/ui/Breadcrumb";
import SectionHeading from "@/src/components/ui/SectionHeading";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";
import CoursesExplorer from "@/src/components/sections/courses/CoursesExplorer";
import { getPublishedCourses } from "@/src/lib/queries/courses";

export const metadata: Metadata = {
  title: "Undergraduate Engineering Programmes | STCET",
  description:
    "Explore AICTE-approved and Anna University-affiliated undergraduate engineering courses at S. Thangapazham College of Engineering & Technology.",
  alternates: {
    canonical: "/courses",
  },
  openGraph: {
    title: "Undergraduate Engineering Programmes | STCET",
    description:
      "Explore AICTE-approved and Anna University-affiliated undergraduate engineering courses at S. Thangapazham College of Engineering & Technology.",
    images: ["/images/cse-hero-bg.webp"],
  },
};

export default async function CoursesPage() {
  const publishedCourses = await getPublishedCourses();

  return (
    <>
      <EditorialHero
        image="/images/infrastructure/hero.webp"
        imageAlt="STCET Engineering Campus and Academic Spaces"
      >
        <Breadcrumb
          items={[{ label: "Courses" }]}
          className="mb-6 text-white"
        />

        <SectionHeading as="h1" className="text-white">
          Undergraduate Programmes That{" "}
          <span className="text-accent-400">Shape What&apos;s Next.</span>
        </SectionHeading>

        <p className="mt-7 max-w-xl text-lg leading-relaxed text-gray-200">
          Discover career-defining four-year engineering degrees combining theoretical
          rigour, cutting-edge laboratory training, and industry immersion at S. Thangapazham
          College of Engineering &amp; Technology.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-xs font-bold text-accent-300 sm:text-sm">
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
            Anna University Affiliated
          </span>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
            AICTE Approved
          </span>
          <span className="rounded-full bg-white/10 px-3.5 py-1.5 backdrop-blur-xs">
            TNEA Counselling Code: 4944
          </span>
        </div>
      </EditorialHero>

      {/* Database-Driven Interactive Course Explorer */}
      <CoursesExplorer courses={publishedCourses} />

      {/* Global Call to Action */}
      <CourseCallToAction
        heading="Ready to Begin Your Engineering Career at STCET?"
        eyebrow="Admissions Open 2026–27"
        actionLabel="Apply via TNEA / Management Quota"
        actionHref="/enquire-now"
        actionTitle="Connect with Our Admissions Team"
        actionDescription="Learn about eligibility criteria, scholarship opportunities, and career pathways."
      />
    </>
  );
}
