import { z } from "zod";
import { DEFAULT_SECTION_LAYOUT, SECTION_LAYOUT_IDS } from "@/src/lib/content/section-layouts";
const slug = z.string().trim().min(2).max(191).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const institutionalPageSchema = z.object({ title: z.string().trim().min(2).max(191), slug, introduction: z.string().trim().max(20_000).optional().nullable(), seoTitle: z.string().trim().max(191).optional().nullable(), metaDescription: z.string().trim().max(320).optional().nullable(), sortOrder: z.coerce.number().int().min(0).max(99_999).default(0), isPublished: z.boolean().default(false) });
export const pageSectionSchema = z.object({ pageId: z.coerce.number().int().positive(), title: z.string().trim().min(2).max(191), content: z.string().trim().max(50_000).optional().nullable(), imagePath: z.string().trim().max(2048).optional().nullable(), layout: z.enum(SECTION_LAYOUT_IDS).catch(DEFAULT_SECTION_LAYOUT), sortOrder: z.coerce.number().int().min(0).max(99_999).default(0) });
