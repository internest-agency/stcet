"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdministrator, requireAdmin, requireAdministrator } from "@/src/lib/admin/authorization";
import { companySchema, programmeSchema } from "@/src/lib/admin/placement-validation";
import { cleanupUnreferencedUploads, validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

function refresh() { revalidatePath("/admin/placements"); revalidatePath("/placements"); }
function duplicate(error: unknown) { return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"; }

export async function saveCompany(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = companySchema.safeParse({ name: formData.get("name"), slug: formData.get("slug"), websiteUrl: formData.get("websiteUrl") || null, logoPath: formData.get("logoPath") || null, sortOrder: formData.get("sortOrder"), isActive: formData.get("isActive") === "on", isPublished: formData.get("isPublished") === "on" });
  if (!parsed.success) redirect("/admin/placements?error=invalid-company");
  const id = Number(formData.get("id")); const updating = Number.isSafeInteger(id) && id > 0; const prisma = getPrismaClient();
  const previous = updating ? await prisma.placementCompany.findUnique({ where: { id } }) : null;
  if (updating && !previous) redirect("/admin/placements?error=missing");
  if (previous?.isPublished && !isAdministrator(admin)) redirect("/admin/placements?error=forbidden");
  if (!(await validateImageReferences([parsed.data.logoPath ?? ""], previous?.logoPath ? [previous.logoPath] : []))) redirect("/admin/placements?error=image-unregistered");
  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try { const saved = await prisma.$transaction(async (tx) => { const value = { ...parsed.data, logoPath: parsed.data.logoPath ?? null, websiteUrl: parsed.data.websiteUrl ?? null, isPublished }; const record = updating ? await tx.placementCompany.update({ where: { id }, data: value }) : await tx.placementCompany.create({ data: value }); await tx.adminAuditLog.create({ data: { actorId: admin.id, action: updating ? "update" : "create", entityType: "PlacementCompany", entityId: String(record.id), details: { name: record.name, isPublished, isActive: record.isActive } } }); return record; }); if (previous?.logoPath && previous.logoPath !== saved.logoPath) await cleanupUnreferencedUploads([previous.logoPath]); } catch (error) { if (duplicate(error)) redirect("/admin/placements?error=duplicate-company"); redirect("/admin/placements?error=save"); }
  refresh(); redirect("/admin/placements?saved=company");
}

async function saveContent(formData: FormData, kind: "programme" | "interaction"): Promise<never> {
  const admin = await requireAdmin(); const parsed = programmeSchema.safeParse({ title: formData.get("title"), description: formData.get("description") || null, imagePath: formData.get("imagePath") || null, sortOrder: formData.get("sortOrder"), isPublished: formData.get("isPublished") === "on" });
  if (!parsed.success) redirect("/admin/placements?error=invalid-content"); const id = Number(formData.get("id")); const updating = Number.isSafeInteger(id) && id > 0; const prisma = getPrismaClient();
  const previous = updating ? (kind === "programme" ? await prisma.trainingProgramme.findUnique({ where: { id } }) : await prisma.industryInteraction.findUnique({ where: { id } })) : null;
  if (updating && !previous) redirect("/admin/placements?error=missing"); if (previous?.isPublished && !isAdministrator(admin)) redirect("/admin/placements?error=forbidden");
  if (!(await validateImageReferences([parsed.data.imagePath ?? ""], previous?.imagePath ? [previous.imagePath] : []))) redirect("/admin/placements?error=image-unregistered"); const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try { const saved = await prisma.$transaction(async (tx) => { const data = { ...parsed.data, imagePath: parsed.data.imagePath ?? null, isPublished }; const record = kind === "programme" ? (updating ? await tx.trainingProgramme.update({ where: { id }, data }) : await tx.trainingProgramme.create({ data })) : (updating ? await tx.industryInteraction.update({ where: { id }, data }) : await tx.industryInteraction.create({ data })); await tx.adminAuditLog.create({ data: { actorId: admin.id, action: updating ? "update" : "create", entityType: kind === "programme" ? "TrainingProgramme" : "IndustryInteraction", entityId: String(record.id), details: { title: record.title, isPublished } } }); return record; }); if (previous?.imagePath && previous.imagePath !== saved.imagePath) await cleanupUnreferencedUploads([previous.imagePath]); } catch { redirect("/admin/placements?error=save"); }
  refresh(); redirect(`/admin/placements?saved=${kind}`);
}
export async function saveProgramme(formData: FormData): Promise<never> { return saveContent(formData, "programme"); }
export async function saveInteraction(formData: FormData): Promise<never> { return saveContent(formData, "interaction"); }
export async function deletePlacement(formData: FormData): Promise<never> { const admin = await requireAdministrator(); const kind = formData.get("kind"); const id = Number(formData.get("id")); if (!Number.isSafeInteger(id) || id <= 0 || !["company", "programme", "interaction"].includes(String(kind))) redirect("/admin/placements?error=invalid"); const prisma = getPrismaClient(); const record = kind === "company" ? await prisma.placementCompany.findUnique({ where: { id } }) : kind === "programme" ? await prisma.trainingProgramme.findUnique({ where: { id } }) : await prisma.industryInteraction.findUnique({ where: { id } }); if (!record) redirect("/admin/placements?error=missing"); await prisma.$transaction(async (tx) => { await tx.adminAuditLog.create({ data: { actorId: admin.id, action: "delete", entityType: String(kind), entityId: String(id), details: { title: "name" in record ? record.name : record.title } } }); if (kind === "company") await tx.placementCompany.delete({ where: { id } }); else if (kind === "programme") await tx.trainingProgramme.delete({ where: { id } }); else await tx.industryInteraction.delete({ where: { id } }); }); await cleanupUnreferencedUploads([("logoPath" in record ? record.logoPath : record.imagePath) ?? ""]); refresh(); redirect("/admin/placements?deleted=1"); }
