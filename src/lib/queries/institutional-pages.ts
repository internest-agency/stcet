import "server-only";
import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
export async function getPublishedInstitutionalPage(slug: string) { if (!isDatabaseConfigured()) return null; await connection(); try { return await getPrismaClient().institutionalPage.findFirst({ where: { slug, isPublished: true }, include: { sections: { orderBy: [{ sortOrder: "asc" }, { id: "asc" }] } } }); } catch (error) { console.error("Institutional page query failed.", error); return null; } }
