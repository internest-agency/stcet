"use client";

import { useId, useState, type ReactNode } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";

type ModuleRow = {
  number: string;
  title: string;
  description: string;
  image: string;
};
type OpportunityRow = { title: string };
type ReasonRow = { number: string; title: string; description: string };
type PathwayRow = {
  number: string;
  title: string;
  image: string;
  rolesText: string;
};
type FuturePathRow = { number: string; title: string; description: string };

export type CourseEditorValues = {
  name: string;
  slug: string;
  degree: string;
  tagline: string;
  description: string;
  heroImage: string;
  seoTitle: string;
  metaDescription: string;
  canonicalUrl: string;
  ogImage: string;
  noIndex: boolean;
  isPublished: boolean;
  modules: ModuleRow[];
  opportunities: OpportunityRow[];
  reasons: ReasonRow[];
  careerPathways: PathwayRow[];
  futurePaths: FuturePathRow[];
};

type CourseAction = (formData: FormData) => Promise<void>;

const blankValues: CourseEditorValues = {
  name: "",
  slug: "",
  degree: "",
  tagline: "",
  description: "",
  heroImage: "",
  seoTitle: "",
  metaDescription: "",
  canonicalUrl: "",
  ogImage: "",
  noIndex: true,
  isPublished: false,
  modules: [],
  opportunities: [],
  reasons: [],
  careerPathways: [],
  futurePaths: [],
};

function fieldClass() {
  return "mt-1.5 w-full rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-primary-600 focus:ring-2 focus:ring-primary-100";
}

