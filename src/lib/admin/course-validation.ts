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
    description: optionalText(10000),
    heroImage: optionalImagePath,
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
          description: z.string().trim().min(1).max(10000),
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
          description: z.string().trim().min(1).max(10000),
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
          description: z.string().trim().min(1).max(10000),
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
