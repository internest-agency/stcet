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
  websiteUrl: z.string().trim().url().max(2048).optional().nullable(),
  logoPath: text(2048),
  sortOrder: common.sortOrder,
  isActive: z.boolean().default(true),
  isPublished: common.isPublished,
});
export const programmeSchema = z.object(common);

export const leadershipSchema = z.object({
  eyebrow: text(191),
  heading: text(500),
  description: text(50_000),
  officerName: text(191),
  officerDesignation: text(191),
  officerImagePath: text(2048),
  officerImageAlt: text(255),
  isPublished: z.boolean().default(false),
});

export const leadershipItemSchema = z.object({
  title: z.string().trim().min(2).max(191),
  description: text(500),
  sortOrder: common.sortOrder,
  isPublished: common.isPublished,
});
