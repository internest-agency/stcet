"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";
import { SUBMISSION_STATUSES } from "@/src/lib/types/submissions";

export async function updateEnquiryStatus(id: number, status: string) {
  const admin = await requireAdmin();

  if (!SUBMISSION_STATUSES.includes(status as any)) {
    return { success: false, error: "Invalid status value provided." };
  }

  const prisma = getPrismaClient();

  try {
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { status },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_STATUS",
        entityType: "Enquiry",
        entityId: String(id),
        details: { status, enquiryNumber: updated.enquiryNumber },
      },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to update enquiry status:", error);
    return { success: false, error: "Database error while updating status." };
  }
}

export async function updateEnquiryNotes(id: number, adminNotes: string) {
  const admin = await requireAdmin();
  const prisma = getPrismaClient();

  try {
    const updated = await prisma.enquiry.update({
      where: { id },
      data: { adminNotes },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_NOTES",
        entityType: "Enquiry",
        entityId: String(id),
        details: { enquiryNumber: updated.enquiryNumber },
      },
    });

    revalidatePath("/admin/enquiries");
    return { success: true };
  } catch (error) {
    console.error("Failed to update enquiry notes:", error);
    return { success: false, error: "Database error while saving notes." };
  }
}

export async function deleteEnquiry(id: number) {
  const admin = await requireAdmin();
  const prisma = getPrismaClient();

  try {
    const existing = await prisma.enquiry.findUnique({
      where: { id },
      select: { enquiryNumber: true },
    });

    if (!existing) {
      return { success: false, error: "Enquiry not found." };
    }

    await prisma.enquiry.delete({
      where: { id },
    });

    await prisma.adminAuditLog.create({
      data: {
        actorId: admin.id,
        action: "DELETE",
        entityType: "Enquiry",
        entityId: String(id),
        details: { enquiryNumber: existing.enquiryNumber },
      },
    });

    revalidatePath("/admin/enquiries");
    revalidatePath("/admin/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete enquiry:", error);
    return { success: false, error: "Database error while deleting enquiry." };
  }
}
