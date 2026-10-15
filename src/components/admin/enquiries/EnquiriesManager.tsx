"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  X,
  Clock,
  Phone,
  Mail,
  MapPin,
  Calendar,
  BookOpen,
  User,
  GraduationCap,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import {
  updateEnquiryStatus,
  updateEnquiryNotes,
  deleteEnquiry,
} from "@/src/app/admin/(protected)/enquiries/actions";
import {
  SUBMISSION_STATUSES,
  SubmissionStatus,
} from "@/src/lib/types/submissions";

type EnquiryItem = {
  id: number;
  enquiryNumber: string;
  studentName: string;
  dateOfBirth: string;
  studentMobile: string;
  studentEmail: string;
  category: string;
  hostelRequired: string;
  transportRequired: string;
  parentName: string;
  occupation: string;
  parentMobile: string;
  parentEmail: string;
  annualIncome: string;
  address: string;
  tenthSchool: string;
  tenthBoard: string;
  tenthMarks: string;
  twelfthSchool: string;
  twelfthBoard: string;
  mathsMarks: string;
  physicsMarks: string;
  chemistryMarks: string;
  mpcPercentage: string;
  tneaCounselling: string;
  coursePreference1: string;
  coursePreference2: string;
  coursePreference3: string;
  coursePreference4: string;
  coursePreference5: string;
  howDidYouKnow: string;
  clientIp: string;
  status: string;
  adminNotes: string | null;
  submittedAt: Date;
  updatedAt: Date;
};

