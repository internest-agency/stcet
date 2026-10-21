import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface PublicFacultyMember {
  id: number;
  name: string;
  designation: string;
  department: string | null;
  group: string | null;
  groupId: number | null;
  auFin: string | null;
  aicteId: string | null;
  qualification: string | null;
  specialization: string | null;
  experience: number | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  bio: string | null;
  sortOrder: number;
}

export async function getPublishedFaculty(): Promise<PublicFacultyMember[]> {
  if (!isDatabaseConfigured()) return [];

  await connection();

  try {
    const prisma = getPrismaClient();
    return await prisma.faculty.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        designation: true,
        department: true,
        group: true,
        groupId: true,
        auFin: true,
        aicteId: true,
        qualification: true,
        specialization: true,
        experience: true,
        email: true,
        phone: true,
        photo: true,
        bio: true,
        sortOrder: true,
      },
    });
  } catch {
    console.error(
      "Faculty data unavailable; rendering an empty faculty listing.",
    );
    return [];
  }
}
