import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

const courses = [
  {
    name: "Computer Science and Engineering",
    slug: "computer-science-engineering",
    degree: "B.E.",
    tagline: "Think. Build. Transform.",
    heroImage: "/images/cse-hero-bg.webp",
  },
  {
    name: "Electronics and Communication Engineering",
    slug: "electronics-communication-engineering",
    degree: "B.E.",
    tagline: "Connecting Ideas. Powering Innovation.",
    heroImage: "/images/ece-hero-bg.webp",
  },
  {
    name: "Electrical and Electronics Engineering",
    slug: "electrical-electronics-engineering",
    degree: "B.E.",
    tagline: "Powering Technology. Enabling Tomorrow.",
    heroImage: "/images/eee-hero-bg.webp",
  },
  {
    name: "Information Technology",
    slug: "information-technology",
    degree: "B.Tech.",
    tagline: "Transforming Information. Enabling Innovation.",
    heroImage: "/images/cse-ai-ml-hero-bg.webp",
  },
  {
    name: "Computer Science and Engineering (AI & ML)",
    slug: "computer-science-ai-ml",
    degree: "B.E.",
    tagline: "Learn. Predict. Innovate.",
    heroImage: "/images/cse-ai-ml-hero-bg.webp",
  },
];

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
    for (const course of courses) {
      await prisma.course.upsert({
        where: { slug: course.slug },
        create: { ...course, isPublished: true },
        update: {},
      });
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
      `Verified ${courses.length} courses and ${galleryImages.length} gallery images without overwriting existing content.\n`,
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
