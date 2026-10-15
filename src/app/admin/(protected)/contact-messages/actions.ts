"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";
import { SUBMISSION_STATUSES } from "@/src/lib/types/submissions";

export async function updateContactMessageStatus(id: number, status: string) {
  const admin = await requireAdmin();

  if (!SUBMISSION_STATUSES.includes(status as any)) {
    return { success: false, error: "Invalid status value provided." };
  }

  const prisma = getPrismaClient();

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { status },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_STATUS",
        entityType: "ContactMessage",
        entityId: String(id),
        details: { status, email: updated.email },
      },
    });

    revalidatePath("/admin/contact-messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact message status:", error);
    return { success: false, error: "Database error while updating status." };
  }
}

export async function updateContactMessageNotes(id: number, adminNotes: string) {
  const admin = await requireAdmin();
  const prisma = getPrismaClient();

  try {
    const updated = await prisma.contactMessage.update({
      where: { id },
      data: { adminNotes },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_NOTES",
        entityType: "ContactMessage",
        entityId: String(id),
        details: { email: updated.email },
      },
    });

    revalidatePath("/admin/contact-messages");
    return { success: true };
  } catch (error) {
    console.error("Failed to update contact message notes:", error);
    return { success: false, error: "Database error while saving notes." };
  }
}

export async function deleteContactMessage(id: number) {
  const admin = await requireAdmin();
  const prisma = getPrismaClient();

  try {
    const existing = await prisma.contactMessage.findUnique({
      where: { id },
      select: { email: true, subject: true },
    });

    if (!existing) {
      return { success: false, error: "Contact message not found." };
    }

    await prisma.contactMessage.delete({
      where: { id },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "DELETE",
        entityType: "ContactMessage",
        entityId: String(id),
        details: { email: existing.email, subject: existing.subject },
      },
    });

    revalidatePath("/admin/contact-messages");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete contact message:", error);
    return { success: false, error: "Database error while deleting message." };
  }
}
