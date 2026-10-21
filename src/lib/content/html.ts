import DOMPurify from "isomorphic-dompurify";

/**
 * Central HTML policy for rich-text content stored in the database.
 *
 * The same allowlist is enforced:
 *  - on the server before a record is saved, and
 *  - whenever content is rendered to the public site.
 *
 * `ALLOWED_HTML_CLASSES` is duplicated as a Tailwind safelist in
 * `src/app/globals.css` (search for "@source inline"). Keep both in sync.
 */

export const ALLOWED_HTML_TAGS = [
  "p",
  "br",
  "hr",
  "span",
  "div",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "sub",
  "sup",
  "small",
  "mark",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "ul",
  "ol",
  "li",
  "a",
  "blockquote",
  "code",
  "pre",
  "abbr",
  "cite",
  "time",
  "table",
  "caption",
  "thead",
  "tbody",
  "tfoot",
  "tr",
  "th",
  "td",
];

export const ALLOWED_HTML_ATTRIBUTES = [
  "href",
  "target",
  "rel",
  "title",
  "class",
  "colspan",
  "rowspan",
  "scope",
  "start",
  "cite",
  "datetime",
];

/**
 * Only these utility classes survive sanitization. Everything else is removed,
 * which keeps stored markup predictable and prevents arbitrary CSS (and thus
 * layout takeover) from being injected through the editor.
 */
export const ALLOWED_HTML_CLASSES = new Set<string>([
  // Font size
  "text-xs",
  "text-sm",
  "text-base",
  "text-lg",
  "text-xl",
  "text-2xl",
  "text-3xl",
  "text-4xl",
  // Font weight
  "font-normal",
  "font-medium",
  "font-semibold",
  "font-bold",
  "font-extrabold",
  // Style / transform / decoration
  "italic",
  "not-italic",
  "uppercase",
  "lowercase",
  "capitalize",
  "normal-case",
  "underline",
  "line-through",
  "no-underline",
  // Line height
  "leading-tight",
  "leading-snug",
  "leading-normal",
  "leading-relaxed",
  "leading-loose",
  // Letter spacing
  "tracking-tight",
  "tracking-normal",
  "tracking-wide",
  // Text alignment
  "text-left",
  "text-center",
  "text-right",
  // Brand colors
  "text-primary-500",
  "text-primary-600",
  "text-primary-700",
  "text-primary-800",
  "text-primary-900",
  "text-secondary-500",
  "text-secondary-600",
  "text-secondary-700",
  "text-secondary-800",
  "text-secondary-900",
  "text-accent-400",
  "text-accent-500",
  "text-accent-600",
  "text-accent-700",
  "text-accent-800",
  "text-accent-900",
  "text-gray-400",
  "text-gray-500",
  "text-gray-600",
  "text-gray-700",
  "text-gray-800",
  "text-gray-900",
  // Spacing
  "mt-1",
  "mt-2",
  "mt-3",
  "mt-4",
  "mt-5",
  "mt-6",
  "mt-8",
  "mb-1",
  "mb-2",
  "mb-3",
  "mb-4",
  "mb-5",
  "mb-6",
  "mb-8",
  "space-y-1",
  "space-y-2",
  "space-y-3",
  "space-y-4",
  // Lists
  "list-disc",
  "list-decimal",
  "list-inside",
  "list-outside",
  "pl-4",
  "pl-5",
  "pl-6",
  // Misc
  "w-full",
  "border-collapse",
]);

const ALLOWED_URI_PATTERN =
  /^(?:https?:|mailto:|tel:|\/|#|\?|data:image\/(?:png|jpe?g|gif|webp|avif);base64,)/i;

let classFilterRegistered = false;

function registerClassFilter() {
  if (classFilterRegistered) return;
  classFilterRegistered = true;

  DOMPurify.addHook("uponSanitizeAttribute", (_node, data) => {
    if (data.attrName !== "class") return;

    const kept = data.attrValue
      .split(/\s+/)
      .filter((token) => ALLOWED_HTML_CLASSES.has(token));

    if (kept.length > 0) {
      data.attrValue = kept.join(" ");
    } else {
      data.keepAttr = false;
    }
  });
}

const sanitizeCache = new Map<string, string>();
const SANITIZE_CACHE_LIMIT = 500;

/**
 * Sanitize untrusted HTML against the shared policy. Returns a safe string
 * suitable for `dangerouslySetInnerHTML`. Empty input returns an empty string.
 */
export function sanitizeHtml(input: string | null | undefined): string {
  if (!input) return "";

  const cached = sanitizeCache.get(input);
  if (cached !== undefined) return cached;

  registerClassFilter();

  const clean = DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ALLOWED_HTML_TAGS,
    ALLOWED_ATTR: ALLOWED_HTML_ATTRIBUTES,
    ALLOWED_URI_REGEXP: ALLOWED_URI_PATTERN,
    ALLOW_DATA_ATTR: false,
    FORBID_TAGS: [
      "script",
      "style",
      "iframe",
      "object",
      "embed",
      "form",
      "input",
      "button",
      "textarea",
      "select",
      "option",
      "link",
      "meta",
      "base",
      "svg",
      "math",
      "video",
      "audio",
      "canvas",
      "noscript",
      "template",
    ],
    FORBID_CONTENTS: ["script", "style"],
  });

  if (sanitizeCache.size >= SANITIZE_CACHE_LIMIT) {
    sanitizeCache.clear();
  }
  sanitizeCache.set(input, clean);

  return clean;
}

/** True when a value contains at least one HTML tag. */
export function containsHtml(value: string | null | undefined): boolean {
  return typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value);
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
};

function decodeEntities(value: string): string {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code: string) => {
    if (code.startsWith("#")) {
      const isHex = code[1] === "x" || code[1] === "X";
      const parsed = Number.parseInt(code.slice(isHex ? 2 : 1), isHex ? 16 : 10);
      if (Number.isFinite(parsed)) {
        try {
          return String.fromCodePoint(parsed);
        } catch {
          return match;
        }
      }
      return match;
    }
    return NAMED_ENTITIES[code.toLowerCase()] ?? match;
  });
}

/**
 * Convert stored rich text into a single line of plain text. Used in places
 * that render content as text (search indexes, listings, meta descriptions,
 * navigation) so tags never leak into the UI.
 */
export function toPlainText(value: string | null | undefined): string {
  if (!value) return "";
  return decodeEntities(
    value
      .replace(/<br\s*\/?>/gi, " ")
      .replace(/<\/(p|div|li|tr|h[1-6])>/gi, " ")
      .replace(/<[^>]*>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}
