import GoverningCouncilManager from "@/src/components/admin/governing-council/GoverningCouncilManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Governing Council | STCET Admin" };

export default async function AdminGoverningCouncilPage() {
  const admin = await requireAdmin();

  const members = isDatabaseConfigured()
    ? await getPrismaClient().governingCouncilMember.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      })
    : [];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section>
        <p className="text-sm font-semibold text-primary-700">Content</p>
        <h2 className="mt-1 text-2xl font-bold">Governing Council</h2>
        <p className="mt-2 text-sm text-gray-600">
          Manage the members shown in the Governing Council section of the
          public About page. Add, edit, reorder, publish, unpublish, or remove
          members here — no code changes required.
        </p>
      </section>

      <GoverningCouncilManager
        canPublish={isAdministrator(admin)}
        members={members}
      />
    </div>
  );
}
