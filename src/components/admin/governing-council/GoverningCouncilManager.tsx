"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ExternalLink,
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
  deleteGoverningCouncilMember,
  moveGoverningCouncilMember,
  saveGoverningCouncilMember,
  type GoverningCouncilResult,
} from "@/src/app/admin/(protected)/governing-council/actions";

export type GoverningCouncilRow = {
  id: number;
  name: string;
  role: string;
  imagePath: string | null;
  imageAlt: string | null;
  biography: string | null;
  sortOrder: number;
  isPublished: boolean;
};

const inputClass =
  "mt-1.5 min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

const textareaClass = `${inputClass} min-h-24 resize-y`;

const primaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-3.5 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

const ghostButtonClass =
  "grid size-9 place-items-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

const ghostDangerClass =
  "grid size-9 place-items-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50";

type ActionMessage = { type: "success" | "error"; text: string };

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

function useCouncilAction(
  action: (formData: FormData) => Promise<GoverningCouncilResult>,
  onSuccess?: (message: string) => void,
) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
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
      onSuccess?.(result.message);
    } catch (submitError) {
      console.error("Council action failed", submitError);
      setError("The change could not be completed. Please try again.");
      setPending(false);
    }
  };

  return { pending, error, submit };
}

function CouncilMemberForm({
  member,
  canPublish,
  onSaved,
  onRequestClose,
}: {
  member?: GoverningCouncilRow;
  canPublish: boolean;
  onSaved: (message: string) => void;
  onRequestClose: () => void;
}) {
  const [imagePath, setImagePath] = useState(member?.imagePath ?? "");
  const form = useCouncilAction(saveGoverningCouncilMember, onSaved);

  return (
    <form className="mt-4 space-y-4" onSubmit={form.submit}>
      {member ? <input name="id" type="hidden" value={member.id} /> : null}
      <input name="imagePath" type="hidden" value={imagePath} />

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Member details
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="council-name" label="Full name" required>
            <input
              className={inputClass}
              defaultValue={member?.name ?? ""}
              id="council-name"
              maxLength={191}
              name="name"
              required
            />
          </Field>
          <Field id="council-role" label="Designation / Role" required>
            <input
              className={inputClass}
              defaultValue={member?.role ?? ""}
              id="council-role"
              maxLength={191}
              name="role"
              required
            />
          </Field>
        </div>

        <ImageUploadField
          category="council"
          compact
          label="Photograph"
          onChange={setImagePath}
          value={imagePath}
        />

        <Field id="council-alt" label="Photo alt text">
          <input
            className={inputClass}
            defaultValue={member?.imageAlt ?? ""}
            id="council-alt"
            maxLength={255}
            name="imageAlt"
            placeholder="Describe the photograph for screen readers"
          />
        </Field>

        <label className="block text-xs font-semibold text-gray-600" htmlFor="council-bio">
          Biography
          <textarea
            className={textareaClass}
            defaultValue={member?.biography ?? ""}
            id="council-bio"
            maxLength={5000}
            name="biography"
          />
        </label>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-xs font-bold uppercase tracking-wide text-gray-500">
          Publication and ordering
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field id="council-order" label="Display order" required>
            <input
              className={inputClass}
              defaultValue={member?.sortOrder ?? 0}
              id="council-order"
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
                  defaultChecked={member?.isPublished ?? true}
                  name="isPublished"
                  type="checkbox"
                />
                Published on the public About page
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
          {member ? "Save changes" : "Add member"}
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

function PhotoThumb({ member }: { member: GoverningCouncilRow }) {
  if (member.imagePath) {
    return (
      <Image
        alt=""
        className="size-10 rounded object-cover"
        height={64}
        src={member.imagePath}
        unoptimized
        width={64}
      />
    );
  }
  return (
    <span className="grid size-10 place-items-center rounded bg-primary-50 text-xs font-bold text-primary-700">
      {member.name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export default function GoverningCouncilManager({
  canPublish,
  members,
}: {
  canPublish: boolean;
  members: GoverningCouncilRow[];
}) {
  const router = useRouter();
  const [editor, setEditor] = useState<
    { mode: "add" } | { mode: "edit"; member: GoverningCouncilRow } | null
  >(null);
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GoverningCouncilRow | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | "published" | "draft">("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return members.filter((member) => {
      if (status === "published" && !member.isPublished) return false;
      if (status === "draft" && member.isPublished) return false;
      if (!needle) return true;
      return (
        member.name.toLowerCase().includes(needle) ||
        member.role.toLowerCase().includes(needle)
      );
    });
  }, [members, query, status]);

  const hasFilters = query.trim().length > 0 || status !== "all";

  const markMoved = (text: string) => {
    setMessage({ type: "success", text });
    router.refresh();
  };

  const move = async (member: GoverningCouncilRow, direction: "up" | "down") => {
    if (busyId !== null) return;
    setBusyId(member.id);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("id", String(member.id));
      formData.set("direction", direction);
      const result = await moveGoverningCouncilMember(formData);
      if (!result.success) {
        setMessage({ type: "error", text: result.error });
      } else {
        markMoved("Order updated.");
      }
    } catch {
      setMessage({ type: "error", text: "The member could not be reordered." });
    } finally {
      setBusyId(null);
    }
  };

  const togglePublished = async (member: GoverningCouncilRow) => {
    if (busyId !== null) return;
    setBusyId(member.id);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("id", String(member.id));
      formData.set("name", member.name);
      formData.set("role", member.role);
      formData.set("imagePath", member.imagePath ?? "");
      formData.set("imageAlt", member.imageAlt ?? "");
      formData.set("biography", member.biography ?? "");
      formData.set("sortOrder", String(member.sortOrder));
      if (!member.isPublished) formData.set("isPublished", "on");
      const result = await saveGoverningCouncilMember(formData);
      if (!result.success) {
        setMessage({ type: "error", text: result.error });
      } else {
        markMoved(member.isPublished ? "Member unpublished." : "Member published.");
      }
    } catch {
      setMessage({ type: "error", text: "The status could not be changed." });
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    setDeleteError("");
    try {
      const formData = new FormData();
      formData.set("id", String(deleteTarget.id));
      const result = await deleteGoverningCouncilMember(formData);
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      setMessage({ type: "success", text: `"${deleteTarget.name}" was removed.` });
      setDeleteTarget(null);
      router.refresh();
    } catch {
      setDeleteError("The member could not be deleted. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleSaved = (text: string) => {
    setMessage({ type: "success", text });
    setEditor(null);
    router.refresh();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              aria-hidden
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
            />
            <input
              aria-label="Search council members"
              className="h-10 w-64 rounded-md border border-gray-300 pl-9 pr-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search name or role"
              value={query}
            />
          </div>
          <select
            aria-label="Filter by publication status"
            className="h-10 rounded-md border border-gray-300 bg-white px-3 text-sm outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100"
            onChange={(event) =>
              setStatus(event.target.value as "all" | "published" | "draft")
            }
            value={status}
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Unpublished</option>
          </select>
          <span className="text-xs text-gray-500">
            {filtered.length} {filtered.length === 1 ? "member" : "members"}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            className={primaryButtonClass}
            onClick={() => {
              setEditor({ mode: "add" });
              setMessage(null);
            }}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
            Add Council Member
          </button>
          <Link className={secondaryButtonClass} href="/about" target="_blank">
            <ExternalLink aria-hidden className="size-4" />
            View Public Page
          </Link>
        </div>
      </div>

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

      {filtered.length ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="hidden w-full text-sm md:table">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">Member</th>
                <th className="px-3 py-2">Role</th>
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((member) => (
                <tr key={member.id} className="align-middle">
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <PhotoThumb member={member} />
                      <p className="font-semibold text-gray-900">{member.name}</p>
                    </div>
                  </td>
                  <td className="px-3 py-2 text-gray-700">{member.role}</td>
                  <td className="px-3 py-2 text-gray-600">{member.sortOrder}</td>
                  <td className="px-3 py-2">
                    <button
                      className={`inline-flex rounded-sm px-2 py-0.5 text-xs font-bold ${
                        member.isPublished
                          ? "bg-secondary-50 text-secondary-800"
                          : "bg-gray-100 text-gray-600"
                      } ${canPublish ? "hover:opacity-80" : "cursor-default"}`}
                      disabled={!canPublish || busyId !== null}
                      onClick={() => togglePublished(member)}
                      type="button"
                    >
                      {member.isPublished ? "Published" : "Unpublished"}
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label={`Move ${member.name} up`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(member, "up")}
                        type="button"
                      >
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                      <button
                        aria-label={`Move ${member.name} down`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(member, "down")}
                        type="button"
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                      <button
                        aria-label={`Edit ${member.name}`}
                        className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                        onClick={() => {
                          setEditor({ mode: "edit", member });
                          setMessage(null);
                        }}
                        type="button"
                      >
                        <Pencil aria-hidden className="size-4" />
                        Edit
                      </button>
                      {canPublish ? (
                        <button
                          aria-label={`Delete ${member.name}`}
                          className={`${ghostDangerClass} size-8`}
                          onClick={() => {
                            setDeleteTarget(member);
                            setDeleteError("");
                          }}
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
            {filtered.map((member) => (
              <li key={member.id} className="p-3">
                <div className="flex items-start gap-3">
                  <PhotoThumb member={member} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-gray-900">{member.name}</p>
                    <p className="truncate text-xs text-gray-600">{member.role}</p>
                    <p className="mt-1 text-[11px] text-gray-500">
                      Order {member.sortOrder} ·{" "}
                      <span
                        className={`font-bold ${
                          member.isPublished ? "text-secondary-800" : "text-gray-600"
                        }`}
                      >
                        {member.isPublished ? "Published" : "Unpublished"}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-1">
                      <button
                        aria-label={`Move ${member.name} up`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(member, "up")}
                        type="button"
                      >
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                      <button
                        aria-label={`Move ${member.name} down`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(member, "down")}
                        type="button"
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                      <button
                        className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                        onClick={() => {
                          setEditor({ mode: "edit", member });
                          setMessage(null);
                        }}
                        type="button"
                      >
                        <Pencil aria-hidden className="size-4" />
                        Edit
                      </button>
                      {canPublish ? (
                        <>
                          <button
                            className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                            disabled={busyId !== null}
                            onClick={() => togglePublished(member)}
                            type="button"
                          >
                            {member.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            aria-label={`Delete ${member.name}`}
                            className={`${ghostDangerClass} size-8`}
                            onClick={() => {
                              setDeleteTarget(member);
                              setDeleteError("");
                            }}
                            type="button"
                          >
                            <Trash2 aria-hidden className="size-4" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <p className="font-semibold text-gray-800">
            {hasFilters ? "No members match your filters" : "No council members"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {hasFilters
              ? "Try a different search or status."
              : "Add the first governing council member to get started."}
          </p>
        </div>
      )}

      {editor ? (
        <Modal
          onClose={() => setEditor(null)}
          title={editor.mode === "add" ? "Add council member" : "Edit council member"}
        >
          <CouncilMemberForm
            canPublish={canPublish}
            member={editor.mode === "edit" ? editor.member : undefined}
            onRequestClose={() => setEditor(null)}
            onSaved={handleSaved}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          closeDisabled={deleting}
          maxWidthClass="max-w-md"
          onClose={() => {
            if (!deleting) {
              setDeleteTarget(null);
              setDeleteError("");
            }
          }}
          title="Delete council member?"
        >
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              &ldquo;{deleteTarget.name}&rdquo; will be permanently removed from
              the public About page. This cannot be undone.
            </p>
            {deleteTarget.imagePath?.startsWith("/uploads/") ? (
              <p className="text-xs text-gray-500">
                The photograph will be removed from storage if no other content
                uses it.
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
                disabled={deleting}
                onClick={() => {
                  if (!deleting) {
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
                disabled={deleting}
                onClick={confirmDelete}
                style={{ background: "#dc2626" }}
                type="button"
              >
                {deleting ? (
                  <LoaderCircle aria-hidden className="size-4 animate-spin" />
                ) : (
                  <Trash2 aria-hidden className="size-4" />
                )}
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </div>
  );
}
