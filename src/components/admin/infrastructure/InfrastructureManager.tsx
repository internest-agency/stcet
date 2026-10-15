"use client";

import { useActionState, useMemo, useState } from "react";
import { Plus, Save, Search, Trash2 } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import {
  deleteInfrastructureFacility,
  saveInfrastructureFacility,
  type InfrastructureFacilityFormState,
} from "@/src/app/admin/(protected)/infrastructure/actions";
import { infrastructureFacilityCategories } from "@/src/lib/admin/infrastructure-categories";

type Facility = {
  id: number;
  category: string;
  title: string;
  description: string | null;
  imagePath: string | null;
  sortOrder: number;
  isActive: boolean;
  isPublished: boolean;
  layout?: string | null;
};

const categories = infrastructureFacilityCategories.map((c) => c.value) as [
  string,
  ...string[],
];

const categoryLabels: Record<string, string> = Object.fromEntries(
  infrastructureFacilityCategories.map((c) => [c.value, c.label]),
);

const layouts = [
  "image-left",
  "image-right",
  "image-top",
  "full-width",
  "image-banner",
  "highlight",
  "two-columns",
  "overlay-card",
  "student-facility-grid",
] as const;

const layoutLabels: Record<(typeof layouts)[number], string> = {
  "image-left": "Image Left",
  "image-right": "Image Right",
  "image-top": "Image Top",
  "full-width": "Full Width",
  "image-banner": "Image Banner",
  highlight: "Highlight / Callout",
  "two-columns": "Two Columns",
  "overlay-card": "Overlay Card",
  "student-facility-grid": "Student Facility Grid",
};

const input = "mt-1 min-h-10 w-full rounded-md border border-gray-300 px-3 py-2 text-sm";

function LayoutPreview({ layout }: { layout: (typeof layouts)[number] }) {
  const image = "block h-8 w-10 shrink-0 rounded-sm bg-accent-400/90";
  const text = "block h-1.5 rounded-sm bg-primary-700/50";
  const bars = (
    <span className="flex flex-1 flex-col justify-center gap-1.5">
      <span className={`${text} w-4/5`} />
      <span className={`${text} w-full`} />
      <span className={`${text} w-3/5`} />
    </span>
  );

  if (layout === "image-left" || layout === "student-facility-grid") {
    return (
      <span className="flex h-12 items-center gap-2 rounded bg-gray-100 p-1.5">
        <span className={image} />
        {bars}
      </span>
    );
  }
  if (layout === "image-right") {
    return (
      <span className="flex h-12 items-center gap-2 rounded bg-gray-100 p-1.5">
        {bars}
        <span className={image} />
      </span>
    );
  }
  if (layout === "image-top" || layout === "image-banner") {
    return (
      <span className="flex h-12 flex-col gap-1 rounded bg-gray-100 p-1.5">
        <span className="h-5 w-full rounded-sm bg-accent-400/90" />
        <span className="flex flex-1 items-center">{bars}</span>
      </span>
    );
  }
  if (layout === "overlay-card") {
    return (
      <span className="relative flex h-12 items-end overflow-hidden rounded bg-primary-700 p-2">
        <span className="absolute inset-0 bg-gradient-to-t from-primary-950/90 to-transparent" />
        <span className="relative h-1.5 w-2/3 rounded bg-white/80" />
      </span>
    );
  }
  if (layout === "two-columns") {
    return (
      <span className="grid h-12 grid-cols-2 gap-1 rounded bg-gray-100 p-1.5">
        <span className="flex flex-col justify-center gap-1.5">{bars}</span>
        <span className="flex flex-col justify-center gap-1.5">{bars}</span>
      </span>
    );
  }
  return (
    <span className="flex h-12 items-center gap-2 rounded border-l-4 border-accent-500 bg-primary-50 p-1.5">
      <span className="size-7 shrink-0 rounded-full bg-accent-400/90" />
      {bars}
    </span>
  );
}

