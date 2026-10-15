import { z } from "zod";

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional().nullable();

export const scholarshipSchema = z.object({
  name: z.string().trim().min(2).max(191),
  description: optionalText(20_000),
  eligibility: optionalText(20_000),
  financialBenefit: optionalText(20_000),
  incomeLimit: optionalText(20_000),
  applicationInstructions: optionalText(20_000),
  applicationUrl: z.string().trim().url().max(2048).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(false),
});
