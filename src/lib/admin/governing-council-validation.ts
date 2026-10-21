import { z } from "zod";

const optionalText = (max: number) => z.string().trim().max(max).optional().nullable();

export const governingCouncilMemberSchema = z.object({
  name: z.string().trim().min(1).max(191),
  role: z.string().trim().min(1).max(191),
  imagePath: z.string().trim().max(2048).optional().nullable(),
  imageAlt: optionalText(255),
  biography: optionalText(5000),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(true),
});

export type GoverningCouncilMemberInput = z.infer<
  typeof governingCouncilMemberSchema
>;
