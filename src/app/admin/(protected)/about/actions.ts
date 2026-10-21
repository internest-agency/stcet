"use server";

import { revalidatePath } from "next/cache";
import {
  getCurrentAdmin,
  isAdministrator,
  requireAdministrator,
  type CurrentAdmin,
} from "@/src/lib/admin/authorization";
import {
  aboutChairmanMessageSchema,
  aboutFounderSchema,
  aboutMissionItemSchema,
  aboutTrustPillarSchema,
  aboutTrustSchema,
  aboutVisionMissionSchema,
} from "@/src/lib/admin/about-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";

/** Mirrors the institutional-pages result contract so the client can keep the form open on failure. */
export type SaveResult =
  | { success: true; message: string }
  | { success: false; error: string };

function refresh() {
  revalidatePath("/admin/about");
  revalidatePath("/about");
}

function sanitize(value: unknown): unknown {
  return typeof value === "string" ? sanitizeHtml(value) : value;
}

/**
 * Resolve the publish flag. Only administrators can change it; content editors
 * keep the existing state (or published for new rows) so saving never silently
 * unpublishes live content.
 */
function resolvePublished(
  admin: CurrentAdmin,
  requested: boolean,
  previous: { isPublished: boolean } | null,
) {
  if (isAdministrator(admin)) {
    return requested;
  }
  return previous ? previous.isPublished : true;
}

export async function saveAboutFounder(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutFounderSchema.safeParse({
    name: formData.get("name"),
    designation: formData.get("designation") || null,
    roleLabel: formData.get("roleLabel") || null,
    imagePath: formData.get("imagePath") || null,
    biography: sanitize(formData.get("biography") || null),
    quote: sanitize(formData.get("quote") || null),
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Enter a name and check the fields, then try again." };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.aboutFounder.findUnique({ where: { id } }) : null;
  if (updating && !previous) {
    return { success: false, error: "This founder no longer exists. Refresh and try again." };
  }

  if (
    !(await validateImageReferences(
      [parsed.data.imagePath ?? ""],
      previous?.imagePath ? [previous.imagePath] : [],
    ))
  ) {
    return { success: false, error: "The selected portrait could not be verified. Upload it again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        designation: parsed.data.designation ?? null,
        roleLabel: parsed.data.roleLabel ?? null,
        imagePath: parsed.data.imagePath ?? null,
        biography: parsed.data.biography ?? null,
        quote: parsed.data.quote ?? null,
        isPublished,
      };
      const founder = updating
        ? await tx.aboutFounder.update({ where: { id }, data })
        : await tx.aboutFounder.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "AboutFounder",
          entityId: String(founder.id),
          details: { name: founder.name, isPublished },
        },
      });
      return founder;
    });
    if (previous?.imagePath && previous.imagePath !== saved.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    console.error("About founder save failed:", error);
    return { success: false, error: "The founder could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: updating ? "Founder updated." : "Founder added." };
}

export async function deleteAboutFounder(formData: FormData): Promise<SaveResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid founder to delete." };
  }

  const prisma = getPrismaClient();
  const founder = await prisma.aboutFounder.findUnique({ where: { id } });
  if (!founder) return { success: false, error: "This founder no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: { actorId: admin.id, action: "delete", entityType: "AboutFounder", entityId: String(id), details: { name: founder.name } },
      });
      await tx.aboutFounder.delete({ where: { id } });
    });
  } catch (error) {
    console.error("About founder delete failed:", error);
    return { success: false, error: "The founder could not be deleted. Please try again." };
  }

  await cleanupUnreferencedUploads([founder.imagePath ?? ""]);
  refresh();
  return { success: true, message: "Founder removed." };
}

