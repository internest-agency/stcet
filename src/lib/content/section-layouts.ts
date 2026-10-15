/**
 * Canonical registry for institutional content-section layouts.
 *
 * The same identifiers are used by:
 *  - the Prisma `PageSection.layout` column (stored value),
 *  - the admin layout selector,
 *  - server-side validation, and
 *  - the public section renderer.
 *
 * Keep this list as the single source of truth. Adding a layout here is not
 * enough on its own — the renderer must also implement it.
 */

export const SECTION_LAYOUT_IDS = [
  "standard",
  "image-left",
  "image-right",
  "full-width",
  "image-banner",
  "highlight",
  "two-column",
] as const;

export type SectionLayoutId = (typeof SECTION_LAYOUT_IDS)[number];

export const DEFAULT_SECTION_LAYOUT: SectionLayoutId = "standard";

export interface SectionLayoutOption {
  id: SectionLayoutId;
  label: string;
  /** Abbreviated label for compact selectors. */
  shortLabel: string;
  description: string;
  /** Whether the layout makes meaningful use of the optional section image. */
  usesImage: boolean;
}

export const SECTION_LAYOUTS: readonly SectionLayoutOption[] = [
  {
    id: "standard",
    label: "Standard content",
    shortLabel: "Standard",
    description: "Title, content, and an optional image below.",
    usesImage: true,
  },
  {
    id: "image-left",
    label: "Image left",
    shortLabel: "Image left",
    description: "Image beside the title and content.",
    usesImage: true,
  },
  {
    id: "image-right",
    label: "Image right",
    shortLabel: "Image right",
    description: "Content beside an image on the right.",
    usesImage: true,
  },
  {
    id: "full-width",
    label: "Full width",
    shortLabel: "Full width",
    description: "Wide single-column content with an optional image.",
    usesImage: true,
  },
  {
    id: "image-banner",
    label: "Image banner",
    shortLabel: "Banner",
    description: "A prominent image with the content beneath it.",
    usesImage: true,
  },
  {
    id: "highlight",
    label: "Highlight / callout",
    shortLabel: "Highlight",
    description: "Content inside a tinted callout panel.",
    usesImage: false,
  },
  {
    id: "two-column",
    label: "Two columns",
    shortLabel: "Two columns",
    description: "Content flows into two columns on wide screens.",
    usesImage: true,
  },
];

const LAYOUT_ID_SET: ReadonlySet<string> = new Set(SECTION_LAYOUT_IDS);

/** True when a value is a supported layout identifier. */
export function isSectionLayoutId(value: unknown): value is SectionLayoutId {
  return typeof value === "string" && LAYOUT_ID_SET.has(value);
}

/**
 * Coerce any stored/unknown value to a supported layout id. Missing or
 * unrecognized values fall back to the standard layout so older records keep
 * rendering after a schema change.
 */
export function resolveSectionLayout(value: unknown): SectionLayoutId {
  return isSectionLayoutId(value) ? value : DEFAULT_SECTION_LAYOUT;
}

export function sectionLayoutLabel(value: unknown): string {
  const id = resolveSectionLayout(value);
  return SECTION_LAYOUTS.find((layout) => layout.id === id)?.label ?? id;
}
