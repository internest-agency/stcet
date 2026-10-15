import "server-only";
import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export async function getPublishedInfrastructureFacilities() {
  if (!isDatabaseConfigured()) return [];
  await connection();
  try { return await getPrismaClient().infrastructureFacility.findMany({ where: { isPublished: true, isActive: true }, orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { id: "asc" }] }); }
  catch (error) { console.error("Infrastructure query failed; using bundled content.", error); return []; }
}
