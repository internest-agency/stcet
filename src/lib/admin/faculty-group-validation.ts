import { z } from "zod";

export const facultyGroupSchema = z.object({
  name: z.string().trim().min(1).max(191),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
});

export type FacultyGroupInput = z.infer<typeof facultyGroupSchema>;

/**
 * Deterministic slug for a faculty group. Used only as a stable unique key
 * (the public page renders the display `name`). Callers must still resolve
 * collisions against the database before saving.
 */
export function facultyGroupSlug(name: string): string {
  const base = name
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "group";
}
