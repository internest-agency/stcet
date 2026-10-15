import { z } from "zod";
import { infrastructureFacilityCategoryValues } from "./infrastructure-categories";

export const infrastructureFacilityLayouts = [
  "image-left",
  "image-right",
  "image-top",
  "full-width",
  "image-banner",
  "highlight",
  "two-columns",
  "overlay-card",
  "student-facility-grid",
] as const;

export const infrastructureFacilitySchema = z.object({
  category: z.enum(infrastructureFacilityCategoryValues),
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().max(20000).optional().nullable(),
  imagePath: z.string().trim().max(2048).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(99999).default(0),
  isActive: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  layout: z.enum(infrastructureFacilityLayouts).optional().nullable().default("image-top"),
});

export type InfrastructureFacilityInput = z.infer<typeof infrastructureFacilitySchema>;