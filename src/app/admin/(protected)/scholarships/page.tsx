import Link from "next/link";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import ScholarshipsManager from "@/src/components/admin/scholarships/ScholarshipsManager";

export const metadata = { title: "Scholarships | STCET Admin" };

export default async function AdminScholarshipsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const scholarships = isDatabaseConfigured()
    ? await getPrismaClient().scholarship.findMany({
        orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
      })
    : [];
  const scalar = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const saved = scalar(params.saved);
  const deleted = scalar(params.deleted);
  const error = scalar(params.error);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Scholarships Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            Keep verified scholarship information as drafts until an administrator publishes it.
          </p>
        </div>
        <Link className="inline-flex min-h-10 items-center self-start rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:self-auto" href="/scholarships" target="_blank">
          View public scholarships page
        </Link>
      </section>
      {error ? <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">The scholarship could not be saved. Check the required fields and URL, then try again.</p> : null}
      {saved ? <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">Scholarship saved successfully.</p> : null}
      {deleted ? <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">Scholarship removed successfully.</p> : null}
      <ScholarshipsManager canPublish={isAdministrator(admin)} scholarships={scholarships} />
    </div>
  );
}
