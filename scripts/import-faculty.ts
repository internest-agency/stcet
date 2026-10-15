import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

/**
 * Faculty records transcribed from "STAFF WEB SITE 26-27.pdf".
 *
 * AU-FIN and AICTE IDs are stored as strings to preserve leading digits.
 * AICTE IDs that were blank in the source are kept as null. Photographs were
 * extracted to scripts/faculty-photos/raw but are intentionally NOT attached
 * because the source rows could not be matched to images with certainty; assign
 * them manually from the admin.
 */
const facultyRecords = [
  { name: "SUNDARAM M", designation: "Principal", auFin: "2632971969", aicteId: "1-46795721683" },
  { name: "KALIPONRAJ NAINAR", designation: "Assistant Professor", auFin: "2695221992", aicteId: "1-10637854314" },
  { name: "RAJESH B", designation: "Assistant Professor", auFin: "2657571991", aicteId: "1-1509528955" },
  { name: "Dr BHARATHIDASAN P", designation: "Associate Professor", auFin: "2639281984", aicteId: "1-47950425723" },
  { name: "SELVAKANI M", designation: "Assistant Professor", auFin: "2678391981", aicteId: "1-47429708063" },
  { name: "PAUL RAJ", designation: "Assistant Professor", auFin: "2693831984", aicteId: null },
  { name: "GANESAMOORTHI R", designation: "Assistant Professor", auFin: "2611751983", aicteId: null },
  { name: "JEYALAKSHMI J", designation: "Assistant Professor", auFin: "2670721989", aicteId: "1-47432300129" },
  { name: "MALATHI K", designation: "Assistant Professor", auFin: "2745701980", aicteId: "1-47950379444" },
  { name: "SANKARI ALIAS DEEPA R", designation: "Assistant Professor", auFin: "2762101987", aicteId: "1-47950379433" },
  { name: "THENMOZHIKANAGA P", designation: "Assistant Professor", auFin: "2742901993", aicteId: "1-47950379466" },
  { name: "BALAMURUGAN C", designation: "Assistant Professor", auFin: "2672921990", aicteId: "1-44645389947" },
  { name: "TAMIL VEERAN R", designation: "Assistant Professor", auFin: "2710501966", aicteId: "1-7382517439" },
  { name: "SAMYDURAI P", designation: "Assistant Professor", auFin: "2778431995", aicteId: "1-45819817452" },
  { name: "SATHIYA M", designation: "Assistant Professor", auFin: "2714851998", aicteId: null },
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

  let inserted = 0;
  let updated = 0;

  try {
    for (const [index, record] of facultyRecords.entries()) {
      const existing = await prisma.faculty.findFirst({
        where: record.auFin
          ? { auFin: record.auFin }
          : { name: record.name },
        select: { id: true, photo: true, isPublished: true },
      });

      if (existing) {
        await prisma.faculty.update({
          where: { id: existing.id },
          data: {
            name: record.name,
            designation: record.designation,
            auFin: record.auFin,
            aicteId: record.aicteId,
          },
        });
        updated += 1;
        process.stdout.write(`Updated: ${record.name}\n`);
      } else {
        await prisma.faculty.create({
          data: {
            name: record.name,
            designation: record.designation,
            auFin: record.auFin,
            aicteId: record.aicteId,
            sortOrder: index + 1,
            isPublished: false,
          },
        });
        inserted += 1;
        process.stdout.write(`Inserted: ${record.name}\n`);
      }
    }

    const existingMenu = await prisma.menuItem.findFirst({
      where: { url: "/faculty" },
      select: { id: true },
    });
    if (!existingMenu) {
      const highestOrder = await prisma.menuItem.aggregate({
        _max: { sortOrder: true },
      });
      await prisma.menuItem.create({
        data: {
          title: "Faculty",
          url: "/faculty",
          type: "link",
          sortOrder: (highestOrder._max.sortOrder ?? 0) + 1,
          isActive: true,
          isPublished: true,
        },
      });
      process.stdout.write('Created navigation menu item for "/faculty".\n');
    }

    await prisma.pageSeo.upsert({
      where: { pagePath: "/faculty" },
      create: {
        pagePath: "/faculty",
        pageTitle: "Faculty",
        metaDescription:
          "Meet the faculty and staff of S. Thangapazham College of Engineering & Technology.",
      },
      update: {},
    });

    process.stdout.write(
      `\nFaculty import complete: ${inserted} inserted, ${updated} updated, ${facultyRecords.length - inserted - updated} unchanged.\n`,
    );
    process.stdout.write(
      "Profiles were imported as drafts. Photographs need manual assignment from the admin.\n",
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  process.stderr.write(`Faculty import failed: ${message}\n`);
  process.exitCode = 1;
});
