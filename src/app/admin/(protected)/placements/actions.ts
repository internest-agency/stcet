"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import {
  getCurrentAdmin,
  isAdministrator,
  requireAdministrator,
  type CurrentAdmin,
} from "@/src/lib/admin/authorization";
import {
  companySchema,
  leadershipItemSchema,
  leadershipSchema,
} from "@/src/lib/admin/placement-validation";
import { cleanupUnreferencedUploads, validateImageReferences } from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";

/**
 * Mirrors the About / institutional-pages result contract so the client keeps
 * the editing form open (with its values) when a save fails.
 */
export type PlacementResult =
  | { success: true; message: string }
  | { success: false; error: string };

const SESSION_EXPIRED =
  "Your session has expired. Sign in again to continue.";

function refresh() {
  revalidatePath("/admin/placements");
  revalidatePath("/placements");
}

function duplicate(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

/** Derive a URL-safe slug from a company name. */
function slugifyName(name: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 191)
    .replace(/-+$/g, "");
  return base || "company";
}

/** Generate a slug that does not collide with an existing company. */
async function uniqueCompanySlug(tx: Prisma.TransactionClient, name: string) {
  const base = slugifyName(name);
  let candidate = base;
  let suffix = 1;
  while (
    await tx.placementCompany.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`.slice(0, 191).replace(/-+$/g, "");
  }
  return candidate;
}

export async function saveCompany(formData: FormData): Promise<PlacementResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: SESSION_EXPIRED };

  const parsed = companySchema.safeParse({
    name: formData.get("name"),
    websiteUrl: formData.get("websiteUrl") || null,
    logoPath: formData.get("logoPath") || null,
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Enter a company name and check the fields, then try again.",
    };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.placementCompany.findUnique({ where: { id } })
    : null;
  if (updating && !previous) {
    return {
      success: false,
      error: "This company no longer exists. Refresh and try again.",
    };
  }
  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Published companies can only be edited by an administrator.",
    };
  }
  if (
    !(await validateImageReferences(
      [parsed.data.logoPath ?? ""],
      previous?.logoPath ? [previous.logoPath] : [],
    ))
  ) {
    return {
      success: false,
      error: "The selected logo could not be verified. Upload it again.",
    };
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const value = {
        ...parsed.data,
        logoPath: parsed.data.logoPath ?? null,
        websiteUrl: parsed.data.websiteUrl ?? null,
        isPublished,
      };
      const record = updating
        ? await tx.placementCompany.update({ where: { id }, data: value })
        : await tx.placementCompany.create({
            data: { ...value, slug: await uniqueCompanySlug(tx, parsed.data.name) },
          });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "PlacementCompany",
          entityId: String(record.id),
          details: {
            name: record.name,
            slug: record.slug,
            isPublished,
            isActive: record.isActive,
          },
        },
      });
      return record;
    });
    if (previous?.logoPath && previous.logoPath !== saved.logoPath) {
      await cleanupUnreferencedUploads([previous.logoPath]);
    }
  } catch (error) {
    if (duplicate(error)) {
      return {
        success: false,
        error: "A company with this name already exists. Adjust the name and try again.",
      };
    }
    console.error("Placement company save failed:", error);
    return {
      success: false,
      error: "The company could not be saved. Please try again.",
    };
  }

  refresh();
  return {
    success: true,
    message: updating ? "Company updated." : "Company added.",
  };
}

export async function deletePlacementCompany(
  formData: FormData,
): Promise<PlacementResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid company to delete." };
  }

  const prisma = getPrismaClient();
  const record = await prisma.placementCompany.findUnique({ where: { id } });
  if (!record) {
    return { success: false, error: "This company no longer exists." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "PlacementCompany",
          entityId: String(id),
          details: { name: record.name },
        },
      });
      await tx.placementCompany.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Placement company delete failed:", error);
    return {
      success: false,
      error: "The company could not be deleted. Please try again.",
    };
  }

  await cleanupUnreferencedUploads([record.logoPath ?? ""]);
  refresh();
  return { success: true, message: "Company removed." };
}

/**
 * Resolve the publish flag. Only administrators can change it; content editors
 * keep the existing state (or published for a new row) so saving never silently
 * unpublishes live content.
 */
function resolvePublished(
  admin: CurrentAdmin,
  requested: boolean,
  previous: { isPublished: boolean } | null,
) {
  if (isAdministrator(admin)) return requested;
  return previous ? previous.isPublished : true;
}

function sanitize(value: unknown): unknown {
  return typeof value === "string" ? sanitizeHtml(value) : value;
}

/**
 * Resolve the singleton Placement Leadership record that owns the items. Items
 * require a parent, so when a section does not exist yet (an item is added
 * before the section), a minimal draft section is created to own them.
 */
async function resolveLeadershipId(tx: Prisma.TransactionClient) {
  const existing = await tx.placementLeadership.findFirst({
    orderBy: { id: "asc" },
    select: { id: true },
  });
  if (existing) return existing.id;
  const created = await tx.placementLeadership.create({
    data: { isPublished: false },
    select: { id: true },
  });
  return created.id;
}

/** Create or update the singleton "Placement Leadership" section content. */
export async function saveLeadership(formData: FormData): Promise<PlacementResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: SESSION_EXPIRED };

  const parsed = leadershipSchema.safeParse({
    eyebrow: formData.get("eyebrow") || null,
    heading: sanitize(formData.get("heading") || null),
    description: sanitize(formData.get("description") || null),
    officerName: formData.get("officerName") || null,
    officerDesignation: formData.get("officerDesignation") || null,
    officerImagePath: formData.get("officerImagePath") || null,
    officerImageAlt: formData.get("officerImageAlt") || null,
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the leadership fields, then try again.",
    };
  }

  const prisma = getPrismaClient();
  const previous = await prisma.placementLeadership.findFirst({
    orderBy: { id: "asc" },
  });
  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Published leadership content can only be edited by an administrator.",
    };
  }
  if (
    !(await validateImageReferences(
      [parsed.data.officerImagePath ?? ""],
      previous?.officerImagePath ? [previous.officerImagePath] : [],
    ))
  ) {
    return {
      success: false,
      error: "The selected photo could not be verified. Upload it again.",
    };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        eyebrow: parsed.data.eyebrow ?? null,
        heading: parsed.data.heading ?? null,
        description: parsed.data.description ?? null,
        officerName: parsed.data.officerName ?? null,
        officerDesignation: parsed.data.officerDesignation ?? null,
        officerImagePath: parsed.data.officerImagePath ?? null,
        officerImageAlt: parsed.data.officerImageAlt ?? null,
        isPublished,
      };
      const record = previous
        ? await tx.placementLeadership.update({ where: { id: previous.id }, data })
        : await tx.placementLeadership.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: previous ? "update" : "create",
          entityType: "PlacementLeadership",
          entityId: String(record.id),
          details: { officerName: record.officerName, isPublished },
        },
      });
      return record;
    });
    if (
      previous?.officerImagePath &&
      previous.officerImagePath !== saved.officerImagePath
    ) {
      await cleanupUnreferencedUploads([previous.officerImagePath]);
    }
  } catch (error) {
    console.error("Placement leadership save failed:", error);
    return {
      success: false,
      error: "The leadership content could not be saved. Please try again.",
    };
  }

  refresh();
  return { success: true, message: "Placement leadership saved." };
}

/** Create or update a single qualification / experience item. */
export async function saveLeadershipItem(formData: FormData): Promise<PlacementResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: SESSION_EXPIRED };

  const parsed = leadershipItemSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Enter an item title and check the fields, then try again.",
    };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.placementLeadershipItem.findUnique({ where: { id } })
    : null;
  if (updating && !previous) {
    return {
      success: false,
      error: "This item no longer exists. Refresh and try again.",
    };
  }
  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Published items can only be edited by an administrator.",
    };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        description: parsed.data.description ?? null,
        isPublished,
        // Attach to the existing parent when editing; otherwise resolve (or
        // create) the singleton section that owns this new item.
        leadershipId: previous ? previous.leadershipId : await resolveLeadershipId(tx),
      };
      const record = updating
        ? await tx.placementLeadershipItem.update({ where: { id }, data })
        : await tx.placementLeadershipItem.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "PlacementLeadershipItem",
          entityId: String(record.id),
          details: { title: record.title, isPublished },
        },
      });
    });
  } catch (error) {
    console.error("Placement leadership item save failed:", error);
    return {
      success: false,
      error: "The item could not be saved. Please try again.",
    };
  }

  refresh();
  return {
    success: true,
    message: updating ? "Item updated." : "Item added.",
  };
}

/** Delete a qualification / experience item (administrators only). */
export async function deleteLeadershipItem(formData: FormData): Promise<PlacementResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid item to delete." };
  }

  const prisma = getPrismaClient();
  const item = await prisma.placementLeadershipItem.findUnique({ where: { id } });
  if (!item) {
    return { success: false, error: "This item no longer exists." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "PlacementLeadershipItem",
          entityId: String(id),
          details: { title: item.title },
        },
      });
      await tx.placementLeadershipItem.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Placement leadership item delete failed:", error);
    return {
      success: false,
      error: "The item could not be deleted. Please try again.",
    };
  }

  refresh();
  return { success: true, message: "Item removed." };
}
