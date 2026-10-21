"use client";

import Image from "next/image";
import {
  useEffect,
  useId,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import {
  deleteLeadershipItem,
  saveLeadership,
  saveLeadershipItem,
  type PlacementResult,
} from "@/src/app/admin/(protected)/placements/actions";

export type Leadership = {
  id: number;
  eyebrow: string | null;
  heading: string | null;
  description: string | null;
  officerName: string | null;
  officerDesignation: string | null;
  officerImagePath: string | null;
  officerImageAlt: string | null;
  isPublished: boolean;
} | null;

export type LeadershipItem = {
  id: number;
  title: string;
  description: string | null;
  sortOrder: number;
  isPublished: boolean;
};

/* ------------------------------------------------------------------ */
/* Shared primitives                                                   */
/* ------------------------------------------------------------------ */

const input =
  "mt-1 min-h-9 w-full rounded-md border border-gray-300 bg-white px-2.5 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";
const label = "block text-xs font-semibold text-gray-600";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3.5 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center rounded-md border border-gray-300 px-3.5 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60";
const dangerButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-red-600 px-3.5 text-sm font-bold text-white hover:bg-red-700 disabled:opacity-60";
const rowAction =
  "grid size-8 place-items-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700";

/** Wire a result-returning server action to a form, keeping it mounted on failure. */
function useLeadershipAction(
  action: (formData: FormData) => Promise<PlacementResult>,
  onSuccess?: (message: string) => void,
) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setPending(true);
    setError("");
    try {
      const result = await action(formData);
      if (result.success) {
        onSuccess?.(result.message);
        router.refresh();
      } else {
        setError(result.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return { pending, error, submit };
}

function SaveButton({
  pending,
  children,
}: {
  pending: boolean;
  children: string;
}) {
  return (
    <button className={primaryButton} disabled={pending} type="submit">
      {pending ? (
        <Loader2 aria-hidden className="size-4 animate-spin" />
      ) : (
        <Save aria-hidden className="size-4" />
      )}
      {children}
    </button>
  );
}

function FormError({ error }: { error: string }) {
  if (!error) return null;
  return (
    <p
      aria-live="polite"
      className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"
    >
      {error}
    </p>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: "gray" | "green";
  children: ReactNode;
}) {
  const tones = {
    gray: "bg-gray-100 text-gray-500",
    green: "bg-secondary-50 text-secondary-800",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-950/50 p-4 sm:items-center"
      role="dialog"
    >
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-bold text-gray-900" id={titleId}>
            {title}
          </h3>
          <button
            aria-label="Close dialog"
            className="grid size-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-700"
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

function Panel({
  title,
  description,
  action,
  children,
}: {
  title: string;
  description: string;
  action: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 px-4 py-3">
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-gray-900">{title}</h3>
          <p className="mt-0.5 text-xs text-gray-500">{description}</p>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

function EmptyState({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
      {children}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/* Leadership section form                                             */
/* ------------------------------------------------------------------ */

function SectionForm({
  record,
  canPublish,
  onCancel,
  onSaved,
}: {
  record: NonNullable<Leadership>;
  canPublish: boolean;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useLeadershipAction(saveLeadership, onSaved);
  const [imagePath, setImagePath] = useState(record.officerImagePath ?? "");
  const [description, setDescription] = useState(record.description ?? "");

  return (
    <form className="mt-4 grid gap-4" onSubmit={form.submit}>
      <input name="officerImagePath" type="hidden" value={imagePath} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Eyebrow
          <input
            className={input}
            defaultValue={record.eyebrow ?? ""}
            name="eyebrow"
            placeholder="Placement Leadership"
          />
        </label>
        <label className={label}>
          Heading
          <input
            className={input}
            defaultValue={record.heading ?? ""}
            name="heading"
            placeholder="Guiding Students Towards Careers."
          />
        </label>
      </div>

      <RichTextEditor
        label="Description"
        minHeight={140}
        name="description"
        onChange={setDescription}
        value={description}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Placement officer name
          <input
            className={input}
            defaultValue={record.officerName ?? ""}
            name="officerName"
          />
        </label>
        <label className={label}>
          Designation
          <input
            className={input}
            defaultValue={record.officerDesignation ?? ""}
            name="officerDesignation"
          />
        </label>
      </div>

      <ImageUploadField
        category="placements"
        compact
        label="Officer photo"
        onChange={setImagePath}
        value={imagePath}
      />

      <label className={label}>
        Photo alt text
        <input
          className={input}
          defaultValue={record.officerImageAlt ?? ""}
          name="officerImageAlt"
          placeholder="Name, role"
        />
      </label>

      {canPublish ? (
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input
            className="size-4 accent-primary-700"
            defaultChecked={record.isPublished}
            name="isPublished"
            type="checkbox"
          />
          Published
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}

      <FormError error={form.error} />

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          className={ghostButton}
          disabled={form.pending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <SaveButton pending={form.pending}>Save section</SaveButton>
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Qualification / experience items                                    */
/* ------------------------------------------------------------------ */

function ItemForm({
  record,
  canPublish,
  onCancel,
  onSaved,
}: {
  record?: LeadershipItem;
  canPublish: boolean;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useLeadershipAction(saveLeadershipItem, onSaved);

  return (
    <form className="mt-4 grid gap-4" onSubmit={form.submit}>
      {record ? <input name="id" type="hidden" value={record.id} /> : null}

      <div className="grid gap-4 sm:grid-cols-3">
        <label className={`${label} sm:col-span-2`}>
          Title
          <input
            className={input}
            defaultValue={record?.title ?? ""}
            name="title"
            required
          />
        </label>
        <label className={label}>
          Display order
          <input
            className={input}
            defaultValue={record?.sortOrder ?? 0}
            min="0"
            name="sortOrder"
            type="number"
          />
        </label>
      </div>

      <label className={label}>
        Description{" "}
        <span className="font-normal text-gray-400">(optional)</span>
        <textarea
          className={input}
          defaultValue={record?.description ?? ""}
          name="description"
          rows={2}
        />
      </label>

      {canPublish ? (
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input
            className="size-4 accent-primary-700"
            defaultChecked={record?.isPublished ?? false}
            name="isPublished"
            type="checkbox"
          />
          Published
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}

      <FormError error={form.error} />

      <div className="flex justify-end gap-3 border-t border-gray-100 pt-4">
        <button
          className={ghostButton}
          disabled={form.pending}
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <SaveButton pending={form.pending}>
          {record ? "Save item" : "Add item"}
        </SaveButton>
      </div>
    </form>
  );
}

function ItemRow({
  item,
  canPublish,
  onEdit,
  onDelete,
}: {
  item: LeadershipItem;
  canPublish: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {item.title}
          </p>
          <StatusBadge tone={item.isPublished ? "green" : "gray"}>
            {item.isPublished ? "Published" : "Draft"}
          </StatusBadge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {item.description ? (
            <span className="line-clamp-1 min-w-0 max-w-full">
              {item.description}
            </span>
          ) : null}
          <span className="text-gray-400">Order #{item.sortOrder}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          aria-label={`Edit ${item.title}`}
          className={rowAction}
          onClick={onEdit}
          title="Edit"
          type="button"
        >
          <Pencil aria-hidden className="size-4" />
        </button>
        {canPublish ? (
          <button
            aria-label={`Delete ${item.title}`}
            className="grid size-8 place-items-center rounded-md border border-gray-200 text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
            onClick={onDelete}
            title="Delete"
            type="button"
          >
            <Trash2 aria-hidden className="size-4" />
          </button>
        ) : null}
      </div>
    </article>
  );
}

function DeleteDialog({
  id,
  name,
  onClose,
  onDeleted,
}: {
  id: number;
  name: string;
  onClose: () => void;
  onDeleted: (message: string) => void;
}) {
  const form = useLeadershipAction(deleteLeadershipItem, onDeleted);

  return (
    <Modal onClose={onClose} title="Delete item?">
      <form className="mt-4" onSubmit={form.submit}>
        <input name="id" type="hidden" value={id} />
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle aria-hidden className="size-6 shrink-0" />
          <p className="text-sm font-semibold text-gray-800">{name}</p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          This permanently deletes the item and cannot be undone.
        </p>
        <div className="mt-4">
          <FormError error={form.error} />
        </div>
        <div className="mt-5 flex justify-end gap-3">
          <button
            className={ghostButton}
            disabled={form.pending}
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className={dangerButton}
            disabled={form.pending}
            type="submit"
          >
            {form.pending ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Trash2 aria-hidden className="size-4" />
            )}
            {form.pending ? "Deleting..." : "Delete"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Section summary                                                     */
/* ------------------------------------------------------------------ */

function SectionSummary({ record }: { record: NonNullable<Leadership> }) {
  return (
    <article className="flex flex-col gap-4 rounded-md border border-gray-200 bg-white p-4 sm:flex-row sm:items-center">
      <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-md border border-gray-100 bg-gray-50">
        {record.officerImagePath ? (
          <Image
            alt={
              record.officerImageAlt ??
              record.officerName ??
              "Placement officer"
            }
            className="h-full w-full object-cover"
            height={64}
            src={record.officerImagePath}
            unoptimized
            width={64}
          />
        ) : (
          <UserRound aria-hidden className="size-6 text-gray-300" />
        )}
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {record.eyebrow || "Placement Leadership"}
          </p>
          <StatusBadge tone={record.isPublished ? "green" : "gray"}>
            {record.isPublished ? "Published" : "Draft"}
          </StatusBadge>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">
          {record.heading || "No heading"}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          {(record.officerName || "No officer") +
            (record.officerDesignation
              ? ` · ${record.officerDesignation}`
              : "")}
        </p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* Manager                                                             */
/* ------------------------------------------------------------------ */

type Editing<T> = T | "new" | null;

export default function PlacementLeadershipManager({
  leadership,
  items,
  canPublish,
}: {
  leadership: Leadership;
  items: LeadershipItem[];
  canPublish: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [sectionEditing, setSectionEditing] = useState(false);
  const [itemEdit, setItemEdit] = useState<Editing<LeadershipItem>>(null);
  const [deleting, setDeleting] = useState<LeadershipItem | null>(null);

  function notify(text: string) {
    setMessage(text);
  }

  return (
    <div className="space-y-5 border border-gray-200 bg-gray-50 p-3 rounded-lg">
      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-2.5 text-sm font-semibold text-secondary-800"
        >
          {message}
        </p>
      ) : null}

      <Panel
        action={
          <button
            className={primaryButton}
            onClick={() => setSectionEditing(true)}
            type="button"
          >
            <Pencil aria-hidden className="size-4" />
            {leadership ? "Edit section" : "Add section"}
          </button>
        }
        description="Section intro, placement officer profile, and photo."
        title="Placement Leadership"
      >
        {leadership ? (
          <SectionSummary record={leadership} />
        ) : (
          <EmptyState>
            No leadership content yet. Use “Add section” to create it.
          </EmptyState>
        )}
      </Panel>

      <Panel
        action={
          <button
            className={primaryButton}
            onClick={() => setItemEdit("new")}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
            Add Item
          </button>
        }
        description="Ordered qualifications and experience shown under the profile."
        title="Qualifications & Experience"
      >
        {items.length === 0 ? (
          <EmptyState>No items yet. Use “Add Item” to create one.</EmptyState>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <ItemRow
                canPublish={canPublish}
                item={item}
                key={item.id}
                onDelete={() => setDeleting(item)}
                onEdit={() => setItemEdit(item)}
              />
            ))}
          </div>
        )}
      </Panel>

      {sectionEditing ? (
        <Modal
          onClose={() => setSectionEditing(false)}
          title={
            leadership
              ? "Edit placement leadership"
              : "Add placement leadership"
          }
        >
          <SectionForm
            canPublish={canPublish}
            onCancel={() => setSectionEditing(false)}
            onSaved={(text) => {
              notify(text);
              setSectionEditing(false);
            }}
            record={
              leadership ?? {
                id: 0,
                eyebrow: null,
                heading: null,
                description: null,
                officerName: null,
                officerDesignation: null,
                officerImagePath: null,
                officerImageAlt: null,
                isPublished: false,
              }
            }
          />
        </Modal>
      ) : null}

      {itemEdit ? (
        <Modal
          onClose={() => setItemEdit(null)}
          title={itemEdit === "new" ? "Add item" : "Edit item"}
        >
          <ItemForm
            canPublish={canPublish}
            onCancel={() => setItemEdit(null)}
            onSaved={(text) => {
              notify(text);
              setItemEdit(null);
            }}
            record={itemEdit === "new" ? undefined : itemEdit}
          />
        </Modal>
      ) : null}

      {deleting ? (
        <DeleteDialog
          id={deleting.id}
          name={deleting.title}
          onClose={() => setDeleting(null)}
          onDeleted={(text) => {
            notify(text);
            setDeleting(null);
          }}
        />
      ) : null}
    </div>
  );
}
