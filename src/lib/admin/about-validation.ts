import { z } from "zod";

const rich = z.string().trim().max(50_000).optional().nullable();
const shortText = z.string().trim().max(191).optional().nullable();

export const aboutFounderSchema = z.object({
  name: z.string().trim().min(1).max(191),
  designation: shortText,
  roleLabel: shortText,
  imagePath: z.string().trim().max(2048).optional().nullable(),
  biography: rich,
  quote: rich,
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(true),
});

export const aboutChairmanMessageSchema = z.object({
  eyebrow: shortText,
  heading: rich,
  quote: rich,
  body: rich,
  closingStatement: rich,
  name: shortText,
  designation: shortText,
  imagePath: z.string().trim().max(2048).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const aboutVisionMissionSchema = z.object({
  visionEyebrow: shortText,
  visionHeading: rich,
  visionStatement: rich,
  visionTags: z.string().trim().max(255).optional().nullable(),
  visionImagePath: z.string().trim().max(2048).optional().nullable(),
  visionCaptionTitle: z.string().trim().max(255).optional().nullable(),
  visionCaptionSubtitle: z.string().trim().max(255).optional().nullable(),
  missionHeading: rich,
  missionIntro: rich,
  missionTags: z.string().trim().max(255).optional().nullable(),
  isPublished: z.boolean().default(true),
});

export const aboutMissionItemSchema = z.object({
  title: z.string().trim().min(1).max(191),
  description: rich,
  icon: z.string().trim().max(64).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(true),
});

export const aboutTrustSchema = z.object({
  eyebrow: shortText,
  heading: rich,
  intro: rich,
  closingEyebrow: shortText,
  closingLabel: shortText,
  closingStatement: rich,
  closingFooter: shortText,
  isPublished: z.boolean().default(true),
});

export const aboutTrustPillarSchema = z.object({
  title: z.string().trim().min(1).max(191),
  description: rich,
  tag: shortText,
  icon: z.string().trim().max(64).optional().nullable(),
  sortOrder: z.coerce.number().int().min(0).max(99_999).default(0),
  isPublished: z.boolean().default(true),
});
