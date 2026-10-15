import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max);
// Rich-text fields carry HTML markup, so they allow a larger budget than the
// plain-text fields they sit next to while still staying within `@db.Text`.
const optionalHtml = (max = 50000) => z.string().trim().max(max);
const requiredHtml = (max = 50000) => z.string().trim().min(1).max(max);
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
const orderedNumber = z.coerce.number().int().min(1).max(9999);

export const courseEditorSchema = z
  .object({
    name: z.string().trim().min(2).max(191),
    slug: z
      .string()
      .trim()
      .min(2)
      .max(191)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    degree: z.string().trim().min(2).max(80),
    tagline: optionalText(255),
    description: optionalHtml(),
    heroImage: optionalImagePath,
    overviewHeading: optionalText(255),
    overviewKeyStatement: optionalHtml(4000),
    curriculumTitle: optionalText(255),
    curriculumIntro: optionalHtml(),
    opportunityTitle: optionalText(255),
    whyStudyLabel: optionalText(191),
    whyStudyHeading: optionalText(255),
    whyStudyIntro: optionalHtml(),
    careerTitle: optionalText(255),
    careerIntro: optionalHtml(),
    seoTitle: optionalText(191),
    metaDescription: optionalText(320),
    canonicalUrl: z
      .string()
      .trim()
      .max(2048)
      .refine(
        (value) => !value || isWebUrl(value),
        "Enter a valid HTTP(S) URL.",
      ),
    ogImage: optionalImagePath,
    noIndex: z.boolean(),
    isPublished: z.boolean(),
    modules: z
      .array(
        z.object({
          number: orderedNumber,
          title: z.string().trim().min(1).max(191),
          description: requiredHtml(),
          image: imagePath,
        }),
      )
      .max(100),
    opportunities: z
      .array(z.object({ title: z.string().trim().min(1).max(191) }))
      .max(100),
    reasons: z
      .array(
        z.object({
          number: orderedNumber,
          title: z.string().trim().min(1).max(191),
          description: requiredHtml(),
        }),
      )
      .max(100),
    careerPathways: z
      .array(
        z.object({
          number: orderedNumber,
          title: z.string().trim().min(1).max(191),
          image: imagePath,
          roles: z.array(z.string().trim().min(1).max(191)).max(100),
        }),
      )
      .max(100),
    futurePaths: z
      .array(
        z.object({
          number: orderedNumber,
          title: z.string().trim().min(1).max(191),
          description: requiredHtml(),
        }),
      )
      .max(100),
  })
  .superRefine((course, context) => {
    const collections = [
      ["modules", course.modules],
      ["reasons", course.reasons],
      ["careerPathways", course.careerPathways],
      ["futurePaths", course.futurePaths],
    ] as const;

    for (const [collectionName, items] of collections) {
      const seen = new Set<number>();
      items.forEach((item, index) => {
        if (seen.has(item.number)) {
          context.addIssue({
            code: "custom",
            path: [collectionName, index, "number"],
            message: "Numbers must be unique within a section.",
          });
        }
        seen.add(item.number);
      });
    }
  });

export type CourseEditorInput = z.infer<typeof courseEditorSchema>;

/**
 * State returned by the course server actions. On failure the action returns
 * this object instead of redirecting, so the client form stays mounted and all
 * entered values are preserved. `fieldErrors` is keyed by dot-joined Zod paths
 * (e.g. `name`, `slug`, `modules.2.title`) so the editor can map each message
 * next to the field that produced it.
 */
export type CourseFormState = {
  formError?: string;
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
