"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Loader2, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import DeleteInstitutionalPageButton from "@/src/components/admin/institutional-pages/DeleteInstitutionalPageButton";
import {
  deletePageSection,
  saveInstitutionalPage,
  savePageSection,
  type SaveResult,
} from "@/src/app/admin/(protected)/institutional-pages/actions";
import {
  DEFAULT_SECTION_LAYOUT,
  SECTION_LAYOUTS,
  resolveSectionLayout,
  sectionLayoutLabel,
  type SectionLayoutId,
} from "@/src/lib/content/section-layouts";

type Section = {
  id: number;
  pageId: number;
  title: string;
  content: string | null;
  imagePath: string | null;
  layout: string;
  sortOrder: number;
};

type Page = {
  id: number;
  title: string;
  slug: string;
  introduction: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  sortOrder: number;
  isPublished: boolean;
  sections: Section[];
};

const input =
  "mt-1 min-h-9 w-full rounded border border-gray-300 px-3 py-1.5 text-sm";
const label = "block text-xs font-semibold text-gray-700";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center rounded-md border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60";

/**
 * Wires a result-returning server action to a form while keeping the form
 * mounted on failure (so the editor does not lose the user's input). On success
 * the server data is refreshed and an optional callback fires.
 */
function useFormAction(
  action: (formData: FormData) => Promise<SaveResult>,
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

/** Tiny schematic so editors can recognise a layout before selecting it. */
function LayoutPreview({ id }: { id: SectionLayoutId }) {
  const frame =
    "h-9 w-full overflow-hidden rounded-sm border border-gray-200 bg-white p-1";
  const bar = "rounded-sm bg-gray-300";
  const img = "rounded-sm bg-primary-200";

  if (id === "image-left" || id === "image-right") {
    const image = <div className={`${img} h-full w-1/3 shrink-0`} />;
    const lines = (
      <div className="flex-1 space-y-1 pt-0.5">
        <div className={`${bar} h-1 w-3/4`} />
        <div className={`${bar} h-1 w-full opacity-70`} />
        <div className={`${bar} h-1 w-5/6 opacity-70`} />
      </div>
    );
    return (
      <div className={`${frame} flex gap-1`}>
        {id === "image-left" ? (
          <>
            {image}
            {lines}
          </>
        ) : (
          <>
            {lines}
            {image}
          </>
        )}
      </div>
    );
  }

  if (id === "image-banner") {
    return (
      <div className={`${frame} flex flex-col gap-1`}>
        <div className={`${img} h-1/2 w-full`} />
        <div className={`${bar} h-1 w-2/3`} />
        <div className={`${bar} h-1 w-full opacity-70`} />
      </div>
    );
  }

  if (id === "highlight") {
    return (
      <div className={frame}>
        <div className="flex h-full flex-col justify-center gap-1 rounded-sm border-l-2 border-primary-400 bg-primary-50 px-1.5">
          <div className="h-1 w-2/3 rounded-sm bg-primary-300" />
          <div className={`${bar} h-1 w-full opacity-70`} />
          <div className={`${bar} h-1 w-4/5 opacity-70`} />
        </div>
      </div>
    );
  }

  if (id === "two-column") {
    return (
      <div className={`${frame} flex flex-col gap-1`}>
        <div className={`${bar} h-1 w-1/2`} />
        <div className="flex flex-1 gap-1.5">
          <div className="flex-1 space-y-1">
            <div className={`${bar} h-1 w-full opacity-70`} />
            <div className={`${bar} h-1 w-5/6 opacity-70`} />
          </div>
          <div className="flex-1 space-y-1">
            <div className={`${bar} h-1 w-full opacity-70`} />
            <div className={`${bar} h-1 w-4/5 opacity-70`} />
          </div>
        </div>
      </div>
    );
  }

  if (id === "full-width") {
    return (
      <div className={`${frame} space-y-1`}>
        <div className={`${bar} h-1 w-1/3`} />
        <div className={`${bar} h-1 w-full opacity-70`} />
        <div className={`${bar} h-1 w-full opacity-70`} />
        <div className={`${bar} h-1 w-4/5 opacity-70`} />
      </div>
    );
  }

  // standard
  return (
    <div className={`${frame} flex flex-col gap-1`}>
      <div className={`${bar} h-1 w-1/2`} />
      <div className={`${bar} h-1 w-full opacity-70`} />
      <div className={`${img} h-1/3 w-full`} />
    </div>
  );
}

function LayoutPicker({ value }: { value: SectionLayoutId }) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="text-xs font-semibold text-gray-700">
        Section layout
      </legend>
      <div className="mt-1.5 grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-7">
        {SECTION_LAYOUTS.map((layout) => (
          <label
            className="cursor-pointer"
            key={layout.id}
            title={layout.description}
          >
            <input
              className="peer sr-only"
              defaultChecked={value === layout.id}
              name="layout"
              type="radio"
              value={layout.id}
            />
            <span className="block rounded-md border border-gray-300 bg-white p-1.5 transition peer-checked:border-primary-700 peer-checked:bg-primary-50 peer-checked:ring-1 peer-checked:ring-primary-700 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary-700">
              <LayoutPreview id={layout.id} />
              <span className="mt-1 block truncate text-center text-[10px] font-bold text-gray-700">
                {layout.shortLabel}
              </span>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
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
    <p className="text-xs font-semibold text-red-700" aria-live="polite">
      {error}
    </p>
  );
}

function PageForm({
  page,
  canPublish,
  onCancel,
  onSaved,
}: {
  page?: Page;
  canPublish: boolean;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useFormAction(saveInstitutionalPage, onSaved);

  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      {page ? <input name="id" type="hidden" value={page.id} /> : null}
      <label className={label}>
        Page title
        <input className={input} defaultValue={page?.title ?? ""} name="title" required />
      </label>
      <label className={label}>
        Slug
        <input
          className={input}
          defaultValue={page?.slug ?? ""}
          name="slug"
          pattern="[a-z0-9]+(-[a-z0-9]+)*"
          required
        />
      </label>
      <label className={`${label} sm:col-span-2`}>
        Introduction
        <textarea
          className={input}
          defaultValue={page?.introduction ?? ""}
          name="introduction"
          rows={2}
        />
      </label>
      <label className={label}>
        SEO title
        <input className={input} defaultValue={page?.seoTitle ?? ""} name="seoTitle" />
      </label>
      <label className={label}>
        Meta description
        <textarea
          className={input}
          defaultValue={page?.metaDescription ?? ""}
          name="metaDescription"
          rows={2}
        />
      </label>
      <label className={label}>
        Order
        <input
          className={input}
          defaultValue={page?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      {canPublish ? (
        <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-gray-700">
          <input
            defaultChecked={page?.isPublished ?? false}
            name="isPublished"
            type="checkbox"
          />
          Published
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>
          {page ? "Save page" : "Create page"}
        </SaveButton>
        {onCancel ? (
          <button className={ghostButton} disabled={form.pending} onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
        <FormError error={form.error} />
      </div>
    </form>
  );
}

function SectionForm({
  pageId,
  section,
  onCancel,
  onSaved,
}: {
  pageId: number;
  section?: Section;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const [content, setContent] = useState(section?.content ?? "");
  const [imagePath, setImagePath] = useState(section?.imagePath ?? "");
  const form = useFormAction(savePageSection, onSaved);

  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      <input name="pageId" type="hidden" value={pageId} />
      {section ? <input name="id" type="hidden" value={section.id} /> : null}
      <input name="imagePath" type="hidden" value={imagePath} />
      <label className={`${label} sm:col-span-2`}>
        Section title
        <input className={input} defaultValue={section?.title ?? ""} name="title" required />
      </label>
      <div className="sm:col-span-2">
        <RichTextEditor
          label="Content"
          minHeight={140}
          name="content"
          onChange={setContent}
          value={content}
        />
      </div>
      <LayoutPicker
        value={section ? resolveSectionLayout(section.layout) : DEFAULT_SECTION_LAYOUT}
      />
      <label className={`${label} sm:col-span-2`}>
        Order
        <input
          className={input}
          defaultValue={section?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      <div className="sm:col-span-2">
        <ImageUploadField
          category="pages"
          compact
          label="Optional section image"
          onChange={setImagePath}
          value={imagePath}
        />
      </div>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>
          {section ? "Save section" : "Add section"}
        </SaveButton>
        {onCancel ? (
          <button className={ghostButton} disabled={form.pending} onClick={onCancel} type="button">
            Cancel
          </button>
        ) : null}
        <FormError error={form.error} />
      </div>
    </form>
  );
}

function NewSectionCard({
  pageId,
  onCancel,
  onMessage,
}: {
  pageId: number;
  onCancel: () => void;
  onMessage: (message: string) => void;
}) {
  return (
    <div className="rounded-md border border-dashed border-primary-300 bg-primary-50/40 p-3">
      <p className="text-sm font-bold text-gray-800">New section</p>
      <SectionForm
        onCancel={onCancel}
        onSaved={(message) => {
          onMessage(message);
          onCancel();
        }}
        pageId={pageId}
      />
    </div>
  );
}

function SectionCard({
  pageId,
  section,
  canPublish,
  onMessage,
}: {
  pageId: number;
  section: Section;
  canPublish: boolean;
  onMessage: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const del = useFormAction(deletePageSection, onMessage);

  return (
    <div className="rounded-md border border-gray-200 bg-white">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          <ChevronDown
            aria-hidden
            className={`size-4 shrink-0 text-gray-400 transition ${open ? "" : "-rotate-90"}`}
          />
          <span className="truncate text-sm font-semibold text-gray-800">
            {section.title}
          </span>
          <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {sectionLayoutLabel(section.layout)}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-gray-400">#{section.sortOrder}</span>
          {canPublish ? (
            <form
              onSubmit={(event) => {
                if (!window.confirm(`Delete “${section.title}”?`)) {
                  event.preventDefault();
                  return;
                }
                del.submit(event);
              }}
            >
              <input name="id" type="hidden" value={section.id} />
              <button
                aria-label={`Delete ${section.title}`}
                className="rounded p-1 text-red-600 hover:bg-red-50 disabled:opacity-50"
                disabled={del.pending}
                type="submit"
              >
                {del.pending ? (
                  <Loader2 aria-hidden className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 aria-hidden className="size-3.5" />
                )}
              </button>
            </form>
          ) : null}
        </div>
      </div>
      {del.error ? (
        <p className="px-3 pb-2 text-xs font-semibold text-red-700" aria-live="polite">
          {del.error}
        </p>
      ) : null}
      {open ? (
        <div className="px-3 pb-3">
          <SectionForm
            onCancel={() => setOpen(false)}
            onSaved={onMessage}
            pageId={pageId}
            section={section}
          />
        </div>
      ) : null}
    </div>
  );
}

function PageCard({
  page,
  canPublish,
  onMessage,
  onClose,
}: {
  page?: Page;
  canPublish: boolean;
  onMessage: (message: string) => void;
  onClose?: () => void;
}) {
  const [settings, setSettings] = useState(!page);
  const [addingSection, setAddingSection] = useState(false);

  return (
    <article className="rounded-lg border border-gray-200 bg-white p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-gray-900">
            {page ? page.title : "New page"}
            {page ? (
              <span className="ml-1 font-normal text-gray-500">/{page.slug}</span>
            ) : null}
          </p>
          {page ? (
            <p className="text-xs text-gray-500">
              {page.isPublished ? "Published" : "Draft"} · {page.sections.length}{" "}
              {page.sections.length === 1 ? "section" : "sections"}
            </p>
          ) : (
            <p className="text-xs text-gray-500">
              Add a new institutional page.
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {page ? (
            <button
              className="inline-flex min-h-8 items-center gap-1 rounded-md border border-gray-300 px-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              onClick={() => setSettings((value) => !value)}
              type="button"
            >
              <ChevronDown
                aria-hidden
                className={`size-3.5 transition ${settings ? "" : "-rotate-90"}`}
              />
              Settings
            </button>
          ) : null}
          {page && canPublish ? (
            <DeleteInstitutionalPageButton
              onDeleted={(title) => onMessage(`“${title}” was deleted successfully.`)}
              pageId={page.id}
              pageTitle={page.title}
            />
          ) : null}
        </div>
      </header>

      {settings ? (
        <PageForm
          canPublish={canPublish}
          onCancel={page ? () => setSettings(false) : onClose}
          onSaved={(message) => {
            onMessage(message);
            if (!page) onClose?.();
          }}
          page={page}
        />
      ) : null}

      {page ? (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Content sections
            </h4>
            <button
              className="inline-flex min-h-8 items-center gap-1 rounded-md border border-gray-300 px-2.5 text-xs font-bold text-gray-700 hover:bg-gray-50"
              onClick={() => setAddingSection((value) => !value)}
              type="button"
            >
              <Plus aria-hidden className="size-3.5" />
              Add section
            </button>
          </div>
          {addingSection ? (
            <div className="mt-3">
              <NewSectionCard
                onCancel={() => setAddingSection(false)}
                onMessage={onMessage}
                pageId={page.id}
              />
            </div>
          ) : null}
          <div className="mt-3 space-y-2">
            {page.sections.length === 0 && !addingSection ? (
              <p className="text-xs text-gray-400">No sections yet.</p>
            ) : null}
            {page.sections.map((section) => (
              <SectionCard
                canPublish={canPublish}
                key={section.id}
                onMessage={onMessage}
                pageId={page.id}
                section={section}
              />
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export default function InstitutionalPagesManager({
  pages,
  canPublish,
}: {
  pages: Page[];
  canPublish: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          {pages.length} {pages.length === 1 ? "page" : "pages"}
        </p>
        <button
          className={primaryButton}
          onClick={() => setAdding((value) => !value)}
          type="button"
        >
          <Plus aria-hidden className="size-4" />
          Add page
        </button>
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-800"
        >
          {message}
        </p>
      ) : null}

      {adding ? (
        <PageCard
          canPublish={canPublish}
          onClose={() => setAdding(false)}
          onMessage={setMessage}
        />
      ) : null}

      {pages.length === 0 && !adding ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No institutional pages yet. Use “Add page” to create one.
        </p>
      ) : null}

      {pages.map((page) => (
        <PageCard
          canPublish={canPublish}
          key={page.id}
          onMessage={setMessage}
          page={page}
        />
      ))}
    </div>
  );
}
