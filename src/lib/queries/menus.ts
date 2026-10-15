import "server-only";

import { connection } from "next/server";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export interface MenuItemNode {
  id: number;
  parentId: number | null;
  title: string;
  url: string;
  type: string;
  sortOrder: number;
  isActive: boolean;
  openInNewTab: boolean;
  isPublished: boolean;
  children: MenuItemNode[];
  depth: number;
}

type MenuItemRecord = Omit<MenuItemNode, "children" | "depth">;

export async function getMenuItems(): Promise<MenuItemNode[]> {
  if (!isDatabaseConfigured()) return [];

  await connection();

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

  const buildTree = (
    items: MenuItemRecord[],
    parentId: number | null,
    depth: number,
  ): MenuItemNode[] =>
    items
      .filter((item) => item.parentId === parentId)
      .map((item) => ({
        ...item,
        depth,
        children: buildTree(items, item.id, depth + 1),
      }));

  return buildTree(rawItems, null, 0);
}
