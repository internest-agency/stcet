import "server-only";

import parse, { type HTMLReactParserOptions } from "html-react-parser";
import type { ReactNode } from "react";

/**
 * Converts an admin-provided raw HTML snippet into React nodes so it can be
 * rendered inside <head> or at the end of <body>.
 *
 * Inline event handler attributes (onclick, onerror, ...) are removed because
 * React cannot render them from strings. Scripts that attach listeners still
 * work normally.
 */
const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (domNode && typeof domNode === "object" && "attribs" in domNode) {
      const attribs = (domNode as { attribs?: Record<string, string> }).attribs;
      if (attribs) {
        for (const name of Object.keys(attribs)) {
          if (name.toLowerCase().startsWith("on")) {
            delete attribs[name];
          }
        }
      }
    }
    return undefined;
  },
};

export function renderCustomCode(code: string | null | undefined): ReactNode {
  const trimmed = code?.trim();
  if (!trimmed) return null;

  try {
    return parse(trimmed, options);
  } catch (error) {
    console.error("[custom-code] Failed to parse custom code:", error);
    return null;
  }
}