interface EnquiriesManagerProps {
  enquiries: EnquiryItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const COURSES_LIST = [
  "B.E. CSE",
  "B.E. CSE (AI+ML)",
  "B.E. ECE",
  "B.E. EEE",
  "B.Tech. IT",
];

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

export default function EnquiriesManager({
  enquiries,
  total,
  page,
  pageSize,
  totalPages,
}: EnquiriesManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const currentStatus = searchParams.get("status") || "All";
  const currentCourse = searchParams.get("course") || "All";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  // Modal states
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(
    null,
  );
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [enquiryToDelete, setEnquiryToDelete] = useState<EnquiryItem | null>(
    null,
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const updateFilters = (newParams: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([k, v]) => {
      if (v === "" || v === "All") {
        params.delete(k);
      } else {
        params.set(k, String(v));
      }
    });
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput, page: 1 });
  };

  const handleOpenDetail = (enquiry: EnquiryItem) => {
    setSelectedEnquiry(enquiry);
    setNotesDraft(enquiry.adminNotes || "");
    setActionMessage(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedEnquiry) return;
    setUpdatingStatus(true);
    setActionMessage(null);

    const result = await updateEnquiryStatus(selectedEnquiry.id, newStatus);
    setUpdatingStatus(false);

    if (result.success) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
      setActionMessage({
        type: "success",
        text: `Status updated to "${newStatus}"`,
      });
      router.refresh();
    } else {
      setActionMessage({
        type: "error",
        text: result.error || "Failed to update status",
      });
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedEnquiry) return;
    setSavingNotes(true);
    setActionMessage(null);

    const result = await updateEnquiryNotes(selectedEnquiry.id, notesDraft);
    setSavingNotes(false);

    if (result.success) {
      setSelectedEnquiry({ ...selectedEnquiry, adminNotes: notesDraft });
      setActionMessage({ type: "success", text: "Notes saved successfully" });
      router.refresh();
    } else {
      setActionMessage({
        type: "error",
        text: result.error || "Failed to save notes",
      });
    }
  };

  const handleDelete = async () => {
    if (!enquiryToDelete) return;
    setIsDeleting(true);

    const result = await deleteEnquiry(enquiryToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      setEnquiryToDelete(null);
      if (selectedEnquiry?.id === enquiryToDelete.id) {
        setSelectedEnquiry(null);
      }
      router.refresh();
    } else {
      alert(result.error || "Failed to delete enquiry");
    }
  };

  const exportCsvUrl = `/api/admin/enquiries/export?${searchParams.toString()}`;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5"
        >
          {/* Search text */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search student, mobile, email, enquiry #..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600 focus:bg-white"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={currentStatus}
              onChange={(e) => updateFilters({ status: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-primary-600 focus:bg-white"
            >
              <option value="All">All Statuses</option>
              {SUBMISSION_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Course filter */}
          <div>
            <select
              value={currentCourse}
              onChange={(e) => updateFilters({ course: e.target.value, page: 1 })}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-primary-600 focus:bg-white"
            >
              <option value="All">All Courses</option>
              {COURSES_LIST.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort order & Actions */}
          <div className="flex items-center gap-2">
            <select
              value={currentSortOrder}
              onChange={(e) =>
                updateFilters({ sortOrder: e.target.value, page: 1 })
              }
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-primary-600 focus:bg-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>

            <a
              href={exportCsvUrl}
              download
              className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 hover:text-gray-900"
              title="Export filtered records to CSV"
            >
              <Download className="size-4" />
              <span>CSV</span>
            </a>
          </div>
        </form>

        {/* Date filter row */}
        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 text-xs text-gray-500">
          <span className="font-semibold text-gray-700">Filter Date:</span>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={currentStartDate}
              onChange={(e) =>
                updateFilters({ startDate: e.target.value, page: 1 })
              }
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-primary-600"
            />
            <span>to</span>
            <input
              type="date"
              value={currentEndDate}
              onChange={(e) =>
                updateFilters({ endDate: e.target.value, page: 1 })
              }
              className="rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs text-gray-700 outline-none focus:border-primary-600"
            />
            {(currentStartDate || currentEndDate || searchParams.toString()) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput("");
                  router.push(pathname);
                }}
                className="ml-2 font-bold text-red-600 hover:underline"
              >
                Clear Filters
              </button>
            )}
          </div>
          <span className="ml-auto font-medium">
            Showing <strong className="text-gray-900">{enquiries.length}</strong> of{" "}
            <strong className="text-gray-900">{total}</strong> enquiries
          </span>
        </div>
      </div>

      {/* Enquiries Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">Enquiry #</th>
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Course Preferences</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.length > 0 ? (
                enquiries.map((enquiry) => (
                  <tr
                    key={enquiry.id}
                    className="transition hover:bg-gray-50/60"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-primary-900">
                      {enquiry.enquiryNumber}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">
                        {enquiry.studentName}
                      </div>
                      <div className="text-xs text-gray-500">
                        DOB: {enquiry.dateOfBirth}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-800">
                        {enquiry.studentMobile}
                      </div>
                      <div className="text-gray-500">{enquiry.studentEmail}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-block rounded bg-primary-50 px-2.5 py-1 text-xs font-bold text-primary-800">
                        {enquiry.coursePreference1 || "Not specified"}
                      </span>
                      {enquiry.coursePreference2 && (
                        <span className="ml-1.5 inline-block text-[11px] text-gray-400">
                          +2nd: {enquiry.coursePreference2}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(
                          enquiry.status,
                        )}`}
                      >
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(enquiry.submittedAt))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(enquiry)}
                          className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 transition hover:border-primary-600 hover:text-primary-700"
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEnquiryToDelete(enquiry)}
                          className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 transition hover:border-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <BookOpen className="mx-auto size-9 text-gray-300" />
                    <p className="mt-3 font-semibold text-gray-700">
                      No enquiry submissions found
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Try adjusting your search criteria or date filters.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {total > 0 && (
          <div className="flex flex-col items-center justify-between gap-4 border-t border-gray-200 px-5 py-4 sm:flex-row">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>Show</span>
              <select
                value={pageSize}
                onChange={(e) =>
                  updateFilters({ pageSize: Number(e.target.value), page: 1 })
                }
                className="rounded border border-gray-200 bg-white px-2 py-1 text-xs outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
              <span>per page</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => updateFilters({ page: page - 1 })}
                className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 disabled:opacity-40"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-3 text-xs font-semibold text-gray-700">
                Page {page} of {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => updateFilters({ page: page + 1 })}
                className="inline-flex size-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 disabled:opacity-40"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details View Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4 sm:p-6">
          <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <span className="font-mono text-xs font-bold text-primary-700">
                  {selectedEnquiry.enquiryNumber}
                </span>
                <h3 className="text-xl font-extrabold text-gray-900">
                  {selectedEnquiry.studentName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 space-y-6 overflow-y-auto px-6 py-6">
              {actionMessage && (
                <div
                  className={`rounded-lg p-3 text-sm font-medium ${
                    actionMessage.type === "success"
                      ? "bg-green-50 text-green-800 border border-green-200"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  {actionMessage.text}
                </div>
              )}

              {/* Status & Quick Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gray-200 bg-gray-50/75 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status:
                  </span>
                  <select
                    value={selectedEnquiry.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm outline-none focus:border-primary-600"
                  >
                    {SUBMISSION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span>
                    Submitted:{" "}
                    <strong>
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(selectedEnquiry.submittedAt))}
                    </strong>
                  </span>
                  <span>IP: {selectedEnquiry.clientIp}</span>
                </div>
              </div>

              {/* Section 1: Student Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-800">
                  <User className="size-4" /> 1. Student Information
                </h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Full Name</span>
                    <p className="font-semibold">{selectedEnquiry.studentName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Date of Birth</span>
                    <p className="font-semibold">{selectedEnquiry.dateOfBirth}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Community / Category</span>
                    <p className="font-semibold">{selectedEnquiry.category || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Mobile Number</span>
                    <p className="font-semibold text-primary-700">
                      <a href={`tel:${selectedEnquiry.studentMobile}`}>
                        {selectedEnquiry.studentMobile}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Email Address</span>
                    <p className="font-semibold text-primary-700">
                      <a href={`mailto:${selectedEnquiry.studentEmail}`}>
                        {selectedEnquiry.studentEmail}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Hostel / Transport</span>
                    <p className="font-semibold">
                      Hostel: {selectedEnquiry.hostelRequired || "No"} | Bus:{" "}
                      {selectedEnquiry.transportRequired || "No"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 2: Parent Information */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-800">
                  <User className="size-4" /> 2. Parent / Guardian Details
                </h4>
                <div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-sm">
                  <div>
                    <span className="text-xs text-gray-500">Parent / Guardian Name</span>
                    <p className="font-semibold">{selectedEnquiry.parentName}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Occupation</span>
                    <p className="font-semibold">{selectedEnquiry.occupation || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Annual Income</span>
                    <p className="font-semibold">{selectedEnquiry.annualIncome || "—"}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Parent Mobile</span>
                    <p className="font-semibold text-primary-700">
                      <a href={`tel:${selectedEnquiry.parentMobile}`}>
                        {selectedEnquiry.parentMobile}
                      </a>
                    </p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500">Parent Email</span>
                    <p className="font-semibold">
                      {selectedEnquiry.parentEmail ? (
                        <a href={`mailto:${selectedEnquiry.parentEmail}`}>
                          {selectedEnquiry.parentEmail}
                        </a>
                      ) : (
                        "—"
                      )}
                    </p>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3">
                    <span className="text-xs text-gray-500">Residential Address</span>
                    <p className="mt-0.5 rounded-lg bg-gray-50 p-2.5 font-medium text-gray-800">
                      {selectedEnquiry.address || "—"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Academic Details */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-800">
                  <GraduationCap className="size-4" /> 3. Academic Details
                </h4>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <h5 className="font-bold text-gray-700">10th Standard</h5>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3 text-xs">
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">School:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.tenthSchool || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Board:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.tenthBoard || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Total Marks:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.tenthMarks || "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <h5 className="font-bold text-gray-700">12th Standard</h5>
                    <div className="mt-2 grid gap-3 sm:grid-cols-3 text-xs">
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">School:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.twelfthSchool || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Board:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.twelfthBoard || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">TNEA Counselling:</span>{" "}
                        <span className="font-semibold">
                          {selectedEnquiry.tneaCounselling || "—"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-3 sm:grid-cols-4 text-xs">
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Maths:</span>{" "}
                        <span className="font-bold text-gray-800">
                          {selectedEnquiry.mathsMarks || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Physics:</span>{" "}
                        <span className="font-bold text-gray-800">
                          {selectedEnquiry.physicsMarks || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <span className="text-gray-500">Chemistry:</span>{" "}
                        <span className="font-bold text-gray-800">
                          {selectedEnquiry.chemistryMarks || "—"}
                        </span>
                      </div>
                      <div className="rounded bg-primary-50 p-2 text-primary-900 font-bold">
                        <span>MPC %:</span>{" "}
                        <span>{selectedEnquiry.mpcPercentage || "—"}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Course Preferences & Source */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-primary-800">
                  <BookOpen className="size-4" /> 4. Course Preferences & Source
                </h4>
                <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
                  <ul className="space-y-1.5 rounded-lg bg-gray-50 p-3 text-xs">
                    <li>
                      <span className="font-bold text-primary-700">Preference 1:</span>{" "}
                      {selectedEnquiry.coursePreference1 || "—"}
                    </li>
                    <li>
                      <span className="font-bold text-primary-700">Preference 2:</span>{" "}
                      {selectedEnquiry.coursePreference2 || "—"}
                    </li>
                    <li>
                      <span className="font-bold text-primary-700">Preference 3:</span>{" "}
                      {selectedEnquiry.coursePreference3 || "—"}
                    </li>
                    <li>
                      <span className="font-bold text-primary-700">Preference 4:</span>{" "}
                      {selectedEnquiry.coursePreference4 || "—"}
                    </li>
                    <li>
                      <span className="font-bold text-primary-700">Preference 5:</span>{" "}
                      {selectedEnquiry.coursePreference5 || "—"}
                    </li>
                  </ul>
                  <div className="rounded-lg bg-gray-50 p-3 text-xs">
                    <span className="text-gray-500">How did they know about us?</span>
                    <p className="mt-1 font-bold text-gray-800">
                      {selectedEnquiry.howDidYouKnow || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 5: Admin Notes */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="text-sm font-bold uppercase tracking-wider text-primary-800">
                  5. Internal Admin Notes
                </h4>
                <p className="mt-1 text-xs text-gray-500">
                  Private notes for college staff and admission counselors.
                </p>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes about calls, counselling discussions, fee confirmations..."
                  className="mt-3 w-full rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600"
                />
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    disabled={savingNotes}
                    onClick={handleSaveNotes}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary-700 px-4 py-2 text-xs font-bold text-white shadow transition hover:bg-primary-800 disabled:opacity-50"
                  >
                    <Save className="size-3.5" />
                    {savingNotes ? "Saving Notes..." : "Save Notes"}
                  </button>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 px-6 py-4">
              <button
                type="button"
                onClick={() => setEnquiryToDelete(selectedEnquiry)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-800"
              >
                <Trash2 className="size-4" /> Delete Submission
              </button>
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-5 py-2 text-xs font-bold text-gray-700 hover:bg-gray-100"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {enquiryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="size-6 shrink-0" />
              <h3 className="text-lg font-bold">Delete Enquiry</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete enquiry{" "}
              <strong className="text-gray-900">
                {enquiryToDelete.enquiryNumber}
              </strong>{" "}
              for{" "}
              <strong className="text-gray-900">
                {enquiryToDelete.studentName}
              </strong>
              ? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setEnquiryToDelete(null)}
                className="rounded-lg border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