export async function saveAboutChairman(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutChairmanMessageSchema.safeParse({
    eyebrow: formData.get("eyebrow") || null,
    heading: sanitize(formData.get("heading") || null),
    quote: sanitize(formData.get("quote") || null),
    body: sanitize(formData.get("body") || null),
    closingStatement: sanitize(formData.get("closingStatement") || null),
    name: formData.get("name") || null,
    designation: formData.get("designation") || null,
    imagePath: formData.get("imagePath") || null,
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Check the fields and try again." };
  }

  const prisma = getPrismaClient();
  const previous = await prisma.aboutChairmanMessage.findFirst({ orderBy: { id: "asc" } });

  if (
    !(await validateImageReferences(
      [parsed.data.imagePath ?? ""],
      previous?.imagePath ? [previous.imagePath] : [],
    ))
  ) {
    return { success: false, error: "The selected portrait could not be verified. Upload it again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        eyebrow: parsed.data.eyebrow ?? null,
        heading: parsed.data.heading ?? null,
        quote: parsed.data.quote ?? null,
        body: parsed.data.body ?? null,
        closingStatement: parsed.data.closingStatement ?? null,
        name: parsed.data.name ?? null,
        designation: parsed.data.designation ?? null,
        imagePath: parsed.data.imagePath ?? null,
        isPublished,
      };
      const record = previous
        ? await tx.aboutChairmanMessage.update({ where: { id: previous.id }, data })
        : await tx.aboutChairmanMessage.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: previous ? "update" : "create",
          entityType: "AboutChairmanMessage",
          entityId: String(record.id),
          details: { isPublished },
        },
      });
      return record;
    });
    if (previous?.imagePath && previous.imagePath !== saved.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    console.error("About chairman message save failed:", error);
    return { success: false, error: "The chairman's message could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: "Chairman's message saved." };
}

export async function saveAboutVisionMission(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutVisionMissionSchema.safeParse({
    visionEyebrow: formData.get("visionEyebrow") || null,
    visionHeading: sanitize(formData.get("visionHeading") || null),
    visionStatement: sanitize(formData.get("visionStatement") || null),
    visionTags: formData.get("visionTags") || null,
    visionImagePath: formData.get("visionImagePath") || null,
    visionCaptionTitle: formData.get("visionCaptionTitle") || null,
    visionCaptionSubtitle: formData.get("visionCaptionSubtitle") || null,
    missionHeading: sanitize(formData.get("missionHeading") || null),
    missionIntro: sanitize(formData.get("missionIntro") || null),
    missionTags: formData.get("missionTags") || null,
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Check the fields and try again." };
  }

  const prisma = getPrismaClient();
  const previous = await prisma.aboutVisionMission.findFirst({ orderBy: { id: "asc" } });

  if (
    !(await validateImageReferences(
      [parsed.data.visionImagePath ?? ""],
      previous?.visionImagePath ? [previous.visionImagePath] : [],
    ))
  ) {
    return { success: false, error: "The selected campus image could not be verified. Upload it again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    const saved = await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        visionEyebrow: parsed.data.visionEyebrow ?? null,
        visionHeading: parsed.data.visionHeading ?? null,
        visionStatement: parsed.data.visionStatement ?? null,
        visionTags: parsed.data.visionTags ?? null,
        visionImagePath: parsed.data.visionImagePath ?? null,
        visionCaptionTitle: parsed.data.visionCaptionTitle ?? null,
        visionCaptionSubtitle: parsed.data.visionCaptionSubtitle ?? null,
        missionHeading: parsed.data.missionHeading ?? null,
        missionIntro: parsed.data.missionIntro ?? null,
        missionTags: parsed.data.missionTags ?? null,
        isPublished,
      };
      const record = previous
        ? await tx.aboutVisionMission.update({ where: { id: previous.id }, data })
        : await tx.aboutVisionMission.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: previous ? "update" : "create",
          entityType: "AboutVisionMission",
          entityId: String(record.id),
          details: { isPublished },
        },
      });
      return record;
    });
    if (previous?.visionImagePath && previous.visionImagePath !== saved.visionImagePath) {
      await cleanupUnreferencedUploads([previous.visionImagePath]);
    }
  } catch (error) {
    console.error("About vision & mission save failed:", error);
    return { success: false, error: "The vision & mission content could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: "Vision & mission saved." };
}

export async function saveAboutMissionItem(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutMissionItemSchema.safeParse({
    title: formData.get("title"),
    description: sanitize(formData.get("description") || null),
    icon: formData.get("icon") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Enter a title and check the fields, then try again." };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.aboutMissionItem.findUnique({ where: { id } }) : null;
  if (updating && !previous) {
    return { success: false, error: "This mission item no longer exists. Refresh and try again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        description: parsed.data.description ?? null,
        icon: parsed.data.icon ?? null,
        isPublished,
      };
      const record = updating
        ? await tx.aboutMissionItem.update({ where: { id }, data })
        : await tx.aboutMissionItem.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "AboutMissionItem",
          entityId: String(record.id),
          details: { title: record.title, isPublished },
        },
      });
    });
  } catch (error) {
    console.error("About mission item save failed:", error);
    return { success: false, error: "The mission item could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: updating ? "Mission item updated." : "Mission item added." };
}

export async function deleteAboutMissionItem(formData: FormData): Promise<SaveResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid mission item to delete." };
  }

  const prisma = getPrismaClient();
  const item = await prisma.aboutMissionItem.findUnique({ where: { id } });
  if (!item) return { success: false, error: "This mission item no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: { actorId: admin.id, action: "delete", entityType: "AboutMissionItem", entityId: String(id), details: { title: item.title } },
      });
      await tx.aboutMissionItem.delete({ where: { id } });
    });
  } catch (error) {
    console.error("About mission item delete failed:", error);
    return { success: false, error: "The mission item could not be deleted. Please try again." };
  }

  refresh();
  return { success: true, message: "Mission item removed." };
}

