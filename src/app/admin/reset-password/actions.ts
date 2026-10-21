"use server";

import { redirect } from "next/navigation";
import { createHmac } from "node:crypto";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { hashAdminPassword } from "@/src/lib/admin/password";

export async function resetPassword(formData: FormData) {
  const token = formData.get("token")?.toString();
  const password = formData.get("password")?.toString();
  const confirmPassword = formData.get("confirmPassword")?.toString();

  if (!token || !password || !confirmPassword) {
    return redirect("/admin/reset-password?error=missing_fields");
  }

  if (password !== confirmPassword) {
    return redirect("/admin/reset-password?token=" + encodeURIComponent(token) + "&error=password_mismatch");
  }

  if (password.length < 8) {
    return redirect("/admin/reset-password?token=" + encodeURIComponent(token) + "&error=weak_password");
  }

  if (!isDatabaseConfigured()) {
    return redirect("/admin/reset-password?error=unavailable");
  }

  const prisma = getPrismaClient();

  // Hash the token to find the record
  const tokenHash = createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(token)
    .digest("hex");

  const resetRecord = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!resetRecord) {
    return redirect("/admin/reset-password?error=invalid_token");
  }

  const now = new Date();

  if (resetRecord.usedAt) {
    return redirect("/admin/reset-password?error=token_used");
  }

  if (resetRecord.expiresAt < now) {
    return redirect("/admin/reset-password?error=token_expired");
  }

  const user = resetRecord.user;

  if (!user.isActive) {
    return redirect("/admin/reset-password?error=account_disabled");
  }

  // Hash new password
  const newPasswordHash = await hashAdminPassword(password);

  // Update password and mark token as used in a transaction
  await prisma.$transaction(async (transaction) => {
    await transaction.adminUser.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        sessionVersion: user.sessionVersion + 1, // Invalidate existing sessions
      },
    });

    await transaction.passwordResetToken.update({
      where: { id: resetRecord.id },
      data: { usedAt: now },
    });

    // Invalidate any other unused tokens for this user
    await transaction.passwordResetToken.updateMany({
      where: {
        userId: user.id,
        usedAt: null,
        expiresAt: { gt: now },
        id: { not: resetRecord.id },
      },
      data: { usedAt: now },
    });
  });

  return redirect("/admin/login?reset=success");
}