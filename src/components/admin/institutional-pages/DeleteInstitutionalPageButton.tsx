"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { deleteInstitutionalPage } from "@/src/app/admin/(protected)/institutional-pages/actions";

export default function DeleteInstitutionalPageButton({
  pageId,
  pageTitle,
  onDeleted,
}: {
  pageId: number;
  pageTitle: string;
  onDeleted: (title: string) => void;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) {
        setOpen(false);
        setError("");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, busy]);

  function close() {
    if (busy) return;
    setOpen(false);
    setError("");
  }

  async function confirmDelete() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const result = await deleteInstitutionalPage(pageId);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setOpen(false);
      onDeleted(pageTitle);
      router.refresh();
    } catch {
      setError("The page could not be deleted. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        className="inline-flex min-h-9 items-center gap-1.5 rounded-md border border-red-200 px-3 text-sm font-bold text-red-700 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Trash2 aria-hidden className="size-4" /> Delete page
      </button>

      {open ? (
        <div
          aria-labelledby={`delete-institutional-page-${pageId}`}
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-4"
          role="dialog"
        >
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <AlertTriangle aria-hidden className="size-6 shrink-0" />
              <h3
                className="text-lg font-bold"
                id={`delete-institutional-page-${pageId}`}
              >
                Delete this institutional page?
              </h3>
            </div>
            <p className="mt-3 text-sm text-gray-600">
              This action will permanently delete this page and its associated
              content sections. This action cannot be undone.
            </p>
            <p className="mt-3 rounded-md bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-800">
              {pageTitle}
            </p>
            {error ? (
              <p
                aria-live="polite"
                className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            ) : null}
            <div className="mt-6 flex justify-end gap-3">
              <button
                className="inline-flex min-h-10 items-center rounded-md border border-gray-300 px-4 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                disabled={busy}
                onClick={close}
                type="button"
              >
                Cancel
              </button>
              <button
                className="inline-flex min-h-10 items-center gap-2 rounded-md bg-red-600 px-4 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-50"
                disabled={busy}
                onClick={confirmDelete}
                type="button"
              >
                {busy ? (
                  <Loader2 aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Trash2 aria-hidden className="size-4" />
                )}
                {busy ? "Deleting..." : "Delete page"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
