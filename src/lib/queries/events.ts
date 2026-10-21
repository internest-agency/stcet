import "server-only";

import { connection } from "next/server";

import type { Event } from "@/src/generated/prisma/client";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

/**
 * Every published event, in the manual order an admin set in the dashboard.
 * Returns an empty list when the database is unavailable so the public page
 * still renders (with its empty state) instead of failing.
 */
export async function getPublishedEvents(): Promise<Event[]> {
  if (!isDatabaseConfigured()) return [];

  await connection();

  try {
    return await getPrismaClient().event.findMany({
      where: { isPublished: true },
      orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
    });
  } catch (error) {
    console.error("Events query failed; using an empty list.", error);
    return [];
  }
}

/**
 * A single published event by slug, or null when it does not exist or is still
 * a draft. The public detail route treats null as a 404.
 */
export async function getPublishedEventBySlug(slug: string): Promise<Event | null> {
  if (!isDatabaseConfigured()) return null;

  await connection();

  try {
    return await getPrismaClient().event.findFirst({
      where: { slug, isPublished: true },
    });
  } catch (error) {
    console.error("Event query failed.", error);
    return null;
  }
}