function TextField({
  label,
  value,
  onChange,
  required = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
      {label}
      <input
        className={fieldClass()}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  required = false,
  rows = 3,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  hint?: string;
}) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
      {label}
      <textarea
        className={`${fieldClass()} resize-y`}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        value={value}
      />
      {hint ? (
        <span className="mt-1 block text-xs font-normal text-gray-500">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

function moveRow<T>(rows: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction;
  if (nextIndex < 0 || nextIndex >= rows.length) return rows;
  const updated = [...rows];
  [updated[index], updated[nextIndex]] = [updated[nextIndex], updated[index]];
  return updated;
}

function Repeater<T>({
  title,
  description,
  rows,
  makeRow,
  onChange,
  renderRow,
}: {
  title: string;
  description: string;
  rows: T[];
  makeRow: () => T;
  onChange: (rows: T[]) => void;
  renderRow: (
    row: T,
    update: (patch: Partial<T>) => void,
    index: number,
  ) => ReactNode;
}) {
  return (
    <section className="rounded-md border border-gray-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 px-4 py-4 sm:px-5">
        <div>
          <h3 className="font-bold text-gray-900">{title}</h3>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <button
          className="inline-flex min-h-9 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50"
          onClick={() => onChange([...rows, makeRow()])}
          type="button"
        >
          <Plus aria-hidden className="size-4" /> Add item
        </button>
      </div>
      {rows.length ? (
        <ol className="divide-y divide-gray-100">
          {rows.map((row, index) => {
            const update = (patch: Partial<T>) => {
              onChange(
                rows.map((item, itemIndex) =>
                  itemIndex === index ? { ...item, ...patch } : item,
                ),
              );
            };

            return (
              <li className="p-4 sm:p-5" key={index}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                    Item {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="flex gap-1">
                    <button
                      aria-label={`Move item ${index + 1} up`}
                      className="grid size-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      disabled={index === 0}
                      onClick={() => onChange(moveRow(rows, index, -1))}
                      title="Move up"
                      type="button"
                    >
                      <ArrowUp aria-hidden className="size-4" />
                    </button>
                    <button
                      aria-label={`Move item ${index + 1} down`}
                      className="grid size-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 disabled:opacity-30"
                      disabled={index === rows.length - 1}
                      onClick={() => onChange(moveRow(rows, index, 1))}
                      title="Move down"
                      type="button"
                    >
                      <ArrowDown aria-hidden className="size-4" />
                    </button>
                    <button
                      aria-label={`Remove item ${index + 1}`}
                      className="grid size-8 place-items-center rounded-md text-red-600 hover:bg-red-50"
                      onClick={() =>
                        onChange(
                          rows.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      title="Remove item"
                      type="button"
                    >
                      <Trash2 aria-hidden className="size-4" />
                    </button>
                  </div>
                </div>
                {renderRow(row, update, index)}
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="px-5 py-7 text-sm text-gray-500">No items added.</p>
      )}
    </section>
  );
}

export default function CourseEditor({
  initial,
  action,
  courseId,
  canPublish,
  error,
  saved,
}: {
  initial?: CourseEditorValues;
  action: CourseAction;
  courseId?: number;
  canPublish: boolean;
  error?: string;
  saved?: boolean;
}) {
  const [values, setValues] = useState<CourseEditorValues>(
    () => initial ?? blankValues,
  );
  const set = <K extends keyof CourseEditorValues>(
    key: K,
    value: CourseEditorValues[K],
  ) => {
    setValues((current) => ({ ...current, [key]: value }));
  };
  const payload = {
    ...values,
    careerPathways: values.careerPathways.map(({ rolesText, ...pathway }) => ({
      ...pathway,
      roles: rolesText
        .split(/\r?\n/)
        .map((role) => role.trim())
        .filter(Boolean),
    })),
  };

  return (
    <form action={action} className="space-y-5">
      {courseId ? (
        <input name="courseId" type="hidden" value={courseId} />
      ) : null}
      <input name="content" type="hidden" value={JSON.stringify(payload)} />
      {error ? (
        <p
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {error}
        </p>
      ) : null}
      {saved ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm text-secondary-900"
        >
          Course changes saved.
        </p>
      ) : null}

      <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-900">Overview</h3>
          <p className="mt-1 text-xs text-gray-500">
            Core information used by the public course page.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Course name"
            onChange={(value) => set("name", value)}
            required
            value={values.name}
          />
          <TextField
            label="Slug"
            onChange={(value) => set("slug", value)}
            required
            value={values.slug}
          />
          <TextField
            label="Degree"
            onChange={(value) => set("degree", value)}
            placeholder="e.g. B.E."
            required
            value={values.degree}
          />
          <TextField
            label="Tagline"
            onChange={(value) => set("tagline", value)}
            value={values.tagline}
          />
          <ImageUploadField
            category="courses/heroes"
            label="Hero image"
            onChange={(value) => set("heroImage", value)}
            value={values.heroImage}
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Description"
              onChange={(value) => set("description", value)}
              rows={5}
              value={values.description}
            />
          </div>
        </div>
        {canPublish ? (
          <label className="mt-5 flex min-h-11 items-center gap-3 border-t border-gray-100 pt-4 text-sm font-semibold text-gray-800">
            <input
              checked={values.isPublished}
              className="size-4 accent-primary-700"
              onChange={(event) => set("isPublished", event.target.checked)}
              type="checkbox"
            />
            Published on the public website
          </label>
        ) : (
          <p className="mt-5 border-t border-gray-100 pt-4 text-xs text-gray-500">
            Editors can save drafts. An administrator controls publication.
          </p>
        )}
      </section>

      <Repeater
        description="Curriculum slides shown in their saved order."
        makeRow={() => ({
          number: String(values.modules.length + 1).padStart(2, "0"),
          title: "",
          description: "",
          image: "",
        })}
        onChange={(rows) => set("modules", rows)}
        renderRow={(row, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <TextAreaField
              label="Description"
              onChange={(description) => update({ description })}
              required
              value={row.description}
            />
            <ImageUploadField
              category="courses/modules"
              label="Module image"
              onChange={(image) => update({ image })}
              value={row.image}
            />
          </div>
        )}
        rows={values.modules}
        title="Learning modules"
      />

      <Repeater
        description="Opportunity areas displayed on the course page."
        makeRow={() => ({ title: "" })}
        onChange={(rows) => set("opportunities", rows)}
        renderRow={(row, update) => (
          <TextField
            label="Opportunity"
            onChange={(title) => update({ title })}
            required
            value={row.title}
          />
        )}
        rows={values.opportunities}
        title="Opportunities"
      />

      <Repeater
        description="Numbered reasons with supporting descriptions."
        makeRow={() => ({
          number: String(values.reasons.length + 1).padStart(2, "0"),
          title: "",
          description: "",
        })}
        onChange={(rows) => set("reasons", rows)}
        renderRow={(row, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                onChange={(description) => update({ description })}
                required
                value={row.description}
              />
            </div>
          </div>
        )}
        rows={values.reasons}
        title="Why study"
      />

      <Repeater
        description="Career pathways and their associated roles. Put one role on each line."
        makeRow={() => ({
          number: String(values.careerPathways.length + 1).padStart(2, "0"),
          title: "",
          image: "",
          rolesText: "",
        })}
        onChange={(rows) => set("careerPathways", rows)}
        renderRow={(row, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Pathway title"
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <ImageUploadField
              category="courses/careers"
              label="Career pathway image"
              onChange={(image) => update({ image })}
              value={row.image}
            />
            <TextAreaField
              hint="Each non-empty line becomes an ordered career role."
              label="Career roles"
              onChange={(rolesText) => update({ rolesText })}
              rows={4}
              value={row.rolesText}
            />
          </div>
        )}
        rows={values.careerPathways}
        title="Career pathways and roles"
      />

      <Repeater
        description="Additional future-facing pathways and descriptions."
        makeRow={() => ({
          number: String(values.futurePaths.length + 1).padStart(2, "0"),
          title: "",
          description: "",
        })}
        onChange={(rows) => set("futurePaths", rows)}
        renderRow={(row, update) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                onChange={(description) => update({ description })}
                required
                value={row.description}
              />
            </div>
          </div>
        )}
        rows={values.futurePaths}
        title="Future paths"
      />

      <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-900">SEO</h3>
          <p className="mt-1 text-xs text-gray-500">
            Metadata is managed here; public metadata integration remains staged
            separately.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="SEO title"
            onChange={(value) => set("seoTitle", value)}
            value={values.seoTitle}
          />
          <ImageUploadField
            category="courses/heroes"
            label="Open Graph image"
            onChange={(value) => set("ogImage", value)}
            value={values.ogImage}
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Meta description"
              onChange={(value) => set("metaDescription", value)}
              rows={3}
              value={values.metaDescription}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label="Canonical URL"
              onChange={(value) => set("canonicalUrl", value)}
              value={values.canonicalUrl}
            />
          </div>
        </div>
        <label className="mt-5 flex min-h-11 items-center gap-3 border-t border-gray-100 pt-4 text-sm font-semibold text-gray-800">
          <input
            checked={values.noIndex}
            className="size-4 accent-primary-700"
            onChange={(event) => set("noIndex", event.target.checked)}
            type="checkbox"
          />
          Ask search engines not to index this course
        </label>
      </section>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-gray-100/95 px-4 py-3 backdrop-blur sm:-mx-7 sm:px-7">
        <p className="hidden text-xs text-gray-500 sm:block">
          Repeating content is saved together in one database transaction.
        </p>
        <button
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-700 px-5 py-2 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
          type="submit"
        >
          <Save aria-hidden className="size-4" /> Save course
        </button>
      </div>
    </form>
  );
}
