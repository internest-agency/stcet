"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Eye,
  EyeOff,
  LoaderCircle,
  Pencil,
  Plus,
  Save,
  Search,
  Trash2,
  X,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import {
  deleteFaculty,
  saveFaculty,
  type FacultyActionResult,
} from "@/src/app/admin/(protected)/faculty/actions";
import {
  bulkDeleteFaculty,
  bulkPublishFaculty,
  bulkUnpublishFaculty,
} from "@/src/app/admin/(protected)/faculty/bulk-actions";
import type { FacultyBulkAction } from "@/src/lib/admin/faculty-validation";
import { useBulkSelection } from "./useBulkSelection";

export type FacultyRow = {
  id: number;
  name: string;
  designation: string;
  department: string | null;
  group: string | null;
  groupId: number | null;
  auFin: string | null;
  aicteId: string | null;
  qualification: string | null;
  specialization: string | null;
  experience: number | null;
  email: string | null;
  phone: string | null;
  photo: string | null;
  bio: string | null;
  sortOrder: number;
  isPublished: boolean;
  updatedAt: Date;
};

const inputClass =
  "mt-1.5 min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

const textareaClass = `${inputClass} min-h-24 resize-y`;

const primaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-3.5 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

const ghostDangerClass =
  "grid size-9 place-items-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

type ActionMessage = { type: "success" | "error"; text: string };

function SelectAllCheckbox({
  checked,
  indeterminate,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  indeterminate: boolean;
  disabled?: boolean;
  label: string;
  onChange: (checked: boolean) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      aria-label={label}
      checked={checked}
      className="size-4 accent-primary-700"
      disabled={disabled}
      onChange={(event) => onChange(event.target.checked)}
      ref={ref}
      type="checkbox"
    />
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-xs font-semibold text-gray-600" htmlFor={id}>
      {label}
      {required ? " *" : ""}
      {children}
    </label>
  );
}

function useFacultyAction(
  action: (formData: FormData) => Promise<FacultyActionResult>,
  onSuccess?: (message: string) => void,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const formData = new FormData(event.currentTarget);
      const result = await action(formData);

      if (!result.success) {
        setError(result.error);
        setPending(false);
        return;
      }

      setPending(false);
      if (onSuccess) {
        onSuccess(result.message);
      }
    } catch (error) {
      console.error("Faculty action failed", error);
      setError("The faculty change could not be completed. Please try again.");
      setPending(false);
    }
  };

  const clearError = () => setError("");

  return { pending, error, submit, setError: clearError };
}

