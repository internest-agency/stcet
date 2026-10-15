import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseHero from "@/src/components/sections/courses/CourseHero";
import CourseOverview from "@/src/components/sections/courses/CourseOverview";
import OpportunityAreas from "@/src/components/sections/courses/OpportunityAreas";
import CareerPathways from "@/src/components/sections/courses/CareerPathways";
import CurriculumExplorer from "@/src/components/sections/courses/CurriculumExplorer";
import WhyStudy from "@/src/components/sections/courses/WhyStudy";
import CourseCallToAction from "@/src/components/ui/CourseCallToAction";
import { getCourseContent } from "@/src/lib/courses/course-content";
import {
  getPublishedCourseMetadata,
  getPublishedCoursePageData,
} from "@/src/lib/queries/courses";

interface CourseDynamicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: CourseDynamicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const fallback = getCourseContent(slug);
  const course = await getPublishedCourseMetadata(slug);

  if (!course && !fallback) {
    return {
      title: "Course Not Found | STCET",
      robots: { index: false, follow: false },
    };
  }

  const name = course?.name || fallback?.name || "";
  const title =
    course?.seoTitle || (name ? `${name} | STCET` : "Course | STCET");
  const description =
    course?.metaDescription ||
    fallback?.overviewParagraphs[0] ||
    `Explore the ${name} undergraduate programme at S. Thangapazham College of Engineering & Technology.`;

  const fallbackImage = fallback?.heroImage || undefined;
  const ogImage = course?.ogImage || fallbackImage;

  return {
    title,
    description,
    alternates: { canonical: course?.canonicalUrl ?? `/courses/${slug}` },
    robots:
      course === null
        ? undefined
        : { index: !course.noIndex, follow: !course.noIndex },
    openGraph: {
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function DynamicCoursePage({
  params,
}: CourseDynamicPageProps) {
  const { slug } = await params;
  const page = await getPublishedCoursePageData(slug);

  if (!page) {
    notFound();
  }

  return (
    <>
      <CourseHero
        image={page.heroImage || "/images/cse-hero-bg.webp"}
        programmeLabel={page.programmeLabel}
        heading={page.name}
        tagline={page.tagline}
        breadcrumbItems={[
          {
            label: "Courses",
            href: "/courses",
          },
          {
            label: page.name,
          },
        ]}
      />

      <CourseOverview
        label="About the Programme"
        heading={page.overviewHeading || `${page.name} at STCET`}
        paragraphs={page.overviewParagraphs.map((content) => ({ content }))}
        keyStatement={page.overviewKeyStatement || undefined}
      />

      {page.slides.length > 0 && (
        <CurriculumExplorer
          title={
            page.curriculumTitle ||
            "Build your foundation with modern curriculum."
          }
          intro={
            page.curriculumIntro ||
            "Comprehensive theoretical and practical coursework designed for engineering excellence."
          }
          slides={page.slides}
        />
      )}

      {page.opportunities.length > 0 && (
        <OpportunityAreas
          title={
            page.opportunityTitle ||
            "Explore career & technology opportunity areas."
          }
          data={page.opportunities}
        />
      )}

      {page.reasons.length > 0 && (
        <WhyStudy
          label={page.whyStudyLabel || `Why Study ${page.degree} ${page.name}`}
          heading={
            page.whyStudyHeading ||
            "Build the skills to shape the digital world"
          }
          intro={
            page.whyStudyIntro ||
            "Gain deep foundational knowledge, hands-on laboratory experience, and direct industry exposure."
          }
          reasons={page.reasons}
        />
      )}

      {page.careerGroups.length > 0 && (
        <CareerPathways
          careerTitle={
            page.careerTitle || "From Learning to Leading What's Next"
          }
          careerIntro={
            page.careerIntro ||
            "Graduate prepared for leading industry roles, specialized certifications, and postgraduate research."
          }
          careerGroups={page.careerGroups}
        />
      )}
    </>
  );
}