export async function saveAboutTrust(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutTrustSchema.safeParse({
    eyebrow: formData.get("eyebrow") || null,
    heading: sanitize(formData.get("heading") || null),
    intro: sanitize(formData.get("intro") || null),
    closingEyebrow: formData.get("closingEyebrow") || null,
    closingLabel: formData.get("closingLabel") || null,
    closingStatement: sanitize(formData.get("closingStatement") || null),
    closingFooter: formData.get("closingFooter") || null,
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Check the fields and try again." };
  }

  const prisma = getPrismaClient();
  const previous = await prisma.aboutTrust.findFirst({ orderBy: { id: "asc" } });
  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        eyebrow: parsed.data.eyebrow ?? null,
        heading: parsed.data.heading ?? null,
        intro: parsed.data.intro ?? null,
        closingEyebrow: parsed.data.closingEyebrow ?? null,
        closingLabel: parsed.data.closingLabel ?? null,
        closingStatement: parsed.data.closingStatement ?? null,
        closingFooter: parsed.data.closingFooter ?? null,
        isPublished,
      };
      const record = previous
        ? await tx.aboutTrust.update({ where: { id: previous.id }, data })
        : await tx.aboutTrust.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: previous ? "update" : "create",
          entityType: "AboutTrust",
          entityId: String(record.id),
          details: { isPublished },
        },
      });
    });
  } catch (error) {
    console.error("About trust save failed:", error);
    return { success: false, error: "The trust content could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: "Trust content saved." };
}

export async function saveAboutTrustPillar(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const parsed = aboutTrustPillarSchema.safeParse({
    title: formData.get("title"),
    description: sanitize(formData.get("description") || null),
    tag: formData.get("tag") || null,
    icon: formData.get("icon") || null,
    sortOrder: formData.get("sortOrder"),
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return { success: false, error: "Enter a title and check the fields, then try again." };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating ? await prisma.aboutTrustPillar.findUnique({ where: { id } }) : null;
  if (updating && !previous) {
    return { success: false, error: "This pillar no longer exists. Refresh and try again." };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);

  try {
    await prisma.$transaction(async (tx) => {
      const data = {
        ...parsed.data,
        description: parsed.data.description ?? null,
        tag: parsed.data.tag ?? null,
        icon: parsed.data.icon ?? null,
        isPublished,
      };
      const record = updating
        ? await tx.aboutTrustPillar.update({ where: { id }, data })
        : await tx.aboutTrustPillar.create({ data });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "AboutTrustPillar",
          entityId: String(record.id),
          details: { title: record.title, isPublished },
        },
      });
    });
  } catch (error) {
    console.error("About trust pillar save failed:", error);
    return { success: false, error: "The pillar could not be saved. Please try again." };
  }

  refresh();
  return { success: true, message: updating ? "Pillar updated." : "Pillar added." };
}

