import Link from "next/link";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getAdminAdmissionsData } from "@/src/lib/queries/admin-admissions";
import AdmissionsManager from "@/src/components/admin/admissions/AdmissionsManager";

export const metadata = { title: "Admissions | STCET Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

const statusMessages: Record<string, string> = {
  intro: "Admissions introduction updated.",
  route: "Admission route saved.",
  tnea: "TNEA journey step saved.",
  quota: "Management quota details updated.",
  notice: "Important notice saved.",
  link: "Application link saved.",
  contact: "Admission contact saved.",
};

const deleteMessages: Record<string, string> = {
  route: "Admission route removed.",
  tnea: "TNEA step removed.",
  notice: "Important notice removed.",
  link: "Application link removed.",
  contact: "Admission contact removed.",
};

export default async function AdminAdmissionsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [admin, params] = await Promise.all([
    requireAdmin(),
    searchParams,
  ]);

  const admissionsData = await getAdminAdmissionsData();
  const savedKey = scalar(params.saved);
  const deletedKey = scalar(params.deleted);
  const errorKey = scalar(params.error);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Admissions Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage admission routes, TNEA application journey, management quota details, notices, links, and contacts.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center gap-2 self-start rounded-md border border-gray-300 bg-white px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 sm:self-auto"
          href="/admissions"
          target="_blank"
        >
          View public admissions page
        </Link>
      </section>

      {errorKey && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          The requested admissions action could not be completed. Please review the inputs and try again.
        </p>
      )}

      {savedKey && (
        <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">
          {statusMessages[savedKey] || "Admissions content saved successfully."}
        </p>
      )}

      {deletedKey && (
        <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">
          {deleteMessages[deletedKey] || "Item removed successfully."}
        </p>
      )}

      <AdmissionsManager
        canPublish={isAdministrator(admin)}
        data={admissionsData}
      />
    </div>
  );
}
