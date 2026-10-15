import { requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminContactMessages } from "@/src/lib/queries/admin-submissions";
import ContactMessagesManager from "@/src/components/admin/contact-messages/ContactMessagesManager";

export const metadata = {
  title: "Contact Messages | STCET Admin",
};

interface ContactMessagesPageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function ContactMessagesPage({
  searchParams,
}: ContactMessagesPageProps) {
  await requireAdmin();

  const params = await searchParams;
  const page = Number(params.page || 1);
  const pageSize = Number(params.pageSize || 10);
  const search = typeof params.search === "string" ? params.search : undefined;
  const status = typeof params.status === "string" ? params.status : undefined;
  const startDate =
    typeof params.startDate === "string" ? params.startDate : undefined;
  const endDate =
    typeof params.endDate === "string" ? params.endDate : undefined;
  const sortOrder = params.sortOrder === "asc" ? "asc" : "desc";

  const { items, total, totalPages } = await getAdminContactMessages({
    page,
    pageSize,
    search,
    status,
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
            Contact Messages
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Review incoming inquiries from the Contact Us form, reply to senders, manage statuses, and record notes.
          </p>
        </div>
      </section>

      {/* Main Manager Component */}
      <ContactMessagesManager
        messages={items}
        total={total}
        page={page}
        pageSize={pageSize}
        totalPages={totalPages}
      />
    </div>
  );
}
