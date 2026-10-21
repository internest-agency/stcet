"use server";

import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";

import {
  getCurrentAdmin,
  isAdministrator,
  requireAdministrator,
  type CurrentAdmin,
} from "@/src/lib/admin/authorization";
import { eventSchema, validateEventSchedule } from "@/src/lib/admin/event-validation";
import {
  cleanupUnreferencedUploads,
  validateImageReferences,
} from "@/src/lib/admin/uploads";
import { sanitizeHtml } from "@/src/lib/content/html";
import { getPrismaClient } from "@/src/lib/prisma";

/** Mirrors the About / placements contract so the client keeps the form open on failure. */
export type EventResult =
  | { success: true; message: string }
  | { success: false; error: string };

const SESSION_EXPIRED = "Your session has expired. Sign in again to continue.";

function refresh(slug?: string | null) {
  revalidatePath("/admin/events");
  revalidatePath("/events");
  if (slug) revalidatePath(`/events/${slug}`);
}

function duplicate(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function sanitize(value: unknown): unknown {
  return typeof value === "string" ? sanitizeHtml(value) : value;
}

/** Derive a URL-safe slug from an event title. */
function slugifyTitle(title: string) {
  const base = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 191)
    .replace(/-+$/g, "");
  return base || "event";
}

/** Generate a slug that does not collide with an existing event. */
async function uniqueEventSlug(tx: Prisma.TransactionClient, title: string) {
  const base = slugifyTitle(title);
  let candidate = base;
  let suffix = 1;
  while (
    await tx.event.findUnique({ where: { slug: candidate }, select: { id: true } })
  ) {
    suffix += 1;
    candidate = `${base}-${suffix}`.slice(0, 191).replace(/-+$/g, "");
  }
  return candidate;
}

/** Place a newly created event at the end of the manual order. */
async function nextSortOrder(tx: Prisma.TransactionClient) {
  const last = await tx.event.findFirst({
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });
  return (last?.sortOrder ?? -1) + 1;
}

/**
 * Resolve the publish flag. Only administrators can change it; content editors
 * keep the existing state (or draft for a new row) so saving never silently
 * publishes or unpublishes live content.
 */
function resolvePublished(
  admin: CurrentAdmin,
  requested: boolean,
  previous: { isPublished: boolean } | null,
) {
  if (isAdministrator(admin)) return requested;
  return previous ? previous.isPublished : false;
}

