import { requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminEnquiries } from "@/src/lib/queries/admin-submissions";
import EnquiriesManager from "@/src/components/admin/enquiries/EnquiriesManager";

export const metadata = {
  title: "Enquiries | STCET Admin",
};

interface EnquiriesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function EnquiriesPage({
  searchParams,
}: EnquiriesPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 10);
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const course = typeof params.course === "string" ? params.course : undefined;
  const startDate =
    typeof params.startDate === "string" ? params.startDate : undefined;
  const endDate =
    typeof params.endDate === "string" ? params.endDate : undefined;
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await getAdminEnquiries({
    page,
    pageSize,
    search,
    status,
    course,
    startDate,
    endDate,
    sortOrder,
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Submissions</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">
            Enquiry Management
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Review student applications, manage statuses, save counselling notes, and export records.
          </p>
        </div>
      </section>

      {/* Main Manager Component */}
      <EnquiriesManager
        enquiries={items}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
