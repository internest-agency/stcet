/**
 * Single source of truth for the "Placement Leadership" section content.
 *
 * These values are the content that was previously hardcoded inside
 * `src/components/sections/placement/PlacementHead.tsx`. They are used in two
 * places:
 *  - as idempotent seed data (scripts/seed-placement-leadership.ts), and
 *  - as the fallback the public component renders when no database content is
 *    available, so the page never breaks and keeps its current text.
 *
 * Rich-text fields are stored as sanitized-friendly HTML strings. Only the
 * shared allowlist in src/lib/content/html.ts survives sanitization.
 */

export type PlacementLeadershipItemContent = {
  id?: number;
  title: string;
  description?: string | null;
};

export type PlacementLeadershipContent = {
  id?: number;
  eyebrow?: string | null;
  heading?: string | null;
  description?: string | null;
  officerName?: string | null;
  officerDesignation?: string | null;
  officerImagePath?: string | null;
  officerImageAlt?: string | null;
  items: PlacementLeadershipItemContent[];
};

export const placementLeadershipItems: PlacementLeadershipItemContent[] = [
  { title: "Qualification details", description: null },
  { title: "Professional experience", description: null },
  { title: "Relevant industry experience", description: null },
];

export const placementLeadershipContent: PlacementLeadershipContent = {
  eyebrow: "Placement Leadership",
  heading: "Guiding Students Towards Careers.",
  description:
    '<p>The Placement Cell is headed by <strong class="font-semibold text-primary-700">Mr. B. Rajesh</strong> who will be working closely with students and departments to identify career aspirations, strengthen employability skills and facilitate opportunities for interaction with the industry.</p>',
  officerName: "Mr. B. Rajesh",
  officerDesignation: "Placement Cell",
  officerImagePath: "/images/placements/placeholder.webp",
  officerImageAlt: "Mr. B. Rajesh, Placement Cell",
  items: placementLeadershipItems,
};
