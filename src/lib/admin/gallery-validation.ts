import { z } from "zod";

export const galleryCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(96)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  sortOrder: z.coerce.number().int().min(0).max(9999),
  isActive: z.boolean(),
});

export const galleryImageSchema = z.object({
  title: z.string().trim().min(1).max(191),
  altText: z.string().trim().min(1).max(255),
  categoryId: z.coerce.number().int().positive(),
  imagePath: z.string().trim().min(1).max(2048),
  sortOrder: z.coerce.number().int().min(0).max(99999),
  isPublished: z.boolean(),
});

export type GalleryCategoryInput = z.infer<typeof galleryCategorySchema>;
export type GalleryImageInput = z.infer<typeof galleryImageSchema>;
