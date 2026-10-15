import Link from "next/link";
import { unstable_rethrow } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CircleAlert,
  Clock3,
  FilePlus2,
  Inbox,
  Mail,
  MessageSquare,
  Users,
  CheckCircle2,
} from "lucide-react";
import { getAdminDashboardStats } from "@/src/lib/queries/admin-courses";
import { getAdminSubmissionStats } from "@/src/lib/queries/admin-submissions";

export const metadata = { title: "Dashboard | STCET Admin" };

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

function statusBadgeClass(status: string) {
  switch (status) {
    case "New":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "In Progress":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "Contacted":
      return "bg-purple-50 text-purple-700 border-purple-200";
    case "Resolved":
      return "bg-green-50 text-green-700 border-green-200";
    case "Spam":
      return "bg-red-50 text-red-700 border-red-200";
    default:
      return "bg-gray-50 text-gray-700 border-gray-200";
  }
}

export default async function AdminDashboardPage() {
  let courseData: Awaited<ReturnType<typeof getAdminDashboardStats>> | null =
    null;
  let submissionData: Awaited<
    ReturnType<typeof getAdminSubmissionStats>
  > | null = null;

  try {
    const [courses, submissions] = await Promise.all([
      getAdminDashboardStats(),
      getAdminSubmissionStats(),
    ]);
    courseData = courses;
    submissionData = submissions;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Admin dashboard data could not be loaded:", error);
  }

  if (!courseData && !submissionData) {
    return (
      <section className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-amber-950">
        <div className="flex items-start gap-3">
          <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
          <div>
            <h2 className="font-bold text-lg">Dashboard data unavailable</h2>
            <p className="mt-1 text-sm leading-6">
              Check that the database schema has been migrated and the
              application can reach MySQL.
            </p>
          </div>
        </div>
      </section>
    );
  }

  const submissionCards = [
    {
      label: "Total Enquiries",
      value: submissionData?.totalEnquiries ?? 0,
      detail: "Admission applications",
      icon: Inbox,
      href: "/admin/enquiries",
      accent: "text-blue-700",
    },
    {
      label: "New Enquiries",
      value: submissionData?.newEnquiries ?? 0,
      detail: "Pending initial review",
      icon: Clock3,
      href: "/admin/enquiries?status=New",
      accent: "text-amber-600",
    },
    {
      label: "Total Contact Messages",
      value: submissionData?.totalContactMessages ?? 0,
      detail: "Inquiries from contact form",
      icon: Mail,
      href: "/admin/contact-messages",
      accent: "text-purple-700",
    },
    {
      label: "Unresolved Submissions",
      value: submissionData?.unresolvedSubmissions ?? 0,
      detail: "Awaiting resolution",
      icon: CircleAlert,
      href: "/admin/enquiries",
      accent: "text-rose-600",
    },
  ];

  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <section className="grid gap-6 sm:grid-cols-[minmax(0,2fr)_minmax(240px,1fr)] sm:items-end lg:gap-8">
        <div className="max-w-2xl min-w-0">
          <p className="text-sm font-semibold text-primary-700">
            Overview &amp; Activity
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-gray-950 sm:text-3xl">
            Welcome to STCET Admin
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Monitor incoming student enquiries, respond to visitor contact
            messages, and manage website content.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 sm:justify-end">
          <Link
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary-700 px-4 py-2 text-sm font-bold whitespace-nowrap text-white shadow-sm transition hover:bg-primary-800"
            href="/admin/enquiries"
          >
            <Inbox aria-hidden className="size-4" />
            View Enquiries
          </Link>
          <Link
            className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-bold whitespace-nowrap text-gray-700 shadow-sm transition hover:bg-gray-50"
            href="/admin/contact-messages"
          >
            <Mail aria-hidden className="size-4" />
            Contact Messages
          </Link>
        </div>
      </section>

      {/* 1. Submissions Summary Cards */}
      <section
        aria-label="Submission summary metrics"
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {submissionCards.map(
          ({ label, value, detail, icon: Icon, href, accent }) => (
            <Link
              key={label}
              href={href}
              className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-primary-500 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm font-semibold text-gray-600">{label}</p>
                <div
                  className={`grid size-9 place-items-center rounded-lg bg-gray-50 transition group-hover:bg-primary-50 ${accent}`}
                >
                  <Icon aria-hidden className="size-5" />
                </div>
              </div>
              <p className="mt-4 text-3xl font-extrabold text-gray-950">
                {value}
              </p>
              <p className="mt-1 flex items-center justify-between text-xs text-gray-500">
                <span>{detail}</span>
                <span className="font-semibold text-primary-700 opacity-0 transition group-hover:opacity-100">
                  Manage &rarr;
                </span>
              </p>
            </Link>
          ),
        )}
      </section>

      {/* 2. Recent Submissions Section */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Enquiries */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h3 className="font-bold text-gray-900">Latest Enquiries</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Most recent admission form submissions
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900"
            >
              All enquiries <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {submissionData?.recentEnquiries &&
          submissionData.recentEnquiries.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {submissionData.recentEnquiries.map((enq) => (
                <li
                  key={enq.id}
                  className="flex flex-col gap-2 p-4 transition hover:bg-gray-50/75 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">
                        {enq.studentName}
                      </span>
                      <span className="font-mono text-[11px] text-gray-400">
                        {enq.enquiryNumber}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-gray-500">
                      Pref 1:{" "}
                      <strong className="text-gray-700">
                        {enq.coursePreference1 || "N/A"}
                      </strong>{" "}
                      &bull; {enq.studentMobile}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeClass(
                        enq.status,
                      )}`}
                    >
                      {enq.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(enq.submittedAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <Inbox className="mx-auto size-8 text-gray-300" />
              <p className="mt-2 font-semibold text-gray-700 text-sm">
                No enquiries submitted yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                New submissions from /enquire-now will appear here.
              </p>
            </div>
          )}
        </div>

        {/* Recent Contact Messages */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
            <div>
              <h3 className="font-bold text-gray-900">Recent Messages</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Most recent Contact Us messages
              </p>
            </div>
            <Link
              href="/admin/contact-messages"
              className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900"
            >
              All messages <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {submissionData?.recentContactMessages &&
          submissionData.recentContactMessages.length > 0 ? (
            <ul className="divide-y divide-gray-100">
              {submissionData.recentContactMessages.map((msg) => (
                <li
                  key={msg.id}
                  className="flex flex-col gap-2 p-4 transition hover:bg-gray-50/75 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 text-sm">
                      {msg.name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {msg.subject} &bull; {msg.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-bold ${statusBadgeClass(
                        msg.status,
                      )}`}
                    >
                      {msg.status}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {formatDate(msg.createdAt)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-10 text-center">
              <Mail className="mx-auto size-8 text-gray-300" />
              <p className="mt-2 font-semibold text-gray-700 text-sm">
                No contact messages yet
              </p>
              <p className="mt-1 text-xs text-gray-400">
                Inquiries sent from /contact will appear here.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 3. Course Management Overview Section */}
      {courseData && (
        <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-5 py-4">
            <div>
              <h3 className="font-bold text-gray-900">
                Course Catalog Content
              </h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Published &amp; draft programmes configured on the website
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-xs font-bold text-primary-700 hover:text-primary-900"
              href="/admin/courses"
            >
              Manage courses <ArrowRight aria-hidden className="size-3.5" />
            </Link>
          </div>

          <div className="grid gap-px border-b border-gray-200 bg-gray-200 sm:grid-cols-3">
            <div className="bg-white p-4">
              <span className="text-xs text-gray-500">Total Courses</span>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {courseData.totalCourses}
              </p>
            </div>
            <div className="bg-white p-4">
              <span className="text-xs text-gray-500">Published</span>
              <p className="mt-1 text-2xl font-bold text-emerald-600">
                {courseData.publishedCourses}
              </p>
            </div>
            <div className="bg-white p-4">
              <span className="text-xs text-gray-500">Drafts</span>
              <p className="mt-1 text-2xl font-bold text-amber-600">
                {courseData.draftCourses}
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
