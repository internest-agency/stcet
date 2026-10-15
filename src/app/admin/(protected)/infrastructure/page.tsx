import Link from "next/link";
import InfrastructureManager from "@/src/components/admin/infrastructure/InfrastructureManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Infrastructure | STCET Admin" };

export default async function InfrastructurePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const facilities = isDatabaseConfigured()
    ? await getPrismaClient().infrastructureFacility.findMany({
        orderBy: [{ category: "asc" }, { sortOrder: "asc" }, { id: "asc" }],
      })
    : [];
  const error = Array.isArray(params.error) ? params.error[0] : params.error;
  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold">Infrastructure Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage academic, laboratory, library, classroom, seminar, computing,
            research, hostel, transport, sports, student, amenities, and canteen
            facilities.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center rounded-md border border-gray-300 bg-white px-3 text-sm font-bold"
          href="/infrastructure"
          target="_blank"
        >
          View public infrastructure page
        </Link>
      </section>
      {error ? (
        <p className="rounded border border-amber-200 bg-amber-50 p-3 text-sm">
          The facility could not be saved. Check the form and try again.
        </p>
      ) : null}
      <InfrastructureManager
        canPublish={isAdministrator(admin)}
        facilities={facilities}
      />
    </div>
  );
}