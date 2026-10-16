"use client";

import { useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Ban,
  ChevronUp,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Save,
  Search,
  X,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import { savePageSeo } from "@/src/app/admin/(protected)/seo/actions";

export type SeoRecord = {
  id: number;
  pagePath: string;
  pageTitle: string;
  seoTitle: string | null;
  metaDescription: string | null;
  canonicalUrl: string | null;
  ogImage: string | null;
  noIndex: boolean;
};

const input =
  "mt-1 min-h-9 w-full rounded border border-gray-300 px-3 py-1.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-primary-700";
const label = "block text-xs font-semibold text-gray-700";
const hint = "mt-1 block text-[11px] font-normal text-gray-500";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:opacity-60";

/** Live character count; turns amber once past the recommended length. */
function CharCount({
  value,
  recommended,
}: {
  value: string;
  recommended: number;
}) {
  const length = value.trim().length;
  const over = length > recommended;
  return (
    <span
      className={`text-[11px] font-semibold tabular-nums ${over ? "text-amber-600" : "text-gray-400"}`}
    >
      {length} characters
    </span>
  );
}

/** Saves through the existing server action; pending state via useFormStatus. */
function SaveButton({ children }: { children: string }) {
  const { pending } = useFormStatus();
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

function SeoForm({
  value,
  onCancel,
  onDirty,
}: {
  value?: SeoRecord;
  onCancel: () => void;
  onDirty: () => void;
}) {
  const [seoTitle, setSeoTitle] = useState(value?.seoTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(
    value?.metaDescription ?? "",
  );
  const [ogImage, setOgImage] = useState(value?.ogImage ?? "");

  return (
    <form
      action={savePageSeo}
      className="grid gap-4 sm:grid-cols-2"
      onChange={onDirty}
    >
      {value ? <input name="id" type="hidden" value={value.id} /> : null}
      <input name="ogImage" type="hidden" value={ogImage} />

      <fieldset className="sm:col-span-2">
        <legend className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
          Page information
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className={label}>
            Page path
            <input
              className={`${input} font-mono`}
              defaultValue={value?.pagePath ?? ""}
              name="pagePath"
              placeholder="/admissions"
              required
            />
            <span className={hint}>
              Use a leading slash, for example /faculty.
            </span>
          </label>
          <label className={label}>
            Page title
            <input
              className={input}
              defaultValue={value?.pageTitle ?? ""}
              name="pageTitle"
              placeholder="Faculty"
              required
            />
            <span className={hint}>
              Shown in the browser tab and used when the SEO title is empty.
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="border-t border-gray-100 pt-4 sm:col-span-2">
        <legend className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
          Search engine metadata
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <label className={label}>
            <span className="flex items-center justify-between gap-2">
              <span>SEO title</span>
              <CharCount recommended={60} value={seoTitle} />
            </span>
            <input
              className={input}
              name="seoTitle"
              onChange={(event) => setSeoTitle(event.target.value)}
              placeholder="Leave empty to use the page title"
              value={seoTitle}
            />
            <span className={hint}>Recommended: up to 60 characters.</span>
          </label>
          <label className={label}>
            Canonical URL
            <input
              className={input}
              defaultValue={value?.canonicalUrl ?? ""}
              name="canonicalUrl"
              placeholder="https://example.com/faculty"
              type="url"
            />
            <span className={hint}>
              Optional. The preferred URL search engines should index.
            </span>
          </label>
          <label className={`${label} sm:col-span-2`}>
            <span className="flex items-center justify-between gap-2">
              <span>Meta description</span>
              <CharCount recommended={160} value={metaDescription} />
            </span>
            <textarea
              className={input}
              name="metaDescription"
              onChange={(event) => setMetaDescription(event.target.value)}
              placeholder="A concise summary shown in search results."
              rows={3}
              value={metaDescription}
            />
            <span className={hint}>
              Recommended: about 150–160 characters. Longer text may be
              shortened in search results.
            </span>
          </label>
          <label className="flex items-start gap-2 sm:col-span-2">
            <input
              className="mt-0.5 size-4"
              defaultChecked={value?.noIndex ?? false}
              name="noIndex"
              type="checkbox"
            />
            <span className="text-sm font-semibold text-gray-700">
              Prevent indexing
              <span className={hint}>
                Requests that search engines not index this page. This is a
                request, not a guarantee.
              </span>
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset className="border-t border-gray-100 pt-4 sm:col-span-2">
        <legend className="text-[11px] font-bold uppercase tracking-wide text-gray-500">
          Social sharing image
        </legend>
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50/70 p-3">
          <ImageUploadField
            category="pages"
            compact
            label="Open Graph image"
            onChange={(path) => {
              setOgImage(path);
              onDirty();
            }}
            value={ogImage}
          />
          <p className={`${hint} font-normal`}>
            Shown when this page is shared on social platforms.
          </p>
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 sm:col-span-2">
        <SaveButton>{value ? "Save changes" : "Add page SEO"}</SaveButton>
        <button className={ghostButton} onClick={onCancel} type="button">
          Cancel
        </button>
      </div>
    </form>
  );
}

function SeoCard({
  record,
  isOpen,
  duplicate,
  onToggle,
  onDirty,
}: {
  record: SeoRecord;
  isOpen: boolean;
  duplicate: boolean;
  onToggle: (id: number) => void;
  onDirty: () => void;
}) {
  const missingTitle = !record.seoTitle?.trim();
  const missingDescription = !record.metaDescription?.trim();
  const warnings = [
    missingTitle ? "Missing SEO title" : null,
    missingDescription ? "Missing description" : null,
    duplicate ? "Duplicate SEO title" : null,
  ].filter((warning): warning is string => warning !== null);

  return (
    <article
      className={`rounded-lg border bg-white transition ${isOpen ? "border-primary-700 ring-1 ring-primary-700" : "border-gray-200 hover:border-gray-300"}`}
    >
      <div className="p-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate font-mono text-sm font-semibold text-primary-800">
              {record.pagePath}
            </p>
            <p className="mt-0.5 truncate text-sm text-gray-700">
              {record.pageTitle}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {record.noIndex ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-[10px] font-semibold text-gray-600">
                <Ban aria-hidden className="size-3" /> No index
              </span>
            ) : null}
            <button
              aria-expanded={isOpen}
              className={ghostButton}
              onClick={() => onToggle(record.id)}
              type="button"
            >
              {isOpen ? (
                <ChevronUp aria-hidden className="size-3.5" />
              ) : (
                <Pencil aria-hidden className="size-3.5" />
              )}
              {isOpen ? "Close" : "Edit SEO"}
            </button>
          </div>
        </div>

        <div className="mt-3 space-y-1 text-sm">
          <p className="truncate text-gray-700">
            <span className="mr-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              Title
            </span>
            {record.seoTitle?.trim() ? (
              record.seoTitle
            ) : (
              <span className="italic text-gray-400">
                Falls back to the page title
              </span>
            )}
          </p>
          <p className="line-clamp-2 text-gray-600">
            {record.metaDescription?.trim() ? (
              record.metaDescription
            ) : (
              <span className="italic text-gray-400">No meta description</span>
            )}
          </p>
        </div>

        {warnings.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-semibold text-amber-700">
            {warnings.map((warning) => (
              <li className="inline-flex items-center gap-1" key={warning}>
                <AlertTriangle aria-hidden className="size-3" />
                {warning}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {isOpen ? (
        <div className="border-t border-gray-100 p-4">
          <SeoForm
            key={record.id}
            onCancel={() => onToggle(record.id)}
            onDirty={onDirty}
            value={record}
          />
        </div>
      ) : null}
    </article>
  );
}

function StatCard({ label: text, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
        {text}
      </p>
      <p className="mt-1 text-xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

export default function SeoManager({
  records,
  notice = null,
  error = null,
  loadError = false,
}: {
  records: SeoRecord[];
  notice?: string | null;
  error?: string | null;
  loadError?: boolean;
}) {
  const [openId, setOpenId] = useState<number | "new" | null>(null);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const duplicateTitles = useMemo(() => {
    const counts = new Map<string, number>();
    for (const record of records) {
      const title = record.seoTitle?.trim().toLowerCase();
      if (!title) continue;
      counts.set(title, (counts.get(title) ?? 0) + 1);
    }
    const duplicates = new Set<string>();
    for (const [title, count] of counts) {
      if (count > 1) duplicates.add(title);
    }
    return duplicates;
  }, [records]);

  const stats = useMemo(
    () => ({
      total: records.length,
      withTitle: records.filter((record) => record.seoTitle?.trim()).length,
      withDescription: records.filter((record) => record.metaDescription?.trim())
        .length,
      noindex: records.filter((record) => record.noIndex).length,
    }),
    [records],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return records;
    return records.filter((record) =>
      `${record.pagePath} ${record.pageTitle} ${record.seoTitle ?? ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [records, query]);

  function canDiscard() {
    if (openId === null || !dirty) return true;
    return window.confirm("You have unsaved changes. Discard them?");
  }

  function toggleRecord(id: number) {
    if (!canDiscard()) return;
    setOpenId(openId === id ? null : id);
    setDirty(false);
  }

  function toggleNew() {
    const next = openId === "new" ? null : "new";
    if (!canDiscard()) return;
    setOpenId(next);
    setDirty(false);
  }

  const showEmpty = !loadError && records.length === 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <nav
            aria-label="Breadcrumb"
            className="text-[11px] font-semibold uppercase tracking-wide text-gray-500"
          >
            <ol className="flex items-center gap-1.5">
              <li>STCET</li>
              <li aria-hidden className="text-gray-300">
                /
              </li>
              <li>Admin</li>
              <li aria-hidden className="text-gray-300">
                /
              </li>
              <li aria-current="page" className="text-gray-800">
                SEO
              </li>
            </ol>
          </nav>
          <h2 className="mt-2 text-2xl font-bold text-gray-900">
            SEO Management
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-gray-600">
            Manage search metadata and social sharing previews for your public
            pages.
          </p>
        </div>
        <button className={primaryButton} onClick={toggleNew} type="button">
          <Plus aria-hidden className="size-4" /> Add page SEO
        </button>
      </header>

      {loadError ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          SEO metadata could not be loaded. Refresh the page or try again
          shortly.
        </p>
      ) : null}

      {error ? (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {error}
        </p>
      ) : null}

      {notice ? (
        <div
          aria-live="polite"
          className="flex items-center justify-between gap-3 rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-800"
        >
          <span>{notice}</span>
          <button
            aria-label="Dismiss message"
            className="rounded p-1 hover:bg-secondary-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary-700"
            onClick={() => router.replace("/admin/seo")}
            type="button"
          >
            <X aria-hidden className="size-4" />
          </button>
        </div>
      ) : null}

      {!loadError ? (
        <section
          aria-label="SEO overview"
          className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        >
          <StatCard label="SEO records" value={stats.total} />
          <StatCard label="Custom titles" value={stats.withTitle} />
          <StatCard label="Meta descriptions" value={stats.withDescription} />
          <StatCard label="No index" value={stats.noindex} />
        </section>
      ) : null}

      {openId === "new" ? (
        <section className="rounded-lg border border-primary-700 bg-white p-4 ring-1 ring-primary-700">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-gray-800">New page SEO</h3>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-primary-700">
              Unsaved
            </span>
          </div>
          <SeoForm
            key="new"
            onCancel={toggleNew}
            onDirty={() => setDirty(true)}
          />
        </section>
      ) : null}

      {showEmpty ? (
        <section className="rounded-lg border border-dashed border-gray-300 bg-white px-6 py-12 text-center">
          <FileText aria-hidden className="mx-auto size-8 text-gray-400" />
          <h3 className="mt-3 text-base font-bold text-gray-800">
            No page metadata yet
          </h3>
          <p className="mx-auto mt-1 max-w-md text-sm text-gray-500">
            Add SEO metadata to control how your public pages appear in search
            results and social shares.
          </p>
          <button
            className={`${primaryButton} mt-4`}
            onClick={toggleNew}
            type="button"
          >
            <Plus aria-hidden className="size-4" /> Add page SEO
          </button>
        </section>
      ) : null}

      {!loadError && records.length > 0 ? (
        <section aria-label="Page metadata" className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-600">
              {records.length} {records.length === 1 ? "page" : "pages"}
            </p>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Filter SEO records</span>
              <Search
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400"
              />
              <input
                className="min-h-9 w-full rounded border border-gray-300 py-1.5 pl-9 pr-3 text-sm focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-primary-700"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Filter by path, title, or SEO title"
                type="search"
                value={query}
              />
            </label>
          </div>

          {filtered.length === 0 ? (
            <p className="rounded-lg border border-gray-200 bg-white px-4 py-8 text-center text-sm text-gray-500">
              No records match “{query}”.
            </p>
          ) : (
            <div className="space-y-3">
              {filtered.map((record) => (
                <SeoCard
                  duplicate={duplicateTitles.has(
                    (record.seoTitle ?? "").trim().toLowerCase(),
                  )}
                  isOpen={openId === record.id}
                  key={record.id}
                  onDirty={() => setDirty(true)}
                  onToggle={toggleRecord}
                  record={record}
                />
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
