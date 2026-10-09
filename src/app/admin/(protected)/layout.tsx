import type { ReactNode } from "react";
import AdminShell from "@/src/components/admin/AdminShell";
import { requireAdmin } from "@/src/lib/admin/authorization";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
