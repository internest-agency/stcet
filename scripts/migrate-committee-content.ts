import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";

type SeedMember = {
  memberName: string;
  designation: string | null;
  role: string | null;
  sortOrder: number;
};

type SeedCommittee = {
  slug: string;
  name: string;
  pageTitle: string;
  members: SeedMember[];
};

const seed: SeedCommittee[] = [
  {
    slug: "anti-ragging-committee",
    name: "Anti-Ragging Committee",
    pageTitle: "Anti-Ragging Committee",
    members: [
      { memberName: "Prof.Dr.Sundaram M", designation: "Chairman", role: "Committee", sortOrder: 0 },
      { memberName: "Inspector of Police, Vasudevanallur", designation: "Member", role: "Committee", sortOrder: 1 },
      { memberName: "Thasildhar,Sivagiri", designation: "Member", role: "Committee", sortOrder: 2 },
      { memberName: "Shri.Thavamani.G", designation: "NGO Official", role: "Committee", sortOrder: 3 },
      { memberName: "Shri.Sam David Raja", designation: "Representative Non Teaching", role: "Committee", sortOrder: 4 },
      { memberName: "Prof.Dr.Sundaram M", designation: "Chairman", role: "Squad", sortOrder: 5 },
      { memberName: "Shri.Rajesh.B", designation: "HoD", role: "Squad", sortOrder: 6 },
      { memberName: "Shri.Kaliponraj.N", designation: "Faculty Member", role: "Squad", sortOrder: 7 },
      { memberName: "Shri.Sam David Raja", designation: "Representative Non Teaching", role: "Squad", sortOrder: 8 },
    ],
  },
  {
    slug: "grievance-redressal-committee",
    name: "Grievance Redressal Committee",
    pageTitle: "Grievance Redressal Committee",
    members: [
      { memberName: "Prof.Dr.Sundaram M", designation: "Chairman", role: null, sortOrder: 0 },
      { memberName: "Shri.Bala Murugan.C", designation: "Member", role: null, sortOrder: 1 },
      { memberName: "Shri.Rajesh.B", designation: "Member", role: null, sortOrder: 2 },
    ],
  },
  {
    slug: "internal-complaints-committee",
    name: "Internal Complaints Committee",
    pageTitle: "Internal Complaints Committee",
    members: [
      { memberName: "Prof.Dr.Sundaram M", designation: "Chairman", role: null, sortOrder: 0 },
      { memberName: "Sri.Kaliponraj N", designation: "Senior Faculty", role: null, sortOrder: 1 },
      { memberName: "Sri.Sriram A", designation: "Deputy Warden", role: "Boys hostel", sortOrder: 2 },
      { memberName: "Mrs.Selvakani M", designation: "Lady Faculty Member", role: null, sortOrder: 3 },
    ],
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
    for (const entry of seed) {
      let committee = await prisma.committee.findUnique({ where: { slug: entry.slug } });
      if (!committee) {
        committee = await prisma.committee.create({
          data: {
            slug: entry.slug,
            name: entry.name,
            pageTitle: entry.pageTitle,
            sortOrder: 0,
            isPublished: true,
          },
        });
        console.log(`  committee ${entry.slug}: created (id ${committee.id})`);
      } else {
        console.log(`  committee ${entry.slug}: already present (id ${committee.id})`);
      }

      const existing = await prisma.committeeMember.count({ where: { committeeSlug: entry.slug } });
      if (existing > 0) {
        console.log(`  members ${entry.slug}: skipped (${existing} already present)`);
        continue;
      }

      await prisma.committeeMember.createMany({
        data: entry.members.map((member) => ({
          committeeSlug: entry.slug,
          committeeName: entry.name,
          memberName: member.memberName,
          designation: member.designation,
          role: member.role,
          sortOrder: member.sortOrder,
          isActive: true,
          isPublished: true,
        })),
      });
      console.log(`  members ${entry.slug}: created ${entry.members.length}`);
    }

    const committees = await prisma.committee.count();
    const members = await prisma.committeeMember.count();
    console.log(`Migration complete. ${committees} committee(s), ${members} member(s).`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Migration failed:", error);
  process.exitCode = 1;
});
