import { z } from "zod";

import { isValidDate, isValidTime } from "@/src/lib/events/datetime";

const text = (max: number) => z.string().trim().max(max).optional().nullable();

const dateValue = z
  .string()
  .trim()
  .refine(isValidDate, { message: "Enter a valid calendar date." });

const timeValue = z
  .string()
  .trim()
  .refine(isValidTime, { message: "Enter a valid time." });

function isHttpUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

const optionalUrl = z
  .string()
  .trim()
  .max(2048)
  .refine(isHttpUrl, { message: "Enter a valid http(s) link." })
  .optional()
  .nullable();

export const eventSchema = z.object({
  title: z.string().trim().min(3).max(191),
  shortDescription: text(500),
  description: text(50_000),
  category: text(120),
  imagePath: text(2048),
  imageAlt: text(255),
  startDate: dateValue,
  startTime: timeValue.optional().nullable(),
  endDate: dateValue.optional().nullable(),
  endTime: timeValue.optional().nullable(),
  isAllDay: z.boolean().default(false),
  venue: text(191),
  locationDetails: text(2_000),
  registrationUrl: optionalUrl,
  websiteUrl: optionalUrl,
  isFeatured: z.boolean().default(false),
  isPublished: z.boolean().default(false),
});

export type EventInput = z.infer<typeof eventSchema>;

/**
 * Ordering and time-window rules that depend on the whole record. Returns an
 * error message, or null when the schedule is valid. ISO date strings compare
 * chronologically, so plain string comparison is enough here.
 */
export function validateEventSchedule(input: EventInput): string | null {
  if (input.endDate && input.endDate < input.startDate) {
    return "The end date cannot be before the start date.";
  }
  if (
    !input.isAllDay &&
    input.endDate &&
    input.endDate === input.startDate &&
    input.startTime &&
    input.endTime &&
    input.endTime < input.startTime
  ) {
    return "The end time cannot be before the start time on the same day.";
  }
  return null;
}
