import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max);
const isWebUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};
const imagePath = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine(
    (value) =>
      (value.startsWith("/") && !value.startsWith("//")) || isWebUrl(value),
    "Enter a local image path or an HTTP(S) URL.",
  );
const optionalImagePath = imagePath.or(z.literal(""));

const optionalExperience = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.coerce.number().finite().min(0).max(80).optional(),
);

const optionalGroupId = z.preprocess(
  (value) =>
    typeof value === "string" && value.trim() === "" ? undefined : value,
  z.coerce
    .number()
    .int()
    .positive()
    .max(2_147_483_647)
    .optional(),
);

export const facultyEditorSchema = z.object({
  name: z.string().trim().min(2).max(191),
  designation: z.string().trim().min(1).max(191),
  department: optionalText(191),
  group: optionalText(191),
  groupId: optionalGroupId,
  auFin: optionalText(64),
  aicteId: optionalText(128),
  qualification: optionalText(255),
  specialization: optionalText(255),
  experience: optionalExperience,
  email: z
    .string()
    .trim()
    .max(191)
    .refine(
      (value) => !value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email address.",
    ),
  phone: optionalText(50),
  photo: optionalImagePath,
  bio: optionalText(5000),
  sortOrder: z.coerce.number().int().min(0).max(99_999),
  isPublished: z.boolean(),
});

export type FacultyEditorInput = z.infer<typeof facultyEditorSchema>;

export const FACULTY_BULK_MAX = 200;

export type FacultyBulkAction = "publish" | "unpublish" | "delete";

export const facultyBulkIdsSchema = z
  .array(z.number().int().positive().max(2_147_483_647))
  .min(1)
  .max(FACULTY_BULK_MAX);

export type FacultyBulkResult = {
  success: boolean;
  count?: number;
  ids?: number[];
  error?: string;
};
