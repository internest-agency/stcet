import { z } from "zod";

const text = (max: number) => z.string().trim().max(max).optional().nullable();
const common = {
  title: z.string().trim().min(2).max(191),
  description: text(20_000),
  imagePath: text(2048),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(false),
};

export const companySchema = z.object({
  name: z.string().trim().min(2).max(191),
  slug: z.string().trim().min(2).max(191).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  websiteUrl: z.string().trim().url().max(2048).optional().nullable(),
  logoPath: text(2048),
  sortOrder: common.sortOrder,
  isActive: z.boolean().default(true),
  isPublished: common.isPublished,
});
export const programmeSchema = z.object(common);
