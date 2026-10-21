"use client";

import Image from "next/image";
import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Building2,
  ExternalLink,
  ImageOff,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import {
  deletePlacement,
  saveCompany,
  saveInteraction,
  saveProgramme,
  type PlacementResult,
} from "@/src/app/admin/(protected)/placements/actions";

type Company = {
  id: number;
  name: string;
  websiteUrl: string | null;
  logoPath: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
};
type Content = {
  id: number;
  title: string;
  description: string | null;
  imagePath: string | null;
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
function usePlacementAction(
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

function SaveButton({ pending, children }: { pending: boolean; children: string }) {
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
  tone: "gray" | "green" | "navy";
  children: ReactNode;
}) {
  const tones = {
    gray: "bg-gray-100 text-gray-500",
    green: "bg-secondary-50 text-secondary-800",
    navy: "bg-primary-50 text-primary-700",
  } as const;
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

function Thumbnail({
  src,
  alt,
  fallback,
}: {
  src: string | null;
  alt: string;
  fallback: ReactNode;
}) {
  return (
    <span className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-md border border-gray-100 bg-gray-50">
      {src ? (
        <Image
          alt={alt}
          className="h-full w-full object-contain p-1"
          height={44}
          src={src}
          unoptimized
          width={44}
        />
      ) : (
        fallback
      )}
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
/* Placement companies                                                 */
/* ------------------------------------------------------------------ */

function CompanyForm({
  company,
  canPublish,
  onCancel,
  onSaved,
}: {
  company?: Company;
  canPublish: boolean;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const form = usePlacementAction(saveCompany, onSaved);
  const [logoPath, setLogoPath] = useState(company?.logoPath ?? "");

  return (
    <form className="mt-4 grid gap-4" onSubmit={form.submit}>
      {company ? <input name="id" type="hidden" value={company.id} /> : null}
      <input name="logoPath" type="hidden" value={logoPath} />

      <div className="grid gap-4 sm:grid-cols-3">
        <label className={`${label} sm:col-span-2`}>
          Company name
          <input
            className={input}
            defaultValue={company?.name ?? ""}
            name="name"
            required
          />
        </label>
        <label className={label}>
          Display order
          <input
            className={input}
            defaultValue={company?.sortOrder ?? 0}
            min="0"
            name="sortOrder"
            type="number"
          />
        </label>
      </div>

      <label className={label}>
        Website URL
        <input
          className={input}
          defaultValue={company?.websiteUrl ?? ""}
          name="websiteUrl"
          placeholder="https://example.com"
          type="url"
        />
      </label>

      <ImageUploadField
        category="placements"
        compact
        label="Company logo"
        onChange={setLogoPath}
        value={logoPath}
      />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
          <input
            className="size-4 accent-primary-700"
            defaultChecked={company?.isActive ?? true}
            name="isActive"
            type="checkbox"
          />
          Active
        </label>
        {canPublish ? (
          <label className="flex items-center gap-2 text-xs font-semibold text-gray-600">
            <input
              className="size-4 accent-primary-700"
              defaultChecked={company?.isPublished ?? false}
              name="isPublished"
              type="checkbox"
            />
            Published
          </label>
        ) : (
          <input name="isPublished" type="hidden" value="off" />
        )}
      </div>

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
          {company ? "Save company" : "Add company"}
        </SaveButton>
      </div>
    </form>
  );
}

function CompanyRow({
  company,
  canPublish,
  onEdit,
  onDelete,
}: {
  company: Company;
  canPublish: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3">
      <Thumbnail
        alt={`${company.name} logo`}
        fallback={<Building2 aria-hidden className="size-5 text-gray-300" />}
        src={company.logoPath}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {company.name}
          </p>
          <StatusBadge tone={company.isPublished ? "green" : "gray"}>
            {company.isPublished ? "Published" : "Draft"}
          </StatusBadge>
          <StatusBadge tone={company.isActive ? "navy" : "gray"}>
            {company.isActive ? "Active" : "Inactive"}
          </StatusBadge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          {company.websiteUrl ? (
            <a
              className="inline-flex max-w-full items-center gap-1 truncate hover:text-primary-700 hover:underline"
              href={company.websiteUrl}
              rel="noreferrer"
              target="_blank"
            >
              <ExternalLink aria-hidden className="size-3 shrink-0" />
              <span className="truncate">{company.websiteUrl}</span>
            </a>
          ) : (
            <span>No website</span>
          )}
          <span className="text-gray-400">Order #{company.sortOrder}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          aria-label={`Edit ${company.name}`}
          className={rowAction}
          onClick={onEdit}
          title="Edit"
          type="button"
        >
          <Pencil aria-hidden className="size-4" />
        </button>
        {canPublish ? (
          <button
            aria-label={`Delete ${company.name}`}
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

/* ------------------------------------------------------------------ */
/* Training programmes & industry interactions                         */
/* ------------------------------------------------------------------ */

function ContentForm({
  record,
  kind,
  canPublish,
  onCancel,
  onSaved,
}: {
  record?: Content;
  kind: "programme" | "interaction";
  canPublish: boolean;
  onCancel: () => void;
  onSaved: (message: string) => void;
}) {
  const action = kind === "programme" ? saveProgramme : saveInteraction;
  const form = usePlacementAction(action, onSaved);
  const [imagePath, setImagePath] = useState(record?.imagePath ?? "");
  const noun = kind === "programme" ? "programme" : "interaction";

  return (
    <form className="mt-4 grid gap-4" onSubmit={form.submit}>
      {record ? <input name="id" type="hidden" value={record.id} /> : null}
      <input name="imagePath" type="hidden" value={imagePath} />

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
        Description
        <textarea
          className={input}
          defaultValue={record?.description ?? ""}
          name="description"
          rows={3}
        />
      </label>

      <ImageUploadField
        category="placements"
        compact
        label={kind === "programme" ? "Programme image or icon" : "Interaction image"}
        onChange={setImagePath}
        value={imagePath}
      />

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
          {record ? `Save ${noun}` : `Add ${noun}`}
        </SaveButton>
      </div>
    </form>
  );
}

function ContentRow({
  record,
  canPublish,
  onEdit,
  onDelete,
}: {
  record: Content;
  canPublish: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex items-center gap-3 rounded-md border border-gray-200 bg-white p-3">
      <Thumbnail
        alt={`${record.title} image`}
        fallback={<ImageOff aria-hidden className="size-5 text-gray-300" />}
        src={record.imagePath}
      />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-semibold text-gray-800">
            {record.title}
          </p>
          <StatusBadge tone={record.isPublished ? "green" : "gray"}>
            {record.isPublished ? "Published" : "Draft"}
          </StatusBadge>
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-gray-500">
          <span className="line-clamp-1 min-w-0 max-w-full">
            {record.description || "No description"}
          </span>
          <span className="text-gray-400">Order #{record.sortOrder}</span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-1">
        <button
          aria-label={`Edit ${record.title}`}
          className={rowAction}
          onClick={onEdit}
          title="Edit"
          type="button"
        >
          <Pencil aria-hidden className="size-4" />
        </button>
        {canPublish ? (
          <button
            aria-label={`Delete ${record.title}`}
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

/* ------------------------------------------------------------------ */
/* Delete dialog                                                       */
/* ------------------------------------------------------------------ */

function DeleteDialog({
  kind,
  id,
  name,
  onClose,
  onDeleted,
}: {
  kind: "company" | "programme" | "interaction";
  id: number;
  name: string;
  onClose: () => void;
  onDeleted: (message: string) => void;
}) {
  const form = usePlacementAction(deletePlacement, onDeleted);

  return (
    <Modal onClose={onClose} title="Delete record?">
      <form className="mt-4" onSubmit={form.submit}>
        <input name="kind" type="hidden" value={kind} />
        <input name="id" type="hidden" value={id} />
        <div className="flex items-center gap-3 text-red-600">
          <AlertTriangle aria-hidden className="size-6 shrink-0" />
          <p className="text-sm font-semibold text-gray-800">{name}</p>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          This permanently deletes the record and cannot be undone.
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
          <button className={dangerButton} disabled={form.pending} type="submit">
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
/* Manager                                                             */
/* ------------------------------------------------------------------ */

type Editing<T> = T | "new" | null;

export default function PlacementsManager({
  companies,
  programmes,
  interactions,
  canPublish,
}: {
  companies: Company[];
  programmes: Content[];
  interactions: Content[];
  canPublish: boolean;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [companyEdit, setCompanyEdit] = useState<Editing<Company>>(null);
  const [programmeEdit, setProgrammeEdit] = useState<Editing<Content>>(null);
  const [interactionEdit, setInteractionEdit] = useState<Editing<Content>>(null);
  const [deleting, setDeleting] = useState<{
    kind: "company" | "programme" | "interaction";
    id: number;
    name: string;
  } | null>(null);

  function notify(text: string) {
    setMessage(text);
  }

  return (
    <div className="space-y-5">
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
            onClick={() => setCompanyEdit("new")}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
            Add Company
          </button>
        }
        description="Manage recruiter logos and publication status."
        title="Placement Companies"
      >
        {companies.length === 0 ? (
          <EmptyState>
            No companies yet. Use “Add Company” to create one.
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {companies.map((company) => (
              <CompanyRow
                canPublish={canPublish}
                company={company}
                key={company.id}
                onDelete={() =>
                  setDeleting({
                    kind: "company",
                    id: company.id,
                    name: company.name,
                  })
                }
                onEdit={() => setCompanyEdit(company)}
              />
            ))}
          </div>
        )}
      </Panel>

      <Panel
        action={
          <button
            className={primaryButton}
            onClick={() => setProgrammeEdit("new")}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
            Add Programme
          </button>
        }
        description="Training cards keep the existing public layout and animations."
        title="Training Programmes"
      >
        {programmes.length === 0 ? (
          <EmptyState>
            No training programmes yet. Use “Add Programme” to create one.
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {programmes.map((record) => (
              <ContentRow
                canPublish={canPublish}
                key={record.id}
                onDelete={() =>
                  setDeleting({
                    kind: "programme",
                    id: record.id,
                    name: record.title,
                  })
                }
                onEdit={() => setProgrammeEdit(record)}
                record={record}
              />
            ))}
          </div>
        )}
      </Panel>

      <Panel
        action={
          <button
            className={primaryButton}
            onClick={() => setInteractionEdit("new")}
            type="button"
          >
            <Plus aria-hidden className="size-4" />
            Add Interaction
          </button>
        }
        description="Verified industry activities shown on the public placements page."
        title="Industry Interactions"
      >
        {interactions.length === 0 ? (
          <EmptyState>
            No industry interactions yet. Use “Add Interaction” to create one.
          </EmptyState>
        ) : (
          <div className="space-y-2">
            {interactions.map((record) => (
              <ContentRow
                canPublish={canPublish}
                key={record.id}
                onDelete={() =>
                  setDeleting({
                    kind: "interaction",
                    id: record.id,
                    name: record.title,
                  })
                }
                onEdit={() => setInteractionEdit(record)}
                record={record}
              />
            ))}
          </div>
        )}
      </Panel>

      {companyEdit ? (
        <Modal
          onClose={() => setCompanyEdit(null)}
          title={companyEdit === "new" ? "Add company" : "Edit company"}
        >
          <CompanyForm
            canPublish={canPublish}
            company={companyEdit === "new" ? undefined : companyEdit}
            onCancel={() => setCompanyEdit(null)}
            onSaved={(text) => {
              notify(text);
              setCompanyEdit(null);
            }}
          />
        </Modal>
      ) : null}

      {programmeEdit ? (
        <Modal
          onClose={() => setProgrammeEdit(null)}
          title={programmeEdit === "new" ? "Add programme" : "Edit programme"}
        >
          <ContentForm
            canPublish={canPublish}
            kind="programme"
            onCancel={() => setProgrammeEdit(null)}
            onSaved={(text) => {
              notify(text);
              setProgrammeEdit(null);
            }}
            record={programmeEdit === "new" ? undefined : programmeEdit}
          />
        </Modal>
      ) : null}

      {interactionEdit ? (
        <Modal
          onClose={() => setInteractionEdit(null)}
          title={interactionEdit === "new" ? "Add interaction" : "Edit interaction"}
        >
          <ContentForm
            canPublish={canPublish}
            kind="interaction"
            onCancel={() => setInteractionEdit(null)}
            onSaved={(text) => {
              notify(text);
              setInteractionEdit(null);
            }}
            record={interactionEdit === "new" ? undefined : interactionEdit}
          />
        </Modal>
      ) : null}

      {deleting ? (
        <DeleteDialog
          id={deleting.id}
          kind={deleting.kind}
          name={deleting.name}
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
