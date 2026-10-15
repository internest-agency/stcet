import "server-only";
import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
export async function getPublishedCommittee(slug: string) { if (!isDatabaseConfigured()) return null; await connection(); try { const prisma = getPrismaClient(); const committee = await prisma.committee.findFirst({ where: { slug, isPublished: true } }); const members = await prisma.committeeMember.findMany({ where: { committeeSlug: slug, isPublished: true, isActive: true }, orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }); return committee || members.length ? { committee, members } : null; } catch (error) { console.error("Committee query failed; using bundled content.", error); return null; } }