export async function saveEvent(formData: FormData): Promise<EventResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: SESSION_EXPIRED };

  const isAllDay = formData.get("isAllDay") === "on";

  const parsed = eventSchema.safeParse({
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription") || null,
    description: sanitize(formData.get("description") || null),
    category: formData.get("category") || null,
    imagePath: formData.get("imagePath") || null,
    imageAlt: formData.get("imageAlt") || null,
    startDate: formData.get("startDate"),
    startTime: isAllDay ? null : formData.get("startTime") || null,
    endDate: formData.get("endDate") || null,
    endTime: isAllDay ? null : formData.get("endTime") || null,
    isAllDay,
    venue: formData.get("venue") || null,
    locationDetails: formData.get("locationDetails") || null,
    registrationUrl: formData.get("registrationUrl") || null,
    websiteUrl: formData.get("websiteUrl") || null,
    isFeatured: formData.get("isFeatured") === "on",
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Enter a title, a start date and valid links, then try again.",
    };
  }

  const scheduleError = validateEventSchedule(parsed.data);
  if (scheduleError) {
    return { success: false, error: scheduleError };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.event.findUnique({ where: { id } })
    : null;
  if (updating && !previous) {
    return {
      success: false,
      error: "This event no longer exists. Refresh and try again.",
    };
  }
  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Published events can only be edited by an administrator.",
    };
  }
  if (
    !(await validateImageReferences(
      [parsed.data.imagePath ?? ""],
      previous?.imagePath ? [previous.imagePath] : [],
    ))
  ) {
    return {
      success: false,
      error: "The selected image could not be verified. Upload it again.",
    };
  }

  const isPublished = resolvePublished(admin, parsed.data.isPublished, previous);
  let savedSlug: string | null = previous?.slug ?? null;

  try {
    await prisma.$transaction(async (tx) => {
      const values = {
        title: parsed.data.title,
        shortDescription: parsed.data.shortDescription ?? null,
        description: parsed.data.description ?? null,
        category: parsed.data.category ?? null,
        imagePath: parsed.data.imagePath ?? null,
        imageAlt: parsed.data.imageAlt ?? null,
        startDate: parsed.data.startDate,
        startTime: parsed.data.startTime ?? null,
        endDate: parsed.data.endDate ?? null,
        endTime: parsed.data.endTime ?? null,
        isAllDay: parsed.data.isAllDay,
        venue: parsed.data.venue ?? null,
        locationDetails: parsed.data.locationDetails ?? null,
        registrationUrl: parsed.data.registrationUrl ?? null,
        websiteUrl: parsed.data.websiteUrl ?? null,
        isFeatured: parsed.data.isFeatured,
        isPublished,
      };
      const record = updating
        ? await tx.event.update({ where: { id }, data: values })
        : await tx.event.create({
            data: {
              ...values,
              slug: await uniqueEventSlug(tx, parsed.data.title),
              sortOrder: await nextSortOrder(tx),
            },
          });
      savedSlug = record.slug;
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "Event",
          entityId: String(record.id),
          details: {
            title: record.title,
            slug: record.slug,
            isPublished,
            isFeatured: record.isFeatured,
          },
        },
      });
    });
    if (previous?.imagePath && previous.imagePath !== parsed.data.imagePath) {
      await cleanupUnreferencedUploads([previous.imagePath]);
    }
  } catch (error) {
    if (duplicate(error)) {
      return {
        success: false,
        error: "An event with a conflicting URL already exists. Try a different title.",
      };
    }
    console.error("Event save failed:", error);
    return {
      success: false,
      error: "The event could not be saved. Please try again.",
    };
  }

  refresh(savedSlug);
  return {
    success: true,
    message: updating ? "Event updated." : "Event created.",
  };
}

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

/** Move an event one position up or down and rewrite the order contiguously. */
export async function moveEvent(formData: FormData): Promise<EventResult> {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, error: SESSION_EXPIRED };

  const direction = formData.get("direction") === "up" ? "up" : "down";
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid event to reorder." };
  }

  const prisma = getPrismaClient();

  try {
    await prisma.$transaction(async (tx) => {
      const ordered = reorder(
        await tx.event.findMany({ orderBy: [{ sortOrder: "asc" }, { id: "asc" }] }),
        id,
        direction,
      );
      if (ordered) {
        for (let position = 0; position < ordered.length; position += 1) {
          if (ordered[position].sortOrder !== position) {
            await tx.event.update({
              where: { id: ordered[position].id },
              data: { sortOrder: position },
            });
          }
        }
      }
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "reorder",
          entityType: "Event",
          entityId: String(id),
          details: { direction },
        },
      });
    });
  } catch (error) {
    console.error("Event reorder failed:", error);
    return { success: false, error: "The event could not be reordered. Please try again." };
  }

  refresh();
  return { success: true, message: "Order updated." };
}

export async function deleteEvent(formData: FormData): Promise<EventResult> {
  const admin = await requireAdministrator();
  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid event to delete." };
  }

  const prisma = getPrismaClient();
  const event = await prisma.event.findUnique({ where: { id } });
  if (!event) return { success: false, error: "This event no longer exists." };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "Event",
          entityId: String(id),
          details: { title: event.title, slug: event.slug },
        },
      });
      await tx.event.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Event delete failed:", error);
    return { success: false, error: "The event could not be deleted. Please try again." };
  }

  await cleanupUnreferencedUploads([event.imagePath ?? ""]);
  refresh(event.slug);
  return { success: true, message: "Event removed." };
}
