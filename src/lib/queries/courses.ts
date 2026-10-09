import "server-only";

import type { CareerGroup } from "@/src/components/sections/courses/CareerPathways";
import type { CurriculumSlide } from "@/src/components/sections/courses/CurriculumExplorer";
import type { WhyStudyReason } from "@/src/components/sections/courses/WhyStudy";
import { connection } from "next/server";
import { Prisma } from "@/src/generated/prisma/client";
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

export interface CoursePageFallback {
  name: string;
  tagline: string;
  description: string;
  heroImage: string;
  slides: CurriculumSlide[];
  opportunities: string[];
  reasons: WhyStudyReason[];
  careerGroups: CareerGroup[];
}

export type CoursePageData = CoursePageFallback;

export async function getPublishedCourses() {
  if (!isDatabaseConfigured()) {
    return [];
  }

  return getPrismaClient().course.findMany({
    where: { isPublished: true },
    orderBy: [{ name: "asc" }, { id: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      degree: true,
      tagline: true,
      heroImage: true,
    },
  });
}

export async function getPublishedCourse(slug: string) {
  if (!isDatabaseConfigured()) {
    return null;
  }

  return getPrismaClient().course.findFirst({
    where: { slug, isPublished: true },
  });
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

  return getPrismaClient().course.findFirst({
    where: { slug, isPublished: true },
    include: courseContentInclude,
  });
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
  fallback: CoursePageFallback,
): Promise<CoursePageData | null> {
  if (!isDatabaseConfigured()) {
    return fallback;
  }

  await connection();

  try {
    const course = await getPrismaClient().course.findUnique({
      where: { slug },
      include: courseContentInclude,
    });

    if (!course) {
      return fallback;
    }
    if (!course.isPublished) {
      return null;
    }

    return {
      name: course.name,
      tagline: course.tagline ?? fallback.tagline,
      description: course.description ?? fallback.description,
      heroImage: course.heroImage ?? fallback.heroImage,
      slides: course.modules.length
        ? course.modules.map((module) => ({
            number: String(module.number).padStart(2, "0"),
            title: module.title,
            description: module.description,
            image: module.image,
          }))
        : fallback.slides,
      opportunities: course.opportunities.length
        ? course.opportunities.map((opportunity) => opportunity.title)
        : fallback.opportunities,
      reasons: course.reasons.length
        ? course.reasons.map((reason) => ({
            number: String(reason.number).padStart(2, "0"),
            title: reason.title,
            description: reason.description,
          }))
        : fallback.reasons,
      careerGroups: course.careerPathways.length
        ? course.careerPathways.map((pathway) => ({
            number: String(pathway.number).padStart(2, "0"),
            title: pathway.title,
            image: pathway.image,
            roles: pathway.roles.map((role) => role.role),
          }))
        : fallback.careerGroups,
    };
  } catch {
    console.error(
      "Course data unavailable; rendering the bundled course content.",
    );
    return fallback;
  }
}