export async function deleteAboutTrustPillar(formData: FormData): Promise<SaveResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid pillar to delete." };
  }

  const prisma = getPrismaClient();
  const pillar = await prisma.aboutTrustPillar.findUnique({ where: { id } });
  if (!pillar) return { success: false, error: "This pillar no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: { actorId: admin.id, action: "delete", entityType: "AboutTrustPillar", entityId: String(id), details: { title: pillar.title } },
      });
      await tx.aboutTrustPillar.delete({ where: { id } });
    });
  } catch (error) {
    console.error("About trust pillar delete failed:", error);
    return { success: false, error: "The pillar could not be deleted. Please try again." };
  }

  refresh();
  return { success: true, message: "Pillar removed." };
}

const MOVE_ENTITIES = {
  founder: "AboutFounder",
  "mission-item": "AboutMissionItem",
  "trust-pillar": "AboutTrustPillar",
} as const;

type MoveEntity = keyof typeof MOVE_ENTITIES;

/** Return a new ordering with `id` shifted one step, or null when it cannot move. */
function reorder<T extends { id: number; sortOrder: number }>(
  items: T[],
  id: number,
  direction: "up" | "down",
): T[] | null {
  const index = items.findIndex((item) => item.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || target < 0 || target >= items.length) return null;
  const ordered = [...items];
  const [moved] = ordered.splice(index, 1);
  ordered.splice(target, 0, moved);
  return ordered;
}

/**
 * Move a founder, mission item or trust pillar one position up or down and
 * rewrite the sibling order contiguously (mirrors the committee reorder logic).
 */
export async function moveAboutContent(formData: FormData): Promise<SaveResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, error: "Your session has expired. Sign in again to continue." };
  }

  const entity = String(formData.get("entity") ?? "") as MoveEntity;
  if (!(entity in MOVE_ENTITIES)) {
    return { success: false, error: "Unknown item to reorder." };
  }
  const direction = formData.get("direction") === "up" ? "up" : "down";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid item to reorder." };
  }

  const prisma = getPrismaClient();

  try {
    await prisma.$transaction(async (tx) => {
      if (entity === "founder") {
        const ordered = reorder(
          await tx.aboutFounder.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
          id,
          direction,
        );
        if (ordered) {
          for (let position = 0; position < ordered.length; position += 1) {
            if (ordered[position].sortOrder !== position) {
              await tx.aboutFounder.update({ where: { id: ordered[position].id }, data: { sortOrder: position } });
            }
          }
        }
      } else if (entity === "mission-item") {
        const ordered = reorder(
          await tx.aboutMissionItem.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
          id,
          direction,
        );
        if (ordered) {
          for (let position = 0; position < ordered.length; position += 1) {
            if (ordered[position].sortOrder !== position) {
              await tx.aboutMissionItem.update({ where: { id: ordered[position].id }, data: { sortOrder: position } });
            }
          }
        }
      } else {
        const ordered = reorder(
          await tx.aboutTrustPillar.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
          id,
          direction,
        );
        if (ordered) {
          for (let position = 0; position < ordered.length; position += 1) {
            if (ordered[position].sortOrder !== position) {
              await tx.aboutTrustPillar.update({ where: { id: ordered[position].id }, data: { sortOrder: position } });
            }
          }
        }
      }

      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: MOVE_ENTITIES[entity],
          entityId: String(id),
          details: { direction },
        },
      });
    });
  } catch (error) {
    console.error("About reorder failed:", error);
    return { success: false, error: "The item could not be reordered. Please try again." };
  }

  refresh();
  return { success: true, message: "Order updated." };
}
