import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { courseContent } from "../src/lib/courses/course-content";

const courseSectionFields = {
  overviewHeading: true,
  overviewKeyStatement: true,
  curriculumTitle: true,
  curriculumIntro: true,
  opportunityTitle: true,
  whyStudyLabel: true,
  whyStudyHeading: true,
  whyStudyIntro: true,
  careerTitle: true,
  careerIntro: true,
} as const;

const galleryCategories = [
  { name: "Campus", slug: "campus", sortOrder: 0 },
  { name: "Academics", slug: "academics", sortOrder: 1 },
  { name: "Library", slug: "library", sortOrder: 2 },
  { name: "Hostel", slug: "hostel", sortOrder: 3 },
  { name: "Student Life", slug: "student-life", sortOrder: 4 },
];

const galleryImages = [
  {
    title: "Engineering Block",
    category: "campus",
    imagePath: "/images/gallery/stcet-engineering-block-entrance.jpg",
  },
  {
    title: "Computer Laboratory",
    category: "academics",
    imagePath: "/images/gallery/stcet-computer-lab-1.jpg",
  },
  {
    title: "Classroom",
    category: "academics",
    imagePath: "/images/gallery/stcet-classroom.jpg",
  },
  {
    title: "College Library",
    category: "library",
    imagePath: "/images/gallery/stcet-college-library.jpg",
  },
  {
    title: "Digital Library",
    category: "library",
    imagePath: "/images/gallery/stcet-library-computer.jpg",
  },
  {
    title: "Boys Hostel",
    category: "hostel",
    imagePath: "/images/gallery/stcet-boys-hostel.jpg",
  },
  {
    title: "Girls Hostel",
    category: "hostel",
    imagePath: "/images/gallery/stcet-girls-hostel.jpg",
  },
  {
    title: "Girls Hostel Interior",
    category: "hostel",
    imagePath: "/images/gallery/stcet-girls-hostel-inside-1.jpg",
  },
  {
    title: "Dining Hall",
    category: "student-life",
    imagePath: "/images/gallery/stcet-dining-hall.jpg",
  },
];

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 2,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    for (const [slug, content] of Object.entries(courseContent)) {
      const existing = await prisma.course.findUnique({
        where: { slug },
        select: {
          id: true,
          ...courseSectionFields,
          _count: {
            select: {
              modules: true,
              opportunities: true,
              reasons: true,
              careerPathways: true,
            },
          },
        },
      });

      if (!existing) {
        await prisma.course.create({
          data: {
            name: content.name,
            slug,
            degree: content.degree,
            tagline: content.tagline || null,
            description: content.description || null,
            heroImage: content.heroImage || null,
            overviewHeading: content.overviewHeading || null,
            overviewKeyStatement: content.overviewKeyStatement || null,
            curriculumTitle: content.curriculumTitle || null,
            curriculumIntro: content.curriculumIntro || null,
            opportunityTitle: content.opportunityTitle || null,
            whyStudyLabel: content.whyStudyLabel || null,
            whyStudyHeading: content.whyStudyHeading || null,
            whyStudyIntro: content.whyStudyIntro || null,
            careerTitle: content.careerTitle || null,
            careerIntro: content.careerIntro || null,
            isPublished: true,
            modules: content.slides.length
              ? {
                  create: content.slides.map((slide, sortOrder) => ({
                    number: Number(slide.number),
                    title: slide.title,
                    description: slide.description,
                    image: slide.image,
                    sortOrder,
                  })),
                }
              : undefined,
            opportunities: content.opportunities.length
              ? {
                  create: content.opportunities.map(
                    (opportunity, sortOrder) => ({
                      title: opportunity,
                      sortOrder,
                    }),
                  ),
                }
              : undefined,
            reasons: content.reasons.length
              ? {
                  create: content.reasons.map((reason, sortOrder) => ({
                    number: Number(reason.number),
                    title: reason.title,
                    description: reason.description,
                    sortOrder,
                  })),
                }
              : undefined,
            careerPathways: content.careerGroups.length
              ? {
                  create: content.careerGroups.map((group, sortOrder) => ({
                    number: Number(group.number),
                    title: group.title,
                    image: group.image,
                    sortOrder,
                    roles: {
                      create: group.roles.map((role, roleOrder) => ({
                        role,
                        sortOrder: roleOrder,
                      })),
                    },
                  })),
                }
              : undefined,
          },
        });
        continue;
      }

      const sectionPatch: Record<string, string> = {};
      for (const field of Object.keys(
        courseSectionFields,
      ) as (keyof typeof courseSectionFields)[]) {
        if (existing[field] === null && content[field]) {
          sectionPatch[field] = content[field];
        }
      }
      if (Object.keys(sectionPatch).length) {
        await prisma.course.update({ where: { slug }, data: sectionPatch });
      }

      if (existing._count.modules === 0 && content.slides.length) {
        await prisma.courseModule.createMany({
          data: content.slides.map((slide, sortOrder) => ({
            courseId: existing.id,
            number: Number(slide.number),
            title: slide.title,
            description: slide.description,
            image: slide.image,
            sortOrder,
          })),
        });
      }

      if (existing._count.opportunities === 0 && content.opportunities.length) {
        await prisma.courseOpportunity.createMany({
          data: content.opportunities.map((opportunity, sortOrder) => ({
            courseId: existing.id,
            title: opportunity,
            sortOrder,
          })),
        });
      }

      if (existing._count.reasons === 0 && content.reasons.length) {
        await prisma.courseReason.createMany({
          data: content.reasons.map((reason, sortOrder) => ({
            courseId: existing.id,
            number: Number(reason.number),
            title: reason.title,
            description: reason.description,
            sortOrder,
          })),
        });
      }

      if (
        existing._count.careerPathways === 0 &&
        content.careerGroups.length
      ) {
        for (const [sortOrder, group] of content.careerGroups.entries()) {
          await prisma.careerPathway.create({
            data: {
              courseId: existing.id,
              number: Number(group.number),
              title: group.title,
              image: group.image,
              sortOrder,
              roles: {
                create: group.roles.map((role, roleOrder) => ({
                  role,
                  sortOrder: roleOrder,
                })),
              },
            },
          });
        }
      }
    }
    for (const category of galleryCategories) {
      await prisma.galleryCategory.upsert({
        where: { slug: category.slug },
        create: { ...category, isActive: true },
        update: {},
      });
    }
    for (const [sortOrder, image] of galleryImages.entries()) {
      const category = await prisma.galleryCategory.findUnique({
        where: { slug: image.category },
        select: { id: true },
      });
      if (!category) continue;

      await prisma.galleryImage.upsert({
        where: { imagePath: image.imagePath },
        create: {
          title: image.title,
          altText: image.title,
          categoryId: category.id,
          imagePath: image.imagePath,
          isPublished: true,
          sortOrder,
        },
        update: {},
      });
    }
    process.stdout.write(
      `Verified ${Object.keys(courseContent).length} courses and ${galleryImages.length} gallery images without overwriting existing content.\n`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  process.stderr.write(`Course seed failed: ${message}\n`);
  process.exitCode = 1;
});
