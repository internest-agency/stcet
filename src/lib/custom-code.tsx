import "server-only";

import parse, {
  Element,
  type DOMNode,
  type HTMLReactParserOptions,
  Text,
} from "html-react-parser";
import { createElement, type ReactNode } from "react";

/**
 * Converts an admin-provided raw HTML snippet into React nodes so it can be
 * rendered inside <head> or at the end of <body>.
 *
 * Inline event handler attributes (onclick, onerror, ...) are removed because
 * React cannot render them from strings. Script tags are rendered with
 * `dangerouslySetInnerHTML` (inline) or as external script elements so they
 * execute correctly when injected.
 */
function isElement(node: DOMNode): node is Element {
  return node.type === "tag" || node.type === "script" || node.type === "style";
}

function getTextContent(node: DOMNode): string {
  if (node instanceof Text) return node.data;
  if (isElement(node)) {
    return (node.children ?? [])
      .map((child) => getTextContent(child as unknown as DOMNode))
      .join("");
  }
  return "";
}

const options: HTMLReactParserOptions = {
  replace(domNode) {
    if (!isElement(domNode)) return undefined;

    const attribs: Record<string, string> = { ...(domNode.attribs ?? {}) };
    for (const name of Object.keys(attribs)) {
      if (name.toLowerCase().startsWith("on")) {
        delete attribs[name];
      }
    }

    if (domNode.name === "script") {
      const scriptContent = getTextContent(domNode);
      const props: Record<string, unknown> = {
        ...attribs,
        suppressHydrationWarning: true,
      };
      if (attribs.src) {
        return createElement("script", props);
      }
      return createElement("script", {
        ...props,
        dangerouslySetInnerHTML: { __html: scriptContent },
      });
    }

    return undefined;
  },
};

function stripWhitespaceTextNodes(node: ReactNode): ReactNode {
  if (node == null || typeof node === "boolean") return null;

  if (typeof node === "string") {
    return node.trim().length === 0 ? null : node;
  }

  if (typeof node === "number") return node;

  if (Array.isArray(node)) {
    const cleaned = node
      .map(stripWhitespaceTextNodes)
      .filter((child) => child != null);
    return cleaned.length === 0 ? null : cleaned;
  }

  if (typeof node === "object" && "type" in node && "props" in node) {
    const element = node as {
      type: unknown;
      props?: { children?: ReactNode } & Record<string, unknown>;
      key?: string | null;
    };
    if (element.props && "children" in element.props) {
      const cleanedChildren = stripWhitespaceTextNodes(element.props.children);
      const { children: _children, ...restProps } = element.props;
      void _children;
      const props = element.key == null ? restProps : { ...restProps, key: element.key };
      if (cleanedChildren == null) {
        return createElement(element.type as never, props);
      }
      if (Array.isArray(cleanedChildren)) {
        return createElement(element.type as never, props, ...cleanedChildren);
      }
      return createElement(element.type as never, props, cleanedChildren);
    }
  }

  return node;
}

export function renderCustomCode(code: string | null | undefined): ReactNode {
  const trimmed = code?.trim();
  if (!trimmed) return null;

  try {
    const parsed = parse(trimmed, options);
    return stripWhitespaceTextNodes(parsed);
  } catch (error) {
    console.error("[custom-code] Failed to parse custom code:", error);
    return null;
  }
}
