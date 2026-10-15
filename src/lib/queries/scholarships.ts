import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export async function getPublishedScholarships() {
  if (!isDatabaseConfigured()) return [];

  await connection();

  try {
    return await getPrismaClient().scholarship.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Scholarships query failed; using bundled content.", error);
    return [];
  }
}
