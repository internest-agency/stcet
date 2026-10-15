import "server-only";

import type { CareerGroup } from "@/src/components/sections/courses/CareerPathways";
import type { CurriculumSlide } from "@/src/components/sections/courses/CurriculumExplorer";
import type { WhyStudyReason } from "@/src/components/sections/courses/WhyStudy";
import { connection } from "next/server";
import { Prisma } from "@/src/generated/prisma/client";
import { toPlainText } from "@/src/lib/content/html";
import {
  getCourseContent,
  type CourseContent,
} from "@/src/lib/courses/course-content";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

const courseContentInclude = {
  modules: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
  opportunities: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
  reasons: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
  careerPathways: {
    orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    include: {
      roles: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
    },
  },
  futurePaths: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] },
} satisfies Prisma.CourseInclude;

export type CourseWithContent = Prisma.CourseGetPayload<{
  include: typeof courseContentInclude;
}>;

export interface CoursePageData {
  name: string;
  degree: string;
  tagline: string;
  description: string;
  heroImage: string;
  programmeLabel: string;
  overviewHeading: string;
  overviewParagraphs: string[];
  overviewKeyStatement: string;
  curriculumTitle: string;
  curriculumIntro: string;
  slides: CurriculumSlide[];
  opportunityTitle: string;
  opportunities: string[];
  whyStudyLabel: string;
  whyStudyHeading: string;
  whyStudyIntro: string;
  reasons: WhyStudyReason[];
  careerTitle: string;
  careerIntro: string;
  careerGroups: CareerGroup[];
}

function contentToPageData(content: CourseContent): CoursePageData {
  const degree = content.degree.trim();
  return {
    name: content.name,
    degree,
    tagline: content.tagline,
    description: content.description,
    heroImage: content.heroImage,
    programmeLabel: degree ? `${degree} Programme` : "",
    overviewHeading: content.overviewHeading,
    overviewParagraphs: content.overviewParagraphs,
    overviewKeyStatement: content.overviewKeyStatement,
    curriculumTitle: content.curriculumTitle,
    curriculumIntro: content.curriculumIntro,
    slides: content.slides,
    opportunityTitle: content.opportunityTitle,
    opportunities: content.opportunities,
    whyStudyLabel: content.whyStudyLabel,
    whyStudyHeading: content.whyStudyHeading,
    whyStudyIntro: content.whyStudyIntro,
    reasons: content.reasons,
    careerTitle: content.careerTitle,
    careerIntro: content.careerIntro,
    careerGroups: content.careerGroups,
  };
}

function mergeCourse(
  course: CourseWithContent,
  fallback: CourseContent | undefined,
): CoursePageData {
  const degree = course.degree || fallback?.degree || "";
  return {
    name: course.name,
    degree,
    tagline: course.tagline || fallback?.tagline || "",
    description: course.description || fallback?.description || "",
    heroImage: course.heroImage || fallback?.heroImage || "",
    programmeLabel: degree ? `${degree} Programme` : "",
    overviewHeading: course.overviewHeading || fallback?.overviewHeading || "",
    overviewParagraphs: course.description
      ? [course.description]
      : (fallback?.overviewParagraphs ?? []),
    overviewKeyStatement:
      course.overviewKeyStatement || fallback?.overviewKeyStatement || "",
    curriculumTitle: course.curriculumTitle || fallback?.curriculumTitle || "",
    curriculumIntro: course.curriculumIntro || fallback?.curriculumIntro || "",
    slides: course.modules.length
      ? course.modules.map((module) => ({
          number: String(module.number).padStart(2, "0"),
          title: module.title,
          description: module.description,
          image: module.image,
        }))
      : (fallback?.slides ?? []),
    opportunityTitle:
      course.opportunityTitle || fallback?.opportunityTitle || "",
    opportunities: course.opportunities.length
      ? course.opportunities.map((opportunity) => opportunity.title)
      : (fallback?.opportunities ?? []),
    whyStudyLabel: course.whyStudyLabel || fallback?.whyStudyLabel || "",
    whyStudyHeading: course.whyStudyHeading || fallback?.whyStudyHeading || "",
    whyStudyIntro: course.whyStudyIntro || fallback?.whyStudyIntro || "",
    reasons: course.reasons.length
      ? course.reasons.map((reason) => ({
          number: String(reason.number).padStart(2, "0"),
          title: reason.title,
          description: reason.description,
        }))
      : (fallback?.reasons ?? []),
    careerTitle: course.careerTitle || fallback?.careerTitle || "",
    careerIntro: course.careerIntro || fallback?.careerIntro || "",
    careerGroups: course.careerPathways.length
      ? course.careerPathways.map((pathway) => ({
          number: String(pathway.number).padStart(2, "0"),
          title: pathway.title,
          image: pathway.image,
          roles: pathway.roles.map((role) => role.role),
        }))
      : (fallback?.careerGroups ?? []),
  };
}

export async function getPublishedCourses() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  await connection();

  try {
    const courses = await getPrismaClient().course.findMany({
      where: { isPublished: true },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        slug: true,
        degree: true,
        tagline: true,
        description: true,
        heroImage: true,
      },
    });

    // Listing and search surfaces render this as plain text, so strip any
    // stored rich-text markup rather than escaping it into the UI.
    return courses.map((course) => ({
      ...course,
      description: toPlainText(course.description) || null,
    }));
  } catch (error) {
    console.error("Failed to fetch published courses:", error);
    return [];
  }
}

export async function getPublishedCourse(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await connection();

  try {
    return await getPrismaClient().course.findFirst({
      where: { slug, isPublished: true },
    });
  } catch (error) {
    console.error("Failed to fetch published course:", error);
    return null;
  }
}

export async function getPublishedCourseMetadata(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await connection();

  try {
    return await getPrismaClient().course.findFirst({
      where: { slug, isPublished: true },
      select: {
        name: true,
        degree: true,
        tagline: true,
        seoTitle: true,
        metaDescription: true,
        canonicalUrl: true,
        ogImage: true,
        noIndex: true,
      },
    });
  } catch {
    console.error(
      "Course metadata unavailable; using the bundled page metadata.",
    );
    return null;
  }
}

export async function getPublishedCourseWithContent(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  await connection();

  try {
    return await getPrismaClient().course.findFirst({
      where: { slug, isPublished: true },
      include: courseContentInclude,
    });
  } catch (error) {
    console.error("Failed to fetch published course with content:", error);
    return null;
  }
}

export async function getCourseForAdmin(
  slug: string,
  authorize: () => Promise<void>,
) {
  await authorize();

  if (!isDatabaseConfigured()) {
    return null;
  }

  return getPrismaClient().course.findUnique({
    where: { slug },
    include: courseContentInclude,
  });
}

export async function getPublishedCoursePageData(
  slug: string,
): Promise<CoursePageData | null> {
  const fallback = getCourseContent(slug);

  if (!isDatabaseConfigured()) {
    return fallback ? contentToPageData(fallback) : null;
  }

  await connection();

  try {
    const course = await getPrismaClient().course.findUnique({
      where: { slug },
      include: courseContentInclude,
    });

    if (!course) {
      return fallback ? contentToPageData(fallback) : null;
    }
    if (!course.isPublished) {
      return null;
    }

    return mergeCourse(course, fallback);
  } catch (error) {
    console.error(
      "Course data unavailable; rendering the bundled course content.",
      error,
    );
    return fallback ? contentToPageData(fallback) : null;
  }
}
