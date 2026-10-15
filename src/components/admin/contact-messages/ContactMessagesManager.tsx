"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  Download,
  Eye,
  Trash2,
  X,
  Phone,
  Mail,
  User,
  Save,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import {
  updateContactMessageStatus,
  updateContactMessageNotes,
  deleteContactMessage,
} from "@/src/app/admin/(protected)/contact-messages/actions";
import {
  SUBMISSION_STATUSES,
  SubmissionStatus,
} from "@/src/lib/types/submissions";

type ContactMessageItem = {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  clientIp: string;
  status: string;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

interface ContactMessagesManagerProps {
  messages: ContactMessageItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
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

export default function ContactMessagesManager({
  messages,
  total,
  page,
  pageSize,
  totalPages,
}: ContactMessagesManagerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const currentStatus = searchParams.get("status") || "All";
  const currentStartDate = searchParams.get("startDate") || "";
  const currentEndDate = searchParams.get("endDate") || "";
  const currentSortOrder = searchParams.get("sortOrder") || "desc";

  // Modal states
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessageItem | null>(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [messageToDelete, setMessageToDelete] =
    useState<ContactMessageItem | null>(null);
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

  const handleOpenDetail = (item: ContactMessageItem) => {
    setSelectedMessage(item);
    setNotesDraft(item.adminNotes || "");
    setActionMessage(null);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedMessage) return;
    setUpdatingStatus(true);
    setActionMessage(null);

    const result = await updateContactMessageStatus(
      selectedMessage.id,
      newStatus,
    );
    setUpdatingStatus(false);

    if (result.success) {
      setSelectedMessage({ ...selectedMessage, status: newStatus });
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
    if (!selectedMessage) return;
    setSavingNotes(true);
    setActionMessage(null);

    const result = await updateContactMessageNotes(
      selectedMessage.id,
      notesDraft,
    );
    setSavingNotes(false);

    if (result.success) {
      setSelectedMessage({ ...selectedMessage, adminNotes: notesDraft });
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
    if (!messageToDelete) return;
    setIsDeleting(true);

    const result = await deleteContactMessage(messageToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      setMessageToDelete(null);
      if (selectedMessage?.id === messageToDelete.id) {
        setSelectedMessage(null);
      }
      router.refresh();
    } else {
      alert(result.error || "Failed to delete message");
    }
  };

  const exportCsvUrl = `/api/admin/contact-messages/export?${searchParams.toString()}`;

  return (
    <div className="space-y-6">
      {/* Search and Filters Bar */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Search text */}
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3.5 top-3 size-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search sender, email, phone, subject, message..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary-600 focus:bg-white"
            />
          </div>

          {/* Status filter */}
          <div>
            <select
              value={currentStatus}
              onChange={(e) =>
                updateFilters({ status: e.target.value, page: 1 })
              }
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
              title="Export filtered messages to CSV"
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
            Showing <strong className="text-gray-900">{messages.length}</strong> of{" "}
            <strong className="text-gray-900">{total}</strong> messages
          </span>
        </div>
      </div>

      {/* Messages Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50/75 text-xs font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Sender</th>
                <th className="px-5 py-3.5">Contact</th>
                <th className="px-5 py-3.5">Subject</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.length > 0 ? (
                messages.map((item) => (
                  <tr key={item.id} className="transition hover:bg-gray-50/60">
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-xs font-bold text-gray-500">
                      #{item.id}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-5 py-4 text-xs">
                      <div className="font-medium text-gray-800">
                        {item.email}
                      </div>
                      <div className="text-gray-500">{item.phone}</div>
                    </td>
                    <td className="max-w-xs truncate px-5 py-4 text-xs font-medium text-gray-700">
                      {item.subject}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold ${statusBadgeClass(
                          item.status,
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-gray-500">
                      {new Intl.DateTimeFormat("en-IN", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(new Date(item.createdAt))}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(item)}
                          className="rounded-md border border-gray-200 bg-white p-1.5 text-gray-600 transition hover:border-primary-600 hover:text-primary-700"
                          title="View Message"
                        >
                          <Eye className="size-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setMessageToDelete(item)}
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
                    <MessageSquare className="mx-auto size-9 text-gray-300" />
                    <p className="mt-3 font-semibold text-gray-700">
                      No contact messages found
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-3 sm:p-4">
          <div
            className="fixed inset-0"
            onClick={() => setSelectedMessage(null)}
            aria-hidden="true"
          />
          <div className="relative flex w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[calc(100dvh-24px)] min-h-0">
            {/* Header */}
            <div className="shrink-0 flex items-center justify-between border-b border-gray-200 px-5 py-4 sm:px-6 sm:py-5 bg-white">
              <div className="min-w-0 pr-4">
                <span className="font-mono text-xs font-bold text-gray-400">
                  Message #{selectedMessage.id}
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-gray-900 break-words [overflow-wrap:anywhere]">
                  {selectedMessage.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMessage(null)}
                className="shrink-0 rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                aria-label="Close modal"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Modal Body - Only this area scrolls */}
            <div className="flex-1 min-h-0 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6 space-y-5">
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

              {/* Status and Timestamp Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-gray-200 bg-gray-50/75 p-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Status:
                  </span>
                  <select
                    value={selectedMessage.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm outline-none focus:border-primary-600 focus:ring-1 focus:ring-primary-600 disabled:opacity-50"
                  >
                    {SUBMISSION_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="text-xs text-gray-500 sm:text-right">
                  Received:{" "}
                  <strong className="text-gray-700">
                    {new Intl.DateTimeFormat("en-IN", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(selectedMessage.createdAt))}
                  </strong>
                </div>
              </div>

              {/* Sender Details - 3 cols desktop, 2 cols md, 1 col sm, min-w-0 and wrapped email */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-800">
                  <User className="size-4 shrink-0" /> Sender Details
                </h4>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-gray-500">Name</span>
                    <p className="mt-0.5 font-semibold text-gray-900 break-words [overflow-wrap:anywhere]">
                      {selectedMessage.name}
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-gray-500">Email Address</span>
                    <p className="mt-0.5 font-semibold text-primary-700">
                      <a
                        href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                          selectedMessage.subject,
                        )}`}
                        className="inline-flex max-w-full items-start gap-1 break-all [overflow-wrap:anywhere] hover:underline"
                        title="Click to reply via default email client"
                      >
                        <span className="break-all [overflow-wrap:anywhere]">{selectedMessage.email}</span>
                        <ExternalLink className="mt-1 size-3 shrink-0" />
                      </a>
                    </p>
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-medium text-gray-500">Phone Number</span>
                    <p className="mt-0.5 font-semibold text-primary-700">
                      <a
                        href={`tel:${selectedMessage.phone}`}
                        className="inline-block break-all hover:underline"
                      >
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary-800">
                  <MessageSquare className="size-4 shrink-0" /> Message Body
                </h4>
                <div className="mt-3 whitespace-pre-wrap break-words [overflow-wrap:anywhere] rounded-lg bg-gray-50 p-4 text-sm leading-relaxed text-gray-800">
                  {selectedMessage.message}
                </div>
                <div className="mt-2 text-right text-[11px] text-gray-400 break-all">
                  Client IP: {selectedMessage.clientIp}
                </div>
              </div>

              {/* Admin Notes */}
              <div className="rounded-xl border border-gray-200 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-primary-800">
                  Internal Staff Notes
                </h4>
                <textarea
                  rows={3}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  placeholder="Add notes about actions taken, follow-up calls, resolution notes..."
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

            {/* Footer - fixed within flex column flow at bottom, never obscures content */}
            <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-200 bg-white px-5 py-4 sm:px-6">
              <button
                type="button"
                onClick={() => setMessageToDelete(selectedMessage)}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50/50 px-3.5 text-xs font-bold text-red-600 transition hover:bg-red-100 hover:text-red-700"
              >
                <Trash2 className="size-4 shrink-0" /> Delete Message
              </button>
              <div className="flex flex-wrap items-center gap-2.5 sm:justify-end">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject,
                  )}`}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-primary-600 bg-primary-50 px-4 text-xs font-bold text-primary-800 shadow-sm transition hover:bg-primary-100"
                >
                  <Mail className="size-3.5 shrink-0" /> Reply by Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="inline-flex h-9 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {messageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle className="size-6 shrink-0" />
              <h3 className="text-lg font-bold">Delete Message</h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              Are you sure you want to delete the message from{" "}
              <strong className="text-gray-900">{messageToDelete.name}</strong>{" "}
              regarding &quot;{messageToDelete.subject}&quot;? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setMessageToDelete(null)}
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
