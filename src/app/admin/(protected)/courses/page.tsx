import Link from "next/link";
import { ArrowLeft, ArrowRight, FilePlus2, Search } from "lucide-react";
import { getAdminCourses } from "@/src/lib/queries/admin-courses";

export const metadata = { title: "Courses | STCET Admin" };

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function scalar(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function messageFor(error: string | undefined) {
  const messages: Record<string, string> = {
    duplicate: "That slug is already in use. Choose a unique slug.",
    invalid: "The submitted course details were invalid.",
    missing: "That course no longer exists.",
    forbidden:
      "Editors cannot update published courses. Ask an administrator to unpublish it first.",
  };
  return error
    ? (messages[error] ?? "The course operation could not be completed.")
    : null;
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export default async function AdminCoursesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = scalar(params.q) ?? "";
  const statusParam = scalar(params.status);
  const status =
    statusParam === "published" || statusParam === "draft"
      ? statusParam
      : "all";
  const requestedPage = Number(scalar(params.page));
  const result = await getAdminCourses({ query, status, page: requestedPage });
  const message = messageFor(scalar(params.error));

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Courses</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage course pages and their ordered content sections.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800 sm:self-auto"
          href="/admin/courses/new"
        >
          <FilePlus2 aria-hidden className="size-4" />
          New course
        </Link>
      </section>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
        >
          {message}
        </p>
      ) : null}
      {scalar(params.deleted) ? (
        <p className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900">
          Course deleted.
        </p>
      ) : null}

      <section className="rounded-md border border-gray-200 bg-white">
        <form
          className="grid gap-3 border-b border-gray-200 p-4 sm:grid-cols-[minmax(220px,1fr)_180px_auto]"
          method="get"
        >
          <label className="relative block">
            <span className="sr-only">Search courses</span>
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <input
              className="min-h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              defaultValue={query}
              name="q"
              placeholder="Search name or slug"
            />
          </label>
          <label>
            <span className="sr-only">Publication status</span>
            <select
              className="min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              defaultValue={status}
              name="status"
            >
              <option value="all">All statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <button
            className="min-h-10 rounded-md border border-gray-300 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50"
            type="submit"
          >
            Filter
          </button>
        </form>

        {result.courses.length ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-170 text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-5 py-3 font-bold">Course</th>
                    <th className="px-5 py-3 font-bold">Degree</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Updated</th>
                    <th className="px-5 py-3 text-right font-bold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {result.courses.map((course) => (
                    <tr className="hover:bg-gray-50/70" key={course.id}>
                      <td className="px-5 py-4">
                        <p className="font-bold text-gray-900">{course.name}</p>
                        <p className="mt-1 text-xs text-gray-500">
                          /{course.slug}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {course.degree}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-sm px-2 py-1 text-xs font-bold ${course.isPublished ? "bg-secondary-50 text-secondary-800" : "bg-gray-100 text-gray-600"}`}
                        >
                          {course.isPublished ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(course.updatedAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          className="font-bold text-primary-700 hover:text-primary-900"
                          href={`/admin/courses/${course.id}/edit`}
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 px-5 py-4 text-sm">
              <p className="text-gray-500">
                {result.total} {result.total === 1 ? "course" : "courses"} ·
                Page {result.page} of {result.pageCount}
              </p>
              <div className="flex gap-2">
                {result.page > 1 ? (
                  <Link
                    aria-label="Previous page"
                    className="grid size-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    href={{
                      pathname: "/admin/courses",
                      query: {
                        q: query,
                        status,
                        page: String(result.page - 1),
                      },
                    }}
                  >
                    <ArrowLeft aria-hidden className="size-4" />
                  </Link>
                ) : null}
                {result.page < result.pageCount ? (
                  <Link
                    aria-label="Next page"
                    className="grid size-9 place-items-center rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                    href={{
                      pathname: "/admin/courses",
                      query: {
                        q: query,
                        status,
                        page: String(result.page + 1),
                      },
                    }}
                  >
                    <ArrowRight aria-hidden className="size-4" />
                  </Link>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="px-5 py-14 text-center">
            <p className="font-semibold text-gray-800">
              {query || status !== "all"
                ? "No matching courses"
                : "No courses yet"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              {query || status !== "all"
                ? "Adjust the search or status filter."
                : "Add course information to start building the database-backed pages."}
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