function FacultyForm({
  member,
  canPublish,
  groups,
  onToggleDirty,
  onRequestClose,
  onSaved,
}: {
  member?: FacultyRow;
  canPublish: boolean;
  groups: { id: number; name: string }[];
  onToggleDirty: (dirty: boolean) => void;
  onRequestClose: () => void;
  onSaved: (message: string) => void;
}) {
  const id = useId();
  const [photo, setPhoto] = useState(member?.photo ?? "");
  const form = useFacultyAction(saveFaculty, onSaved);

  return (
    <form
      className="mt-4 space-y-4"
      onInput={() => onToggleDirty(true)}
      onSubmit={form.submit}
    >
      {member ? <input name="facultyId" type="hidden" value={member.id} /> : null}
      <input name="photo" type="hidden" value={photo} />

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Professional details
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={`${id}-name`} label="Full name" required>
            <input
              className={inputClass}
              defaultValue={member?.name ?? ""}
              id={`${id}-name`}
              maxLength={191}
              name="name"
              required
            />
          </Field>
          <Field id={`${id}-designation`} label="Designation" required>
            <input
              className={inputClass}
              defaultValue={member?.designation ?? ""}
              id={`${id}-designation`}
              maxLength={191}
              name="designation"
              required
            />
          </Field>
          <Field id={`${id}-department`} label="Department">
            <input
              className={inputClass}
              defaultValue={member?.department ?? ""}
              id={`${id}-department`}
              maxLength={191}
              name="department"
            />
          </Field>
          <Field id={`${id}-group`} label="Group">
            <select
              className={inputClass}
              defaultValue={member?.groupId ? String(member.groupId) : ""}
              id={`${id}-group`}
              name="groupId"
            >
              <option value="">No group</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </Field>
          <Field id={`${id}-qualification`} label="Qualification">
            <input
              className={inputClass}
              defaultValue={member?.qualification ?? ""}
              id={`${id}-qualification`}
              maxLength={255}
              name="qualification"
            />
          </Field>
          <Field id={`${id}-specialization`} label="Specialization">
            <input
              className={inputClass}
              defaultValue={member?.specialization ?? ""}
              id={`${id}-specialization`}
              maxLength={255}
              name="specialization"
            />
          </Field>
          <Field id={`${id}-experience`} label="Experience (years)">
            <input
              className={inputClass}
              defaultValue={member?.experience ?? ""}
              id={`${id}-experience`}
              max={80}
              min={0}
              name="experience"
              step="0.5"
              type="number"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Contact details
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={`${id}-email`} label="Email">
            <input
              className={inputClass}
              defaultValue={member?.email ?? ""}
              id={`${id}-email`}
              maxLength={191}
              name="email"
              type="email"
            />
          </Field>
          <Field id={`${id}-phone`} label="Phone">
            <input
              className={inputClass}
              defaultValue={member?.phone ?? ""}
              id={`${id}-phone`}
              maxLength={50}
              name="phone"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Internal identifiers
        </legend>
        <p className="text-[11px] text-gray-400">
          Never shown on the public faculty page.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={`${id}-auFin`} label="AU-FIN">
            <input
              className={inputClass}
              defaultValue={member?.auFin ?? ""}
              id={`${id}-auFin`}
              maxLength={64}
              name="auFin"
            />
          </Field>
          <Field id={`${id}-aicteId`} label="AICTE ID">
            <input
              className={inputClass}
              defaultValue={member?.aicteId ?? ""}
              id={`${id}-aicteId`}
              maxLength={128}
              name="aicteId"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Profile content
        </legend>
        <label className="block text-xs font-semibold text-gray-600" htmlFor={`${id}-bio`}>
          Biography
          <textarea
            className={textareaClass}
            defaultValue={member?.bio ?? ""}
            id={`${id}-bio`}
            maxLength={5000}
            name="bio"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Profile photograph
        </legend>
        <ImageUploadField
          category="faculty"
          compact
          label="Passport photograph"
          onChange={(path) => {
            setPhoto(path);
            onToggleDirty(true);
          }}
          value={photo}
        />
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Publication and ordering
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id={`${id}-order`} label="Display order" required>
            <input
              className={inputClass}
              defaultValue={member?.sortOrder ?? 0}
              id={`${id}-order`}
              max={99999}
              min={0}
              name="sortOrder"
              required
              type="number"
            />
          </Field>
          <div className="flex items-end pb-2">
            {canPublish ? (
              <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
                <input
                  className="size-4 accent-primary-700"
                  defaultChecked={member?.isPublished ?? false}
                  name="isPublished"
                  type="checkbox"
                />
                Published on the public faculty page
              </label>
            ) : (
              <input name="isPublished" type="hidden" value="off" />
            )}
          </div>
        </div>
      </fieldset>

      {form.error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {form.error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          className={secondaryButtonClass}
          disabled={form.pending}
          onClick={onRequestClose}
          type="button"
        >
          Cancel
        </button>
        <button className={primaryButtonClass} disabled={form.pending} type="submit">
          {form.pending ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <Save aria-hidden className="size-4" />
          )}
          {member ? "Save changes" : "Add faculty"}
        </button>
      </div>
    </form>
  );
}

function Modal({
  title,
  children,
  onClose,
  maxWidthClass = "max-w-lg",
  closeDisabled,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  maxWidthClass?: string;
  closeDisabled?: boolean;
}) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !closeDisabled) {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, closeDisabled]);

  return (
    <div
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/50 p-4"
      role="dialog"
    >
      <div className={`w-full ${maxWidthClass} rounded-2xl bg-white p-5 shadow-2xl sm:p-6`}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <button
            aria-label="Close dialog"
            className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={closeDisabled}
            onClick={onClose}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function PhotoAvatar({
  member,
  className = "size-9",
}: {
  member: FacultyRow;
  className?: string;
}) {
  if (member.photo) {
    return (
      <Image
        alt=""
        className={`${className} rounded object-cover`}
        height={64}
        src={member.photo}
        unoptimized
        width={64}
      />
    );
  }
  return (
    <span
      className={`${className} grid place-items-center rounded bg-primary-50 text-xs font-bold text-primary-700`}
    >
      {initials(member.name)}
    </span>
  );
}

type DeleteTarget =
  | { mode: "single"; member: FacultyRow }
  | { mode: "bulk"; ids: number[] };

export default function FacultyManager({
  canPublish,
  members,
  total,
  page,
  pageCount,
  pageSize,
  query,
  designation,
  status,
  sort,
  designations,
  groups,
}: {
  canPublish: boolean;
  members: FacultyRow[];
  total: number;
  page: number;
  pageCount: number;
  pageSize: number;
  query: string;
  designation: string;
  status: "all" | "published" | "draft";
  sort: "updated" | "name" | "designation" | "order";
  designations: string[];
  groups: { id: number; name: string }[];
}) {
  const router = useRouter();
  const [editor, setEditor] = useState<
    { mode: "add" } | { mode: "edit"; member: FacultyRow } | null
  >(null);
  const [formDirty, setFormDirty] = useState(false);
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [pendingAction, setPendingAction] = useState<FacultyBulkAction | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const { selected, toggle, selectMany, removeMany, clear } = useBulkSelection();

  const pageIds = useMemo(() => members.map((member) => member.id), [members]);
  const selectedIds = useMemo(() => [...selected], [selected]);
  const selectedOnPage = useMemo(
    () => pageIds.filter((id) => selected.has(id)),
    [pageIds, selected],
  );
  const allOnPageSelected = pageIds.length > 0 && selectedOnPage.length === pageIds.length;
  const someOnPageSelected = selectedOnPage.length > 0 && !allOnPageSelected;
  const selectedCount = selectedIds.length;
  const selectedOnOtherPages = selectedCount - selectedOnPage.length;
  const busy = pendingAction !== null;

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = (page - 1) * pageSize + members.length;

  const hasActiveFilters =
    (query.trim().length > 0) ||
    (designation && designation !== "all") ||
    status !== "all" ||
    sort !== "updated";

  const openAdd = () => {
    setEditor({ mode: "add" });
    setFormDirty(false);
    setMessage(null);
  };

  const openEdit = (member: FacultyRow) => {
    setEditor({ mode: "edit", member });
    setFormDirty(false);
    setMessage(null);
  };

  const closeEditor = () => {
    if (formDirty) {
      if (!window.confirm("Discard unsaved changes?")) {
        return;
      }
    }
    setEditor(null);
    setFormDirty(false);
  };

  const handleSaved = (text: string) => {
    setMessage({ type: "success", text });
    setEditor(null);
    setFormDirty(false);
    router.refresh();
  };

  const runBulk = async (action: "publish" | "unpublish") => {
    if (!selectedCount || busy) return;
    setPendingAction(action);
    setMessage(null);
    setDeleteError("");

    try {
      const result =
        action === "publish"
          ? await bulkPublishFaculty(selectedIds)
          : await bulkUnpublishFaculty(selectedIds);

      if (!result.success) {
        setMessage({
          type: "error",
          text: result.error ?? "The bulk action could not be completed.",
        });
        return;
      }

      const count = result.count ?? 0;
      const noun = count === 1 ? "faculty member" : "faculty members";
      setMessage({
        type: "success",
        text: `${count} ${noun} ${action === "publish" ? "published" : "unpublished"} successfully.`,
      });
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "The bulk action could not be completed. Please try again.",
      });
    } finally {
      setPendingAction(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || busy) return;
    setPendingAction("delete");
    setDeleteError("");

    try {
      if (deleteTarget.mode === "single") {
        const result = await deleteFaculty(deleteTarget.member.id);
        if (!result.success) {
          setDeleteError(result.error);
          return;
        }
        removeMany([deleteTarget.member.id]);
        setMessage({
          type: "success",
          text: `“${deleteTarget.member.name}” was deleted.`,
        });
        setDeleteTarget(null);
        router.refresh();
      } else {
        const ids = deleteTarget.ids;
        const result = await bulkDeleteFaculty(ids);
        if (!result.success) {
          setDeleteError(result.error ?? "The bulk delete could not be completed.");
          return;
        }
        const count = result.count ?? ids.length;
        removeMany(result.ids ?? ids);
        setMessage({
          type: "success",
          text: `${count} ${count === 1 ? "faculty member" : "faculty members"} deleted successfully.`,
        });
        setDeleteTarget(null);
        router.refresh();
      }
    } catch {
      setDeleteError("The delete could not be completed. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  const filterQuery = (pageTarget: number) => ({
    q: query,
    designation: designation || "all",
    status,
    sort,
    page: String(pageTarget),
  });

  return (
    <div className="space-y-4">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold text-primary-700">Content</p>
          <h2 className="mt-1 text-2xl font-bold text-gray-950">Faculty Management</h2>
          <p className="mt-2 text-sm text-gray-600">
            Manage staff profiles displayed on the public faculty page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className={primaryButtonClass} onClick={openAdd} type="button">
            <Plus aria-hidden className="size-4" />
            Add Faculty
          </button>
          <Link className={secondaryButtonClass} href="/faculty" target="_blank">
            <ExternalLink aria-hidden className="size-4" />
            View Public Page
          </Link>
        </div>
      </section>

      {message ? (
        <div
          aria-live="polite"
          className={`flex items-start justify-between gap-3 rounded-lg border px-4 py-3 text-sm ${
            message.type === "success"
              ? "border-secondary-200 bg-secondary-50 text-secondary-900"
              : "border-amber-200 bg-amber-50 text-amber-950"
          }`}
          role="status"
        >
          <span className="flex items-center gap-2">
            {message.type === "success" ? (
              <CheckCircle2 aria-hidden className="size-4 shrink-0" />
            ) : (
              <AlertTriangle aria-hidden className="size-4 shrink-0" />
            )}
            {message.text}
          </span>
          <button
            aria-label="Dismiss notification"
            className="rounded p-0.5 hover:bg-black/5"
            onClick={() => setMessage(null)}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      ) : null}

      <form
        action="/admin/faculty"
        className="rounded-lg border border-gray-200 bg-white p-3"
        method="get"
      >
        <div className="grid gap-2 md:grid-cols-[minmax(180px,1fr)_180px_150px_170px_auto]">
          <div className="relative">
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <input
              className="h-10 w-full rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              defaultValue={query}
              name="q"
              placeholder="Search name, department, AU-FIN"
            />
          </div>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            defaultValue={designation || "all"}
            name="designation"
          >
            <option value="all">All designations</option>
            {designations.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            defaultValue={status}
            name="status"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Unpublished</option>
          </select>
          <select
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            defaultValue={sort}
            name="sort"
          >
            <option value="updated">Recently updated</option>
            <option value="name">Name (A–Z)</option>
            <option value="designation">Designation</option>
            <option value="order">Display order</option>
          </select>
          <button className={secondaryButtonClass} type="submit">
            Apply
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <span>
            {total} {total === 1 ? "profile" : "profiles"}
            {pageCount > 1 ? ` · Page ${page} of ${pageCount}` : ""}
          </span>
          {hasActiveFilters ? (
            <Link className="font-semibold text-primary-700 hover:underline" href="/admin/faculty">
              Clear filters
            </Link>
          ) : null}
          {rangeStart > 0 && rangeEnd > 0 ? (
            <span className="text-gray-400">· Showing {rangeStart}–{rangeEnd}</span>
          ) : null}
        </div>
      </form>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-lg border border-gray-200 bg-white px-3 py-2">
          <label className="flex cursor-pointer items-center gap-2 text-xs font-semibold text-gray-700">
            <SelectAllCheckbox
              checked={allOnPageSelected}
              disabled={!members.length || busy}
              indeterminate={someOnPageSelected}
              label="Select all faculty members on this page"
              onChange={(checked) => selectMany(pageIds, checked)}
            />
            Select all on this page
          </label>
          <span aria-live="polite" className="text-xs text-gray-600">
            <strong className="text-gray-900">{selectedCount}</strong> selected
            {selectedOnOtherPages > 0 ? ` · ${selectedOnOtherPages} on other pages` : ""}
          </span>
          <div className="ml-auto flex flex-wrap items-center gap-1.5">
            {canPublish ? (
              <>
                <button
                  className={`${secondaryButtonClass} min-h-9 px-3 text-xs`}
                  disabled={!selectedCount || busy}
                  onClick={() => runBulk("publish")}
                  type="button"
                >
                  {pendingAction === "publish" ? (
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                  ) : (
                    <Eye aria-hidden className="size-4" />
                  )}
                  Publish
                </button>
                <button
                  className={`${secondaryButtonClass} min-h-9 px-3 text-xs`}
                  disabled={!selectedCount || busy}
                  onClick={() => runBulk("unpublish")}
                  type="button"
                >
                  {pendingAction === "unpublish" ? (
                    <LoaderCircle aria-hidden className="size-4 animate-spin" />
                  ) : (
                    <EyeOff aria-hidden className="size-4" />
                  )}
                  Unpublish
                </button>
                <button
                  className={`${secondaryButtonClass} min-h-9 px-3 text-xs text-red-700 hover:bg-red-50`}
                  disabled={!selectedCount || busy}
                  onClick={() => {
                  if (selectedCount === 1) {
                    const targetId = selectedIds[0];
                    const member = members.find((m) => m.id === targetId);
                    if (member) {
                      setDeleteTarget({ mode: "single", member });
                      return;
                    }
                  }
                  setDeleteTarget({ mode: "bulk", ids: selectedIds });
                }}
                  type="button"
                >
                  <Trash2 aria-hidden className="size-4" />
                  Delete
                </button>
              </>
            ) : (
              <span className="text-[11px] text-gray-500">Admin only</span>
            )}
            <button
              className={`${secondaryButtonClass} min-h-9 px-3 text-xs`}
              disabled={!selectedCount || busy}
              onClick={clear}
              type="button"
            >
              <X aria-hidden className="size-4" />
              Clear
            </button>
          </div>
        </div>

        {members.length ? (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                  <th className="w-10 px-3 py-2" />
                  <th className="px-3 py-2">Faculty</th>
                  <th className="px-3 py-2">Designation / Dept</th>
                  <th className="px-3 py-2">Order</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {members.map((member) => (
                  <tr key={member.id} className="align-top">
                    <td className="px-3 py-2">
                      <label className="flex cursor-pointer items-center">
                        <input
                          aria-label={`Select ${member.name}`}
                          checked={selected.has(member.id)}
                          className="size-4 accent-primary-700"
                          disabled={busy}
                          onChange={() => toggle(member.id)}
                          type="checkbox"
                        />
                      </label>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-2">
                        <PhotoAvatar member={member} />
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">
                            {member.email ?? member.phone ?? "—"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <p className="text-sm text-gray-900">{member.designation}</p>
                      <p className="text-xs text-gray-500">
                        {member.department ?? "—"}
                        <span className="block text-gray-400">
                          {member.auFin ? `AU-FIN ${member.auFin}` : "No AU-FIN"} ·{" "}
                          {member.aicteId ? `AICTE ${member.aicteId}` : "No AICTE"}
                        </span>
                        {member.group ? (
                          <span className="mt-0.5 block text-primary-600">
                            Group: {member.group}
                          </span>
                        ) : null}
                      </p>
                    </td>
                    <td className="px-3 py-2 text-sm text-gray-600">{member.sortOrder}</td>
                    <td className="px-3 py-2">
                      <span
                        className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-bold ${
                          member.isPublished
                            ? "bg-secondary-50 text-secondary-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {member.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right">
                      <div className="flex justify-end gap-1">
                        <button
                          className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                          onClick={() => openEdit(member)}
                          type="button"
                        >
                          <Pencil aria-hidden className="size-4" />
                          Edit
                        </button>
                        {canPublish ? (
                          <button
                            className={`${ghostDangerClass} size-8`}
                            onClick={() => setDeleteTarget({ mode: "single", member })}
                            type="button"
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <ul className="divide-y divide-gray-100 md:hidden">
              {members.map((member) => (
                <li key={member.id} className="p-3">
                  <div className="flex items-start gap-2">
                    <label className="mt-1 flex cursor-pointer items-center">
                      <input
                        aria-label={`Select ${member.name}`}
                        checked={selected.has(member.id)}
                        className="size-4 accent-primary-700"
                        disabled={busy}
                        onChange={() => toggle(member.id)}
                        type="checkbox"
                      />
                    </label>
                    <PhotoAvatar className="size-11" member={member} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900">{member.name}</p>
                          <p className="truncate text-xs text-gray-600">
                            {member.designation}
                            {member.department ? ` · ${member.department}` : ""}
                          </p>
                          <p className="mt-1 text-[11px] text-gray-400">
                            {member.auFin ? `AU-FIN ${member.auFin}` : "No AU-FIN"} ·{" "}
                            {member.aicteId ? `AICTE ${member.aicteId}` : "No AICTE"}
                          </p>
                          {member.group ? (
                            <p className="mt-1 text-[11px] text-primary-600">
                              Group: {member.group}
                            </p>
                          ) : null}
                          <p className="mt-1 text-[11px] text-gray-500">
                            Order {member.sortOrder} ·{" "}
                            <span
                              className={`font-bold ${
                                member.isPublished
                                  ? "text-secondary-800"
                                  : "text-gray-600"
                              }`}
                            >
                              {member.isPublished ? "Published" : "Unpublished"}
                            </span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                            onClick={() => openEdit(member)}
                            type="button"
                          >
                            <Pencil aria-hidden className="size-4" />
                          </button>
                          {canPublish ? (
                            <button
                              className={`${ghostDangerClass} size-8`}
                              onClick={() => setDeleteTarget({ mode: "single", member })}
                              type="button"
                            >
                              <Trash2 aria-hidden className="size-4" />
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
            <p className="font-semibold text-gray-800">No faculty members</p>
            <p className="mt-1 text-sm text-gray-500">
              {hasActiveFilters
                ? "No faculty members match your filters."
                : "No faculty members yet. Add the first profile."}
            </p>
            {hasActiveFilters ? (
              <Link className={`${secondaryButtonClass} mt-3`} href="/admin/faculty">
                Clear filters
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {pageCount > 1 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-500">
          <p>
            Showing {rangeStart}–{rangeEnd} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Link
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-300 px-3 text-xs font-bold ${page <= 1 ? "cursor-not-allowed opacity-50" : "hover:bg-white"}`}
              href={{ pathname: "/admin/faculty", query: filterQuery(page - 1) }}
              tabIndex={page <= 1 ? -1 : undefined}
            >
              Previous
            </Link>
            <span className="text-gray-400">Page {page} of {pageCount}</span>
            <Link
              className={`inline-flex min-h-9 items-center gap-1.5 rounded-md border border-gray-300 px-3 text-xs font-bold ${page >= pageCount ? "cursor-not-allowed opacity-50" : "hover:bg-white"}`}
              href={{ pathname: "/admin/faculty", query: filterQuery(page + 1) }}
              tabIndex={page >= pageCount ? -1 : undefined}
            >
              Next
            </Link>
          </div>
        </div>
      ) : null}

      {editor ? (
        <Modal
          onClose={closeEditor}
          title={editor.mode === "add" ? "Add faculty member" : "Edit faculty member"}
        >
          {editor.mode === "edit" && editor.member.isPublished && !canPublish ? (
            <div className="mt-4 space-y-3 text-sm text-gray-600">
              <p>
                Published profiles can only be changed by an administrator. Unpublish the profile
                first if you need to make changes.
              </p>
              <div className="flex justify-end">
                <button className={secondaryButtonClass} onClick={closeEditor} type="button">
                  Close
                </button>
              </div>
            </div>
          ) : (
            <FacultyForm
              canPublish={canPublish}
              groups={groups}
              member={editor.mode === "edit" ? editor.member : undefined}
              onRequestClose={closeEditor}
              onSaved={handleSaved}
              onToggleDirty={setFormDirty}
            />
          )}
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          closeDisabled={busy}
          maxWidthClass="max-w-md"
          onClose={() => {
            if (!busy) {
              setDeleteTarget(null);
              setDeleteError("");
            }
          }}
          title={deleteTarget.mode === "single" ? "Delete faculty member?" : `Delete ${deleteTarget.ids.length} faculty members?`}
        >
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              {deleteTarget.mode === "single"
                ? `“${deleteTarget.member.name}” will be permanently deleted.`
                : `The selected ${deleteTarget.ids.length} faculty members will be permanently deleted.`}
              {" "}This cannot be undone.
            </p>
            {deleteTarget.mode === "single" && deleteTarget.member.photo ? (
              <p className="text-xs text-gray-500">
                The photograph will be removed from storage if no other content uses it.
              </p>
            ) : null}
            {deleteError ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                {deleteError}
              </p>
            ) : null}
            <div className="flex flex-wrap justify-end gap-3">
              <button
                className={secondaryButtonClass}
                disabled={busy}
                onClick={() => {
                  if (!busy) {
                    setDeleteTarget(null);
                    setDeleteError("");
                  }
                }}
                type="button"
              >
                Cancel
              </button>
              <button
                className={primaryButtonClass}
                disabled={busy}
                onClick={confirmDelete}
                style={{ background: "#dc2626" }}
                type="button"
              >
                {pendingAction === "delete" ? (
                  <LoaderCircle aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Trash2 aria-hidden className="size-4" />
                )}
                {pendingAction === "delete" ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
