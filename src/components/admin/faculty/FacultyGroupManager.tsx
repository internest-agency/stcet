"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
  Trash2,
  Users,
  X,
} from "lucide-react";
import {
  deleteFacultyGroup,
  moveFacultyGroup,
  saveFacultyGroup,
} from "@/src/app/admin/(protected)/faculty/groups/actions";

export type FacultyGroupRow = {
  id: number;
  name: string;
  slug: string;
  sortOrder: number;
  memberCount: number;
};

const inputClass =
  "mt-1.5 min-h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";

const primaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-3.5 text-sm font-bold text-white hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50";

const secondaryButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-md border border-gray-300 bg-white px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";

const ghostButtonClass =
  "grid size-9 place-items-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40";

const ghostDangerClass =
  "grid size-9 place-items-center rounded-md text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50";

type ActionMessage = { type: "success" | "error"; text: string };

function Modal({
  title,
  children,
  onClose,
  maxWidthClass = "max-w-md",
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

function GroupForm({
  group,
  onSaved,
  onRequestClose,
}: {
  group?: FacultyGroupRow;
  onSaved: (message: string) => void;
  onRequestClose: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await saveFacultyGroup(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      onSaved(result.message);
    } catch {
      setError("The group could not be saved. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form className="mt-4 space-y-4" onSubmit={submit}>
      {group ? <input name="id" type="hidden" value={group.id} /> : null}

      <label className="block text-xs font-semibold text-gray-600" htmlFor="group-name">
        Group name *
        <input
          className={inputClass}
          defaultValue={group?.name ?? ""}
          id="group-name"
          maxLength={191}
          name="name"
          placeholder="e.g. Department of Computer Science"
          required
        />
      </label>

      <label className="block text-xs font-semibold text-gray-600" htmlFor="group-order">
        Display order *
        <input
          className={inputClass}
          defaultValue={group?.sortOrder ?? 0}
          id="group-order"
          max={99999}
          min={0}
          name="sortOrder"
          required
          type="number"
        />
      </label>
      <p className="text-xs text-gray-500">
        Lower numbers appear first on the public Faculty page.
      </p>

      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          className={secondaryButtonClass}
          disabled={pending}
          onClick={onRequestClose}
          type="button"
        >
          Cancel
        </button>
        <button className={primaryButtonClass} disabled={pending} type="submit">
          {pending ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <Save aria-hidden className="size-4" />
          )}
          {group ? "Save changes" : "Add group"}
        </button>
      </div>
    </form>
  );
}

export default function FacultyGroupManager({
  canDelete,
  groups,
}: {
  canDelete: boolean;
  groups: FacultyGroupRow[];
}) {
  const router = useRouter();
  const [editor, setEditor] = useState<
    { mode: "add" } | { mode: "edit"; group: FacultyGroupRow } | null
  >(null);
  const [message, setMessage] = useState<ActionMessage | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FacultyGroupRow | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);

  const move = async (group: FacultyGroupRow, direction: "up" | "down") => {
    if (busyId !== null) return;
    setBusyId(group.id);
    setMessage(null);
    try {
      const formData = new FormData();
      formData.set("id", String(group.id));
      formData.set("direction", direction);
      const result = await moveFacultyGroup(formData);
      if (!result.success) {
        setMessage({ type: "error", text: result.error });
      } else {
        setMessage({ type: "success", text: "Group order updated." });
        router.refresh();
      }
    } catch {
      setMessage({ type: "error", text: "The group could not be reordered." });
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
      const result = await deleteFacultyGroup(formData);
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      setMessage({ type: "success", text: result.message });
      setDeleteTarget(null);
      router.refresh();
    } catch {
      setDeleteError("The group could not be deleted. Please try again.");
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
    <div className="space-y-5">
      <section className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-primary-700">Faculty</p>
          <h2 className="mt-1 text-2xl font-bold">Faculty Groups</h2>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Groups control the section headings and their order on the public
            Faculty page. Faculty members are assigned to a group from the
            faculty editor. Members without a group appear under{" "}
            <span className="font-semibold text-gray-700">Other Faculty</span>.
          </p>
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
            Add Group
          </button>
          <Link className={secondaryButtonClass} href="/admin/faculty">
            <Users aria-hidden className="size-4" />
            Manage Faculty
          </Link>
          <Link className={secondaryButtonClass} href="/faculties" target="_blank">
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

      {groups.length ? (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="px-3 py-2">Group</th>
                <th className="px-3 py-2 text-center">Faculty</th>
                <th className="px-3 py-2 text-center">Display order</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {groups.map((group) => (
                <tr key={group.id} className="align-middle">
                  <td className="px-3 py-2 font-semibold text-gray-900">
                    {group.name}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-600">
                    {group.memberCount}
                  </td>
                  <td className="px-3 py-2 text-center text-gray-600">
                    {group.sortOrder}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <button
                        aria-label={`Move ${group.name} up`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(group, "up")}
                        type="button"
                      >
                        <ArrowUp aria-hidden className="size-4" />
                      </button>
                      <button
                        aria-label={`Move ${group.name} down`}
                        className={ghostButtonClass}
                        disabled={busyId !== null}
                        onClick={() => move(group, "down")}
                        type="button"
                      >
                        <ArrowDown aria-hidden className="size-4" />
                      </button>
                      <button
                        aria-label={`Edit ${group.name}`}
                        className={`${secondaryButtonClass} min-h-8 px-2 text-xs`}
                        onClick={() => {
                          setEditor({ mode: "edit", group });
                          setMessage(null);
                        }}
                        type="button"
                      >
                        <Pencil aria-hidden className="size-4" />
                        Edit
                      </button>
                      {canDelete ? (
                        <button
                          aria-label={`Delete ${group.name}`}
                          className={`${ghostDangerClass} size-8`}
                          onClick={() => {
                            setDeleteTarget(group);
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
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <p className="font-semibold text-gray-800">No faculty groups yet</p>
          <p className="mt-1 text-sm text-gray-500">
            Add a group to start organising the public Faculty page.
          </p>
        </div>
      )}

      {editor ? (
        <Modal
          onClose={() => setEditor(null)}
          title={editor.mode === "add" ? "Add faculty group" : "Edit faculty group"}
        >
          <GroupForm
            group={editor.mode === "edit" ? editor.group : undefined}
            onRequestClose={() => setEditor(null)}
            onSaved={handleSaved}
          />
        </Modal>
      ) : null}

      {deleteTarget ? (
        <Modal
          closeDisabled={deleting}
          onClose={() => {
            if (!deleting) {
              setDeleteTarget(null);
              setDeleteError("");
            }
          }}
          title="Delete faculty group?"
        >
          <div className="mt-4 space-y-3 text-sm text-gray-600">
            <p>
              &ldquo;{deleteTarget.name}&rdquo; will be permanently removed.
            </p>
            {deleteTarget.memberCount > 0 ? (
              <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
                This group has {deleteTarget.memberCount}{" "}
                {deleteTarget.memberCount === 1 ? "member" : "members"} assigned.
                Reassign them to another group first — the server will block the
                delete until it is empty.
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
