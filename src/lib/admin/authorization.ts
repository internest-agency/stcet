import "server-only";

import { getServerSession } from "next-auth";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { authOptions } from "@/src/lib/admin/auth-options";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export type CurrentAdmin = {
  id: number;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "CONTENT_EDITOR";
};

export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  await connection();
  if (!isDatabaseConfigured() || !process.env.NEXTAUTH_SECRET) return null;

  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const adminId = Number(session.user.id);

  if (!Number.isSafeInteger(adminId) || adminId <= 0) return null;

  const admin = await getPrismaClient().adminUser.findUnique({
    where: { id: adminId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isActive: true,
      sessionVersion: true,
    },
  });

  if (
    !admin?.isActive ||
    admin.sessionVersion !== session.user.sessionVersion
  ) {
    return null;
  }

  return {
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  };
}

export async function requireAdmin() {
  const admin = await getCurrentAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}

export function isAdministrator(admin: CurrentAdmin) {
  return admin.role === "SUPER_ADMIN";
}

export async function requireAdministrator() {
  const admin = await requireAdmin();
  if (!isAdministrator(admin)) redirect("/admin/dashboard?error=forbidden");
  return admin;
}
