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
  const configured = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (configured) return configured.replace(/\/$/, "");

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl) return `https://${vercelUrl}`;

  return "http://localhost:3000";
}

export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();

  if (!email || !email.includes("@") || email.length > 191) {
    return redirect("/admin/forgot-password?error=invalid_email");
  }

  if (!isDatabaseConfigured() || !process.env.NEXTAUTH_SECRET) {
    return redirect("/admin/forgot-password?error=unavailable");
  }

  try {
    const secret = process.env.NEXTAUTH_SECRET!;
    const emailHash = createHmac("sha256", secret).update(email).digest("hex");
    const prisma = getPrismaClient();
    const now = new Date();

    // Check rate limiting
    const attempt = await prisma.adminLoginAttempt.findUnique({
      where: { emailHash },
    });

    if (attempt?.blockedUntil && attempt.blockedUntil > now) {
      console.info("[forgot-password] reset request throttled (temporary block)");
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
      console.info("[forgot-password] reset requested for unknown or inactive account");
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
      console.info("[forgot-password] reset already requested recently; no new email sent");
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
    let config: Awaited<ReturnType<typeof getZeptoMailConfig>>;
    try {
      config = await getZeptoMailConfig();
    } catch (error) {
      console.error("[forgot-password] failed to load mail configuration", error);
      return redirect("/admin/forgot-password?error=mail_unavailable");
    }

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

      try {
        const result = await sendZeptoMailEmail(config, {
          to: [{ address: user.email, name: user.name }],
          subject: "Reset your STCET Admin password",
          htmlbody,
          textbody,
        });
        if (!result.success) {
          console.error("[forgot-password] reset email send failed", result.message);
          return redirect("/admin/forgot-password?error=send_failed");
        }
        console.info("[forgot-password] reset email accepted for delivery");
      } catch (error) {
        if (
          error &&
          typeof error === "object" &&
          "digest" in error &&
          typeof (error as { digest?: unknown }).digest === "string" &&
          (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
        ) {
          throw error;
        }
        console.error("[forgot-password] failed to send reset email", error);
        return redirect("/admin/forgot-password?error=send_failed");
      }
    } else {
      console.error("[forgot-password] ZeptoMail is not configured; cannot send reset email");
      return redirect("/admin/forgot-password?error=mail_unavailable");
    }

    return redirect(genericSuccessRedirect);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof (error as { digest?: unknown }).digest === "string" &&
      (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
    ) {
      throw error;
    }
    console.error("[forgot-password] request failed", error);
    return redirect("/admin/forgot-password?error=unavailable");
  }
}

function escapeHtml(text: string): string {
  const entityMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => entityMap[char] ?? char);
}
