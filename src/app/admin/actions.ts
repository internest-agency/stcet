"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient } from "@/src/lib/prisma";

export async function logoutAdmin() {
  try {
    const admin = await getCurrentAdmin();
    if (admin) {
      await getPrismaClient().adminUser.update({
        where: { id: admin.id },
        data: { sessionVersion: { increment: 1 } },
      });
    }
  } catch {}

  const cookieStore = await cookies();
  cookieStore.delete("next-auth.session-token");
  cookieStore.delete("__Secure-next-auth.session-token");
  redirect("/admin/login");
}
