import { z } from "zod";

export const admissionsIntroSchema = z.object({
  title: z.string().trim().min(3).max(191),
  subtitle: z.string().trim().max(255).optional().nullable(),
  description: z.string().trim().optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const admissionRouteSchema = z.object({
  number: z.string().trim().max(10).optional().nullable(),
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().optional().nullable(),
  imagePath: z.string().trim().max(2048).optional().nullable(),
  linkHref: z.string().trim().max(2048).optional().nullable(),
  linkText: z.string().trim().max(100).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

const tneaInstruction = z.string().trim().min(1).max(500);

export const tneaCounsellingSchema = z.object({
  stepNumber: z.coerce.number().int().min(1).max(9999),
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().max(5000).optional().nullable(),
  instructions: z.array(tneaInstruction).max(30).default([]),
  imagePath: z.string().trim().max(2048).optional().nullable(),
  imageLabel: z.string().trim().max(191).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export type TNEACounsellingInput = z.infer<typeof tneaCounsellingSchema>;

/**
 * State returned by the TNEA step server action. On failure the action returns
 * this object instead of redirecting, so the modal stays open and every entered
 * value (controlled by the form) is preserved. `fieldErrors` is keyed by
 * dot-joined Zod paths. Mirrors the course editor's form-state contract.
 */
export type TNEAStepFormState = {
  formError?: string;
  /** Machine-readable reason for a failed save; safe to surface to admins. */
  code?: string;
  fieldErrors: Record<string, string>;
};

export function collectFieldErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".");
    if (!key || key in fieldErrors) continue;
    fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export const managementQuotaSchema = z.object({
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().optional().nullable(),
  eligibility: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const admissionDocumentSchema = z.object({
  category: z.string().trim().max(100).optional().nullable(),
  title: z.string().trim().min(2).max(191),
  description: z.string().trim().optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const importantNoticeSchema = z.object({
  title: z.string().trim().min(2).max(191),
  content: z.string().trim().min(2),
  linkUrl: z.string().trim().max(2048).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const applicationLinkSchema = z.object({
  name: z.string().trim().min(2).max(191),
  url: z.string().trim().url().max(2048),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});

export const admissionContactSchema = z.object({
  title: z.string().trim().min(2).max(191),
  value: z.string().trim().min(2).max(255),
  contactType: z.string().trim().max(50).optional().nullable(),
  sortOrder: z.coerce.number().int().default(0),
  isPublished: z.boolean().default(true),
});
