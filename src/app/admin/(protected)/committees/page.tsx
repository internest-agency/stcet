import Link from "next/link";
import CommitteesManager from "@/src/components/admin/committees/CommitteesManager";
import { isAdministrator, requireAdmin } from "@/src/lib/admin/authorization";
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";

export const metadata = { title: "Committees | STCET Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function noticeFor(params: Record<string, string | string[] | undefined>) {
  if (scalar(params.saved) === "committee")
    return { tone: "success" as const, text: "Committee page saved." };
  if (scalar(params.saved) === "member")
    return { tone: "success" as const, text: "Committee member saved." };
  if (scalar(params.saved) === "reordered")
    return { tone: "success" as const, text: "Member order updated." };
  if (scalar(params.deleted) === "committee")
    return { tone: "success" as const, text: "Committee deleted." };
  if (scalar(params.deleted) === "member")
    return { tone: "success" as const, text: "Committee member removed." };

  const messages: Record<string, string> = {
    "invalid-committee": "The submitted committee details were invalid.",
    "invalid-member": "The submitted member details were invalid.",
    invalid: "The requested action was invalid.",
    missing: "That record no longer exists.",
    forbidden:
      "Editors cannot update published content. Ask an administrator to unpublish it first.",
    "image-unregistered":
      "The selected hero image is not registered. Upload it again.",
    duplicate: "That slug is already in use. Choose a unique slug.",
    "members-remain": "Remove all members before deleting this committee.",
    save: "The committee action could not be completed. Review the data and try again.",
  };
  const error = scalar(params.error);
  if (!error) return null;
  return {
    tone: "error" as const,
    text: messages[error] ?? "The committee action could not be completed.",
  };
}

export default async function CommitteesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [admin, params] = await Promise.all([requireAdmin(), searchParams]);
  const [committees, members] = isDatabaseConfigured()
    ? await Promise.all([
        getPrismaClient().committee.findMany({
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
        }),
        getPrismaClient().committeeMember.findMany({
          orderBy: [
            { committeeSlug: "asc" },
            { sortOrder: "asc" },
            { id: "asc" },
          ],
        }),
      ])
    : [[], []];
  const requested = scalar(params.committee) ?? "";
  const selectedSlug = committees.some(
    (committee) => committee.slug === requested,
  )
    ? requested
    : (committees[0]?.slug ?? "");
  const notice = noticeFor(params);

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold">Committees Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            Choose a committee to manage its members.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-bold"
          href="/anti-ragging-committee"
          rel="noreferrer"
          target="_blank"
        >
          Preview committee page
        </Link>
      </section>

      {notice ? (
        <p
          aria-live="polite"
          className={
            notice.tone === "success"
              ? "rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
              : "rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
          }
        >
          {notice.text}
        </p>
      ) : null}

      <CommitteesManager
        canPublish={isAdministrator(admin)}
        committees={committees}
        members={members}
        selectedSlug={selectedSlug}
      />
    </div>
  );
}
