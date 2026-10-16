import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import type { MenuItemNode } from "@/src/lib/menu-types";

export type { MenuItemNode };

type MenuItemRecord = Omit<MenuItemNode, "children" | "depth">;

/**
 * Builds a nested navigation tree from the flat `menuitem` rows.
 *
 * Defensive behaviour (the admin UI already prevents these states, but the
 * public header must never crash or silently drop links if bad data slips
 * through):
 *
 * - Rows whose parent is not present in the published/active set (parent was
 *   deleted, unpublished, or deactivated) are promoted to top-level so a valid
 *   link is never silently discarded.
 * - Self-references and longer parent cycles are broken by promoting the
 *   offending row to top-level, so rendering can never loop forever.
 * - Every row is attached exactly once, so an item can never appear both as a
 *   top-level item and inside a parent.
 *
 * Sibling order follows the query's `sortOrder` ordering because rows are
 * pushed onto their parent's `children` array in the order they arrive.
 */
export function buildMenuTree(items: MenuItemRecord[]): MenuItemNode[] {
  const nodes = new Map<number, MenuItemNode>();
  for (const item of items) {
    nodes.set(item.id, { ...item, children: [], depth: 0 });
  }

  // Walk up the parent chain from `startParentId`; if we reach `id`, attaching
  // `id` beneath that parent would create a cycle.
  const wouldCycle = (id: number, startParentId: number): boolean => {
    let current: number | null = startParentId;
    const seen = new Set<number>();
    while (current !== null && !seen.has(current)) {
      if (current === id) return true;
      seen.add(current);
      current = nodes.get(current)?.parentId ?? null;
    }
    return false;
  };

  const roots: MenuItemNode[] = [];
  for (const item of items) {
    const node = nodes.get(item.id) as MenuItemNode;
    const parentId = item.parentId;
    if (
      parentId !== null &&
      parentId !== item.id &&
      nodes.has(parentId) &&
      !wouldCycle(item.id, parentId)
    ) {
      (nodes.get(parentId) as MenuItemNode).children.push(node);
    } else {
      roots.push(node);
    }
  }

  // Assign depth iteratively with a visited guard so malformed data can never
  // cause an infinite loop even if a cycle somehow survived the checks above.
  const visited = new Set<number>();
  const stack = roots.map((node) => ({ node, depth: 0 }));
  while (stack.length) {
    const { node, depth } = stack.pop() as {
      node: MenuItemNode;
      depth: number;
    };
    if (visited.has(node.id)) {
      node.children = [];
      continue;
    }
    visited.add(node.id);
    node.depth = depth;
    for (const child of node.children) {
      stack.push({ node: child, depth: depth + 1 });
    }
  }

  return roots;
}

/**
 * Public navigation tree: published + active items only, ordered by the
 * configured `sortOrder`, nested by parent. Returns `[]` if the database is not
 * configured or the query fails (logged server-side) so the header can fall
 * back safely without exposing internals.
 */
export async function getMenuItems(): Promise<MenuItemNode[]> {
  if (!isDatabaseConfigured()) return [];

  await connection();

  try {
    const prisma = getPrismaClient();

    const rawItems: MenuItemRecord[] = await prisma.menuItem.findMany({
      where: { isPublished: true, isActive: true },
      orderBy: [{ parentId: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      select: {
        id: true,
        parentId: true,
        title: true,
        url: true,
        type: true,
        sortOrder: true,
        isActive: true,
        openInNewTab: true,
        isPublished: true,
      },
    });

    return buildMenuTree(rawItems);
  } catch (error) {
    console.error(
      "Public menu query failed; the header will use its fallback navigation.",
      error,
    );
    return [];
  }
}
