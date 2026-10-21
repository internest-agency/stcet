"use server";

import { redirect } from "next/navigation";
import { createHmac, randomBytes } from "node:crypto";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { getZeptoMailConfig, sendZeptoMailEmail } from "@/src/lib/zeptomail";

const RESET_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_RESET_ATTEMPTS = 3;
const RESET_TOKEN_EXPIRY_MS = 60 * 60 * 1000; // 60 minutes

async function recordFailedResetAttempt(emailHash: string, now: Date) {
  const prisma = getPrismaClient();
  const cutoff = new Date(now.getTime() - RESET_WINDOW_MS);

  await prisma.$transaction(async (transaction) => {
    const previous = await transaction.adminLoginAttempt.findUnique({
      where: { emailHash },
    });

    if (!previous || previous.windowStartedAt <= cutoff) {
      await transaction.adminLoginAttempt.upsert({
        where: { emailHash },
        create: { emailHash, attempts: 1, windowStartedAt: now },
        update: { attempts: 1, windowStartedAt: now, blockedUntil: null },
      });
      return;
    }

    if (previous.blockedUntil && previous.blockedUntil > now) return;

    const attempts = previous.attempts + 1;
    await transaction.adminLoginAttempt.update({
      where: { emailHash },
      data: {
        attempts,
        blockedUntil:
          attempts >= MAX_RESET_ATTEMPTS
            ? new Date(now.getTime() + RESET_WINDOW_MS)
            : null,
      },
    });
  });
}

function getBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000"
  );
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email || !email.includes("@") || email.length > 191) {
    return redirect("/admin/forgot-password?error=invalid_email");
  }

  if (!isDatabaseConfigured() || !process.env.NEXTAUTH_SECRET) {
    return redirect("/admin/forgot-password?error=unavailable");
  }

  const secret = process.env.NEXTAUTH_SECRET!;
  const emailHash = createHmac("sha256", secret).update(email).digest("hex");
  const prisma = getPrismaClient();
  const now = new Date();

  // Check rate limiting
  const attempt = await prisma.adminLoginAttempt.findUnique({
    where: { emailHash },
  });

  if (attempt?.blockedUntil && attempt.blockedUntil > now) {
    return redirect("/admin/forgot-password?sent=1");
  }

  // Find user (but don't reveal existence)
  const user = await prisma.adminUser.findUnique({
    where: { email },
    select: { id: true, email: true, name: true, isActive: true },
  });

  // Always show success message to prevent account enumeration
  const genericSuccessRedirect = "/admin/forgot-password?sent=1";

  if (!user || !user.isActive) {
    await recordFailedResetAttempt(emailHash, now);
    return redirect(genericSuccessRedirect);
  }

  // Check if user already has a recent reset request (rate limit)
  const recentReset = await prisma.passwordResetToken.findFirst({
    where: {
      userId: user.id,
      createdAt: { gte: new Date(now.getTime() - RESET_WINDOW_MS) },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recentReset) {
    await recordFailedResetAttempt(emailHash, now);
    return redirect(genericSuccessRedirect);
  }

  // Generate secure random token
  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = createHmac("sha256", process.env.NEXTAUTH_SECRET!)
    .update(rawToken)
    .digest("hex");

  const expiresAt = new Date(now.getTime() + RESET_TOKEN_EXPIRY_MS);

  // Invalidate previous unused tokens for this user
  await prisma.passwordResetToken.updateMany({
    where: {
      userId: user.id,
      usedAt: null,
      expiresAt: { gt: now },
    },
    data: { usedAt: now },
  });

  // Create new reset token
  await prisma.passwordResetToken.create({
    data: {
      tokenHash,
      userId: user.id,
      expiresAt,
    },
  });

  // Send reset email via ZeptoMail
  const config = await getZeptoMailConfig();

  if (config) {
    const resetUrl = `${getBaseUrl()}/admin/reset-password?token=${rawToken}`;
    const htmlbody = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #1e3a5f; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">STCET Website</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Admin Password Reset</p>
        </div>
        <div style="background: #f9f9f9; padding: 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 16px; color: #333; font-size: 16px;">
            Hello ${escapeHtml(user.name)},
          </p>
          <p style="margin: 0 0 16px; color: #333; font-size: 16px;">
            We received a request to reset the password for your STCET Website Admin account.
          </p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetUrl}" style="display: inline-block; background: #1e3a5f; color: white; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 16px;">
              Reset Password
            </a>
          </div>
          <p style="margin: 16px 0 0; color: #666; font-size: 14px;">
            This link will expire in 60 minutes.
          </p>
          <p style="margin: 16px 0 0; color: #666; font-size: 14px;">
            If you didn't request a password reset, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 24px 0;">
          <p style="margin: 0; color: #999; font-size: 12px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #1e3a5f; word-break: break-all;">${resetUrl}</a>
          </p>
        </div>
      </body>
      </html>
    `;

    const textbody = `
Reset your STCET Admin password

Hello ${user.name},

We received a request to reset the password for your STCET Website Admin account.

Reset your password: ${resetUrl}

This link will expire in 60 minutes.

If you didn't request a password reset, you can safely ignore this email.
    `.trim();

    await sendZeptoMailEmail(config, {
      to: [{ address: config.adminEmail, name: "STCET Admin" }],
      subject: "Reset your STCET Admin password",
      htmlbody,
      textbody,
    });
  }

  return redirect(genericSuccessRedirect);
}

function escapeHtml(text: string): string {
  const entityMap: Record<string, string> = {
    "&": String.fromCharCode(38) + "amp;",
    "<": String.fromCharCode(38) + "lt;",
    ">": String.fromCharCode(38) + "gt;",
    '"': String.fromCharCode(38) + "quot;",
    "'": String.fromCharCode(38) + "#039;",
  };
  return text.replace(/[&<>"']/g, (char) => entityMap[char] ?? char);
}