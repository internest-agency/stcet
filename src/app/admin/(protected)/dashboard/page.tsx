import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  Clock3,
  FilePlus2,
} from "lucide-react";
import { getAdminDashboardStats } from "@/src/lib/queries/admin-courses";

export const metadata = { title: "Dashboard | STCET Admin" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}

export default async function AdminDashboardPage() {
  let data: Awaited<ReturnType<typeof getAdminDashboardStats>> | null = null;

  try {
    data = await getAdminDashboardStats();
  } catch (error) {
    unstable_rethrow(error);
    console.error("Admin dashboard data could not be loaded.");
  }

  if (!data) {
    return (
      <section className="rounded-md border border-amber-200 bg-amber-50 p-5 text-amber-950">
        <div className="flex items-start gap-3">
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="font-bold">Dashboard data unavailable</h2>
            <p className="mt-1 text-sm leading-6">
              Check that the database schema has been migrated and the
              application can reach MySQL.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const summary = [
    {
      label: "Total courses",
      value: data.totalCourses,
      detail: "All records",
      icon: BookOpen,
    },
    {
      label: "Published",
      value: data.publishedCourses,
      detail: "Visible on the website",
      icon: ArrowRight,
    },
    {
      label: "Drafts",
      value: data.draftCourses,
      detail: "Not publicly visible",
      icon: FilePlus2,
    },
  ];

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">
            Content overview
          </p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">
            Good to see you
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage the course information currently connected to the STCET
            website.
          </p>
        </div>
        <Link
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md bg-primary-700 px-4 py-2 text-sm font-bold text-white hover:bg-primary-800 sm:self-auto"
          href="/admin/courses/new"
        >
          <FilePlus2 aria-hidden className="size-4" />
          Add course
        </Link>
      </section>

      <section aria-label="Course totals" className="grid gap-4 sm:grid-cols-3">
        {summary.map(({ label, value, detail, icon: Icon }) => (
          <article
            className="rounded-md border border-gray-200 bg-white p-5"
            key={label}
          >
            <div className="flex items-start justify-between">
              <p className="text-sm font-semibold text-gray-600">{label}</p>
              <Icon aria-hidden className="size-5 text-primary-700" />
            </div>
            <p className="mt-4 text-3xl font-extrabold text-gray-950">
              {value}
            </p>
            <p className="mt-1 text-xs text-gray-500">{detail}</p>
          </article>
        ))}
      </section>

      <section className="overflow-hidden rounded-md border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
          <div>
            <h3 className="font-bold text-gray-900">
              Recently updated courses
            </h3>
            <p className="mt-1 text-xs text-gray-500">
              Ordered by the database update timestamp
            </p>
          </div>
          <Link
            className="inline-flex items-center gap-1 text-sm font-bold text-primary-700 hover:text-primary-900"
            href="/admin/courses"
          >
            View all <ArrowRight aria-hidden className="size-4" />
          </Link>
        </div>
        {data.recentCourses.length ? (
          <ul className="divide-y divide-gray-100">
            {data.recentCourses.map((course) => (
              <li
                className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                key={course.id}
              >
                <div>
                  <Link
                    className="font-semibold text-gray-900 hover:text-primary-700"
                    href={`/admin/courses/${course.id}/edit`}
                  >
                    {course.name}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">/{course.slug}</p>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span
                    className={
                      course.isPublished
                        ? "font-bold text-secondary-700"
                        : "font-semibold text-gray-500"
                    }
                  >
                    {course.isPublished ? "Published" : "Draft"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 aria-hidden className="size-3.5" />
                    {formatDate(course.updatedAt)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="px-5 py-12 text-center">
            <BookOpen aria-hidden className="mx-auto size-8 text-gray-300" />
            <p className="mt-3 font-semibold text-gray-800">
              No courses in the database yet
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Create the first course to begin managing website content.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
