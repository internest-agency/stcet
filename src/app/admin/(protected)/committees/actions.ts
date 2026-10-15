"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { isAdministrator, requireAdmin, requireAdministrator } from "@/src/lib/admin/authorization";
import { committeeMemberSchema, committeeSchema } from "@/src/lib/admin/committee-validation";
import { cleanupUnreferencedUploads, validateImageReferences } from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

const paths = [
  "/anti-ragging-committee",
  "/grievance-redressal-committee",
  "/internal-complaints-committee",
  "/sc-st-cell",
  "/iqac",
];

function refresh() {
  revalidatePath("/admin/committees");
  paths.forEach((path) => revalidatePath(path));
}

function duplicate(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

function committeeUrl(slug: string, query: string) {
  return `/admin/committees?committee=${encodeURIComponent(slug)}&${query}`;
}

export async function saveCommittee(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = committeeSchema.safeParse({
    slug: formData.get("slug"),
    name: formData.get("name"),
    pageTitle: formData.get("pageTitle"),
    introduction: formData.get("introduction") || null,
    heroImage: formData.get("heroImage") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) redirect("/admin/committees?error=invalid-committee");
  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.committee.findUnique({ where: { id } }) : null;
  if (updating && !previous) redirect("/admin/committees?error=missing");
  if (previous?.isPublished && !isAdministrator(admin)) redirect(committeeUrl(parsed.data.slug, "error=forbidden"));
  if (!(await validateImageReferences([parsed.data.heroImage ?? ""], previous?.heroImage ? [previous.heroImage] : [])))
    redirect(committeeUrl(parsed.data.slug, "error=image-unregistered"));
  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = { ...parsed.data, heroImage: parsed.data.heroImage ?? null, isPublished };
      const record = updating
        ? await tx.committee.update({ where: { id }, data })
        : await tx.committee.create({ data });
      if (updating && previous && (previous.slug !== record.slug || previous.name !== record.name)) {
        await tx.committeeMember.updateMany({
          where: { committeeSlug: previous.slug },
          data: { committeeSlug: record.slug, committeeName: record.name },
        });
      }
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "Committee",
          entityId: String(record.id),
          details: { name: record.name, slug: record.slug, isPublished },
        },
      });
      return record;
    });
    if (previous?.heroImage && previous.heroImage !== saved.heroImage) await cleanupUnreferencedUploads([previous.heroImage]);
  } catch (error) {
    if (duplicate(error)) redirect(committeeUrl(parsed.data.slug, "error=duplicate"));
    redirect(committeeUrl(parsed.data.slug, "error=save"));
  }
  refresh();
  redirect(committeeUrl(parsed.data.slug, "saved=committee"));
}

export async function saveCommitteeMember(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const parsed = committeeMemberSchema.safeParse({
    committeeSlug: formData.get("committeeSlug"),
    committeeName: formData.get("committeeName"),
    memberName: formData.get("memberName"),
    designation: formData.get("designation") || null,
    role: formData.get("role") || null,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) redirect("/admin/committees?error=invalid-member");
  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.committeeMember.findUnique({ where: { id } }) : null;
  if (updating && !previous) redirect(committeeUrl(parsed.data.committeeSlug, "error=missing"));
  if (previous?.isPublished && !isAdministrator(admin)) redirect(committeeUrl(parsed.data.committeeSlug, "error=forbidden"));
  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        designation: parsed.data.designation ?? null,
        role: parsed.data.role ?? null,
        isPublished,
      };
      const record = updating
        ? await tx.committeeMember.update({ where: { id }, data })
        : await tx.committeeMember.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "CommitteeMember",
          entityId: String(record.id),
          details: { name: record.memberName, committee: record.committeeSlug, isPublished },
        },
      });
    });
  } catch {
    redirect(committeeUrl(parsed.data.committeeSlug, "error=save"));
  }
  refresh();
  redirect(committeeUrl(parsed.data.committeeSlug, "saved=member"));
}

export async function moveCommitteeMember(formData: FormData): Promise<never> {
  const admin = await requireAdmin();
  const id = Number(formData.get("id"));
  const direction = formData.get("direction") === "up" ? "up" : "down";
  if (!Number.isSafeInteger(id) || id <= 0) redirect("/admin/committees?error=invalid");
  const prisma = getPrismaClient();
  const member = await prisma.committeeMember.findUnique({ where: { id } });
  if (!member) redirect("/admin/committees?error=missing");
  const slug = member.committeeSlug;
  try {
    await prisma.$transaction(async (tx) => {
      const siblings = await tx.committeeMember.findMany({
        where: { committeeSlug: slug },
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      });
      const index = siblings.findIndex((item) => item.id === id);
      const target = direction === "up" ? index - 1 : index + 1;
      if (index === -1 || target < 0 || target >= siblings.length) return;
      const ordered = [...siblings];
      const [moved] = ordered.splice(index, 1);
      ordered.splice(target, 0, moved);
      for (let position = 0; position < ordered.length; position += 1) {
        if (ordered[position].sortOrder !== position) {
          await tx.committeeMember.update({ where: { id: ordered[position].id }, data: { sortOrder: position } });
        }
      }
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: "CommitteeMember",
          entityId: String(id),
          details: { committee: slug, direction },
        },
      });
    });
  } catch {
    redirect(committeeUrl(slug, "error=save"));
  }
  refresh();
  redirect(committeeUrl(slug, "saved=reordered"));
}

export async function deleteCommitteeMember(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) redirect("/admin/committees?error=invalid");
  const prisma = getPrismaClient();
  const member = await prisma.committeeMember.findUnique({ where: { id } });
  if (!member) redirect("/admin/committees?error=missing");
  await prisma.$transaction(async (tx) => {
    await tx.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "CommitteeMember",
        entityId: String(id),
        details: { name: member.memberName, committee: member.committeeSlug },
      },
    });
    await tx.committeeMember.delete({ where: { id } });
  });
  refresh();
  redirect(committeeUrl(member.committeeSlug, "deleted=member"));
}

export async function deleteCommittee(formData: FormData): Promise<never> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) redirect("/admin/committees?error=invalid");
  const prisma = getPrismaClient();
  const committee = await prisma.committee.findUnique({ where: { id } });
  if (!committee) redirect("/admin/committees?error=missing");
  const memberCount = await prisma.committeeMember.count({ where: { committeeSlug: committee.slug } });
  if (memberCount) redirect(committeeUrl(committee.slug, "error=members-remain"));
  await prisma.$transaction(async (tx) => {
    await tx.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "delete",
        entityType: "Committee",
        entityId: String(id),
        details: { name: committee.name },
      },
    });
    await tx.committee.delete({ where: { id } });
  });
  await cleanupUnreferencedUploads([committee.heroImage ?? ""]);
  refresh();
  redirect("/admin/committees?deleted=committee");
}