function Form({
  facility,
  canPublish,
  cancel,
}: {
  facility?: Facility;
  canPublish: boolean;
  cancel?: () => void;
}) {
  const [formState, formAction, isPending] = useActionState<
    InfrastructureFacilityFormState,
    FormData
  >(saveInfrastructureFacility, {});
  const [title, setTitle] = useState(facility?.title ?? "");
  const [category, setCategory] = useState(facility?.category ?? "academic");
  const [sortOrder, setSortOrder] = useState(String(facility?.sortOrder ?? 0));
  const [isActive, setIsActive] = useState(facility?.isActive ?? true);
  const [isPublished, setIsPublished] = useState(facility?.isPublished ?? false);
  const [imagePath, setImagePath] = useState(facility?.imagePath ?? "");
  const [description, setDescription] = useState(facility?.description ?? "");
  const [layout, setLayout] = useState<(typeof layouts)[number]>(
    layouts.includes(facility?.layout as (typeof layouts)[number])
      ? (facility?.layout as (typeof layouts)[number])
      : "image-top",
  );

  return (
    <form action={formAction} className="grid gap-4 md:grid-cols-2">
      {facility ? <input name="id" type="hidden" value={facility.id} /> : null}
      <input name="imagePath" type="hidden" value={imagePath} />
      <input name="description" type="hidden" value={description} />
      <input name="layout" type="hidden" value={layout} />

      {formState.formError ? (
        <p
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800 md:col-span-2"
        >
          {formState.formError}
        </p>
      ) : null}

      <label className="md:col-span-2">
        <span className="text-sm font-semibold">Title</span>
        <input
          className={input}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={191}
          name="title"
          required
          value={title}
        />
        {formState.fieldErrors?.title ? (
          <span className="mt-1 block text-sm text-red-700">
            {formState.fieldErrors.title}
          </span>
        ) : null}
      </label>

      <div className="md:col-span-2">
        <RichTextEditor
          label="Description"
          value={description}
          onChange={setDescription}
          minHeight={160}
          hint="Use the Visual, HTML, or Preview tabs to format and review this description."
        />
      </div>

      <label>
        <span className="text-sm font-semibold">Category</span>
        <select
          className={input}
          onChange={(event) => setCategory(event.target.value)}
          name="category"
          value={category}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {categoryLabels[cat] ?? cat}
            </option>
          ))}
        </select>
        {formState.fieldErrors?.category ? (
          <span className="mt-1 block text-sm text-red-700">
            {formState.fieldErrors.category}
          </span>
        ) : null}
      </label>

      <label>
        <span className="text-sm font-semibold">Display order</span>
        <input
          className={input}
          min="0"
          name="sortOrder"
          onChange={(event) => setSortOrder(event.target.value)}
          type="number"
          value={sortOrder}
        />
        {formState.fieldErrors?.sortOrder ? (
          <span className="mt-1 block text-sm text-red-700">
            {formState.fieldErrors.sortOrder}
          </span>
        ) : null}
      </label>

      <fieldset className="md:col-span-2">
        <legend className="text-sm font-semibold">Facility layout</legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {layouts.map((option) => (
            <label
              key={option}
              className={`cursor-pointer rounded-md border p-3 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary-700 ${
                layout === option
                  ? "border-primary-700 bg-primary-50 ring-2 ring-primary-700/20"
                  : "border-gray-300 hover:border-primary-400"
              }`}
            >
              <input
                aria-label={layoutLabels[option]}
                checked={layout === option}
                className="sr-only"
                name="layout-preview"
                onChange={() => setLayout(option)}
                type="radio"
                value={option}
              />
              <LayoutPreview layout={option} />
              <span className="mt-2 block font-semibold">
                {layoutLabels[option]}
              </span>
            </label>
          ))}
        </div>
        {formState.fieldErrors?.layout ? (
          <span className="mt-1 block text-sm text-red-700">
            {formState.fieldErrors.layout}
          </span>
        ) : null}
      </fieldset>

      <div className="md:col-span-2">
        <ImageUploadField
          category="infrastructure"
          label="Facility image"
          onChange={setImagePath}
          value={imagePath}
        />
        {formState.fieldErrors?.imagePath ? (
          <span className="mt-1 block text-sm text-red-700">
            {formState.fieldErrors.imagePath}
          </span>
        ) : null}
      </div>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          checked={isActive}
          name="isActive"
          onChange={(event) => setIsActive(event.target.checked)}
          type="checkbox"
        />
        Active
      </label>
      {canPublish ? (
        <label className="flex items-center gap-2 text-sm font-semibold">
          <input
            checked={isPublished}
            name="isPublished"
            onChange={(event) => setIsPublished(event.target.checked)}
            type="checkbox"
          />
          Published
        </label>
      ) : (
        <input name="isPublished" type="hidden" value="off" />
      )}

      <div className="flex gap-2 md:col-span-2">
        <button className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 text-sm font-bold text-white">
          <Save className="size-4" />
          {isPending ? "Saving…" : "Save facility"}
        </button>
        {cancel ? (
          <button
            className="min-h-10 rounded-md border border-gray-300 px-3 text-sm font-bold"
            onClick={cancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default function InfrastructureManager({
  facilities,
  canPublish,
}: {
  facilities: Facility[];
  canPublish: boolean;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const filtered = useMemo(
    () =>
      facilities.filter(
        (item) =>
          (category === "all" || item.category === category) &&
          `${item.title} ${item.description ?? ""}`
            .toLowerCase()
            .includes(query.toLowerCase()),
      ),
    [facilities, category, query],
  );

  return (
    <div className="space-y-5">
      <section className="rounded-md border border-gray-200 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="font-bold">Facility content</h3>
            <p className="mt-1 text-sm text-gray-500">
              Published facilities appear on the public page.
            </p>
          </div>
          <button
            className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary-700 px-4 text-sm font-bold text-white"
            onClick={() => {
              setAdding(!adding);
              setEditing(null);
            }}
            type="button"
          >
            <Plus className="size-4" />
            Add facility
          </button>
        </div>
        {adding ? (
          <div className="mt-5 border-t pt-5">
            <Form canPublish={canPublish} cancel={() => setAdding(false)} />
          </div>
        ) : null}
      </section>

      <div className="grid gap-3 sm:grid-cols-[1fr_12rem]">
        <label className="relative">
          <Search className="absolute left-3 top-3 size-4 text-gray-400" />
          <input
            className="min-h-10 w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search facilities"
            value={query}
          />
        </label>
        <select
          aria-label="Filter facilities by category"
          className="min-h-10 rounded-md border border-gray-300 px-3 text-sm"
          onChange={(event) => setCategory(event.target.value)}
          value={category}
        >
          <option value="all">All categories</option>
          {categories.map((value) => (
            <option key={value} value={value}>
              {categoryLabels[value] ?? value}
            </option>
          ))}
        </select>
      </div>

      {filtered.length ? (
        <div className="space-y-3">
          {filtered.map((facility) => (
            <article
              className="rounded-md border border-gray-200 bg-white p-4"
              key={facility.id}
            >
              <div className="flex justify-between gap-3">
                <div>
                  <h3 className="font-bold">{facility.title}</h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {categoryLabels[facility.category] ?? facility.category} ·
                    order {facility.sortOrder} ·{" "}
                    {facility.isActive ? "Active" : "Inactive"} ·{" "}
                    {facility.isPublished ? "Published" : "Draft"} ·{" "}
                    {facility.layout ?? "image-top"}
                  </p>
                </div>
                {canPublish ? (
                  <form
                    action={deleteInfrastructureFacility}
                    onSubmit={(event) => {
                      if (!window.confirm(`Delete "${facility.title}"?`)) {
                        event.preventDefault();
                      }
                    }}
                  >
                    <input name="id" type="hidden" value={facility.id} />
                    <button
                      aria-label={`Delete ${facility.title}`}
                      className="grid size-10 place-items-center rounded text-red-700 hover:bg-red-50"
                      type="submit"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </form>
                ) : null}
              </div>
              {editing === facility.id ? (
                <div className="mt-4 border-t pt-4">
                  <Form
                    canPublish={canPublish}
                    facility={facility}
                    cancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <button
                  className="mt-4 min-h-10 rounded border border-gray-300 px-4 text-sm font-bold"
                  onClick={() => {
                    setEditing(facility.id);
                    setAdding(false);
                  }}
                  type="button"
                >
                  Edit
                </button>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-gray-300 bg-white px-5 py-12 text-center">
          <p className="font-semibold">No facilities match this filter</p>
        </div>
      )}
    </div>
  );
}