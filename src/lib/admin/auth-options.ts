import "server-only";

import { createHmac } from "node:crypto";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { verifyAdminPassword } from "@/src/lib/admin/password";

const ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

async function recordFailedAttempt(emailHash: string, now: Date) {
  const prisma = getPrismaClient();
  const cutoff = new Date(now.getTime() - ATTEMPT_WINDOW_MS);

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
          attempts >= MAX_ATTEMPTS
            ? new Date(now.getTime() + ATTEMPT_WINDOW_MS)
            : null,
      },
    });
  });
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "College administrator",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase();
        const password = credentials?.password;
        const secret = process.env.NEXTAUTH_SECRET;

        if (
          !email ||
          email.length > 191 ||
          !password ||
          password.length > 256 ||
          !secret ||
          !isDatabaseConfigured()
        ) {
          return null;
        }

        const emailHash = createHmac("sha256", secret)
          .update(email)
          .digest("hex");
        const prisma = getPrismaClient();
        const now = new Date();
        const attempt = await prisma.adminLoginAttempt.findUnique({
          where: { emailHash },
        });

        if (attempt?.blockedUntil && attempt.blockedUntil > now) return null;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        const passwordMatches = await verifyAdminPassword(
          user?.passwordHash ?? null,
          password,
        );

        if (!user || !user.isActive || !passwordMatches) {
          await recordFailedAttempt(emailHash, now);
          return null;
        }

        await prisma.adminLoginAttempt.deleteMany({ where: { emailHash } });

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
          sessionVersion: user.sessionVersion,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.adminRole = user.role;
        token.adminSessionVersion = user.sessionVersion;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.adminRole ?? "";
        session.user.sessionVersion = token.adminSessionVersion ?? -1;
      }
      return session;
    },
  },
};
