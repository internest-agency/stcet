import { sanitizeHtml } from "@/src/lib/content/html";

interface RichTextProps {
  html?: string | null;
  className?: string;
  as?: "div" | "span";
}

/**
 * Renders stored rich-text HTML after sanitizing it against the shared policy.
 * Safe to use from both server and client components. Renders nothing when the
 * sanitized content is empty so sections can keep their existing empty states.
 */
export default function RichText({
  html,
  className,
  as = "div",
}: RichTextProps) {
  const clean = sanitizeHtml(html);
  if (!clean) return null;

  const classes = className ? `rich-text ${className}` : "rich-text";

  if (as === "span") {
    return (
      <span
        className={classes}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    );
  }

  return (
    <div className={classes} dangerouslySetInnerHTML={{ __html: clean }} />
  );
}
