"use server";
import { Prisma } from "@/src/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { getCurrentAdmin, isAdministrator } from "@/src/lib/admin/authorization";
import { menuSchema } from "@/src/lib/admin/menu-validation";
import { getPrismaClient } from "@/src/lib/prisma";

/**
 * Result returned by the menu form actions. Returning a value (instead of
 * redirecting) lets the editor modal stay open and preserve the user's input
 * when validation or persistence fails.
 */
export type MenuActionResult =
  | { success: true; message: string }
  | { success: false; error: string };

function duplicate(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function saveMenuItem(formData: FormData): Promise<MenuActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      success: false,
      error: "Your session has expired. Sign in again to continue.",
    };
  }

  const parsed = menuSchema.safeParse({
    parentId: formData.get("parentId") || null,
    title: formData.get("title"),
    url: formData.get("url"),
    sortOrder: formData.get("sortOrder"),
    isActive: formData.get("isActive") === "on",
    openInNewTab: formData.get("openInNewTab") === "on",
    isPublished: formData.get("isPublished") === "on",
  });
  if (!parsed.success) {
    return {
      success: false,
      error: "Check the label and destination. Use an internal path or an http(s) URL.",
    };
  }

  const id = Number(formData.get("id"));
  const updating = Number.isSafeInteger(id) && id > 0;
  const prisma = getPrismaClient();
  const previous = updating
    ? await prisma.menuItem.findUnique({ where: { id } })
    : null;
  if (updating && !previous) {
    return { success: false, error: "That menu item no longer exists." };
  }
  if (previous?.isPublished && !isAdministrator(admin)) {
    return {
      success: false,
      error: "Only administrators can edit published menu items.",
    };
  }

  const parentId = parsed.data.parentId ?? null;
  if (parentId !== null) {
    if (parentId === id) {
      return { success: false, error: "A menu item cannot be its own parent." };
    }
    const parent = await prisma.menuItem.findUnique({
      where: { id: parentId },
      select: { id: true },
    });
    if (!parent) {
      return {
        success: false,
        error: "The selected parent menu item no longer exists.",
      };
    }
    if (updating) {
      const all = await prisma.menuItem.findMany({
        select: { id: true, parentId: true },
      });
      const childrenByParent = new Map<number, number[]>();
      for (const item of all) {
        if (item.parentId === null) continue;
        const siblings = childrenByParent.get(item.parentId) ?? [];
        siblings.push(item.id);
        childrenByParent.set(item.parentId, siblings);
      }
      const stack = [id];
      const seen = new Set<number>();
      while (stack.length) {
        const current = stack.pop() as number;
        for (const child of childrenByParent.get(current) ?? []) {
          if (child === parentId) {
            return {
              success: false,
              error: "A menu item cannot be nested under one of its own children.",
            };
          }
          if (!seen.has(child)) {
            seen.add(child);
            stack.push(child);
          }
        }
      }
    }
  }

  const isPublished = isAdministrator(admin) && parsed.data.isPublished;
  const type = /^https?:\/\//.test(parsed.data.url) ? "external" : "link";
  try {
    await prisma.$transaction(async (tx) => {
      const record = updating
        ? await tx.menuItem.update({
            where: { id },
            data: {
              ...parsed.data,
              parentId: parsed.data.parentId ?? null,
              isPublished,
              type,
            },
          })
        : await tx.menuItem.create({
            data: {
              ...parsed.data,
              parentId: parsed.data.parentId ?? null,
              isPublished,
              type,
            },
          });
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: updating ? "update" : "create",
          entityType: "MenuItem",
          entityId: String(record.id),
          details: { title: record.title, url: record.url },
        },
      });
    });
  } catch (error) {
    console.error("Menu item save failed:", error);
    if (duplicate(error)) {
      return {
        success: false,
        error: "A menu item with that destination already exists.",
      };
    }
    return {
      success: false,
      error: "The menu item could not be saved. Please try again.",
    };
  }

  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
  return {
    success: true,
    message: updating ? "Menu item saved." : "Menu item added.",
  };
}

export async function deleteMenuItem(formData: FormData): Promise<MenuActionResult> {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return {
      success: false,
      error: "Your session has expired. Sign in again to continue.",
    };
  }
  if (!isAdministrator(admin)) {
    return { success: false, error: "Only administrators can delete menu items." };
  }

  const id = Number(formData.get("id"));
  if (!Number.isSafeInteger(id) || id <= 0) {
    return { success: false, error: "Select a valid menu item to delete." };
  }

  const prisma = getPrismaClient();
  const item = await prisma.menuItem.findUnique({
    where: { id },
    include: { _count: { select: { children: true } } },
  });
  if (!item) {
    return { success: false, error: "That menu item no longer exists." };
  }
  if (item._count.children) {
    return {
      success: false,
      error: `Move or delete this item's ${item._count.children} child item(s) first.`,
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.adminAuditLog.create({
        data: {
          actorId: admin.id,
          action: "delete",
          entityType: "MenuItem",
          entityId: String(id),
          details: { title: item.title },
        },
      });
      await tx.menuItem.delete({ where: { id } });
    });
  } catch (error) {
    console.error("Menu item delete failed:", error);
    return {
      success: false,
      error: "The menu item could not be deleted. Please try again.",
    };
  }

  revalidatePath("/admin/menus");
  revalidatePath("/", "layout");
  return { success: true, message: "Menu item deleted." };
}
