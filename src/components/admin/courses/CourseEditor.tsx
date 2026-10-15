"use client";

import { useActionState, useId, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowUp,
  LoaderCircle,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import type { CourseFormState } from "@/src/lib/admin/course-validation";

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
  overviewHeading: string;
  overviewKeyStatement: string;
  curriculumTitle: string;
  curriculumIntro: string;
  opportunityTitle: string;
  whyStudyLabel: string;
  whyStudyHeading: string;
  whyStudyIntro: string;
  careerTitle: string;
  careerIntro: string;
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

type CourseAction = (
  state: CourseFormState,
  formData: FormData,
) => Promise<CourseFormState>;

const blankValues: CourseEditorValues = {
  name: "",
  slug: "",
  degree: "",
  tagline: "",
  description: "",
  heroImage: "",
  overviewHeading: "",
  overviewKeyStatement: "",
  curriculumTitle: "",
  curriculumIntro: "",
  opportunityTitle: "",
  whyStudyLabel: "",
  whyStudyHeading: "",
  whyStudyIntro: "",
  careerTitle: "",
  careerIntro: "",
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
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
      {label}
      <input
        aria-invalid={error ? true : undefined}
        className={fieldClass()}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        value={value}
      />
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-red-700">
          {error}
        </span>
      ) : null}
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
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  hint?: string;
  error?: string;
}) {
  const id = useId();
  return (
    <label className="block text-sm font-semibold text-gray-700" htmlFor={id}>
      {label}
      <textarea
        aria-invalid={error ? true : undefined}
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
      {error ? (
        <span className="mt-1 block text-xs font-semibold text-red-700">
          {error}
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

  // The action returns a state object on failure (instead of redirecting), so
  // the component never unmounts and every entered value is preserved. It only
  // navigates away on a confirmed successful save.
  const [state, formAction, isPending] = useActionState(action, {
    fieldErrors: {},
  });
  const fieldErrors = state.fieldErrors ?? {};
  const fieldError = (key: string) => fieldErrors[key];
  const firstError = (prefix: string) => {
    if (fieldErrors[prefix]) return fieldErrors[prefix];
    const match = Object.keys(fieldErrors).find((key) =>
      key.startsWith(`${prefix}.`),
    );
    return match ? fieldErrors[match] : undefined;
  };
  const bannerError = state.formError ?? error;

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
    <form action={formAction} className="space-y-5">
      {courseId ? (
        <input name="courseId" type="hidden" value={courseId} />
      ) : null}
      <input name="content" type="hidden" value={JSON.stringify(payload)} />
      {bannerError ? (
        <p
          aria-live="polite"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {bannerError}
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
            error={fieldError("name")}
            onChange={(value) => set("name", value)}
            required
            value={values.name}
          />
          <TextField
            label="Slug"
            error={fieldError("slug")}
            onChange={(value) => set("slug", value)}
            required
            value={values.slug}
          />
          <TextField
            label="Degree"
            error={fieldError("degree")}
            onChange={(value) => set("degree", value)}
            placeholder="e.g. B.E."
            required
            value={values.degree}
          />
          <TextField
            label="Tagline"
            error={fieldError("tagline")}
            onChange={(value) => set("tagline", value)}
            value={values.tagline}
          />
          <ImageUploadField
            category="courses/heroes"
            error={fieldError("heroImage")}
            label="Hero image"
            onChange={(value) => set("heroImage", value)}
            value={values.heroImage}
          />
          <div className="md:col-span-2">
            <RichTextEditor
              label="Description"
              error={fieldError("description")}
              hint="Formatting is supported. This copy becomes the public overview paragraphs."
              minHeight={180}
              onChange={(value) => set("description", value)}
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

      <section className="rounded-md border border-gray-200 bg-white p-4 sm:p-5">
        <div className="mb-5 border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-900">
            Section headings &amp; intros
          </h3>
          <p className="mt-1 text-xs text-gray-500">
            Headings and intro copy for each section of the public course page.
            Leave a field empty to fall back to the bundled course content.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Overview heading"
            error={fieldError("overviewHeading")}
            onChange={(value) => set("overviewHeading", value)}
            value={values.overviewHeading}
          />
          <TextField
            label="Curriculum section title"
            error={fieldError("curriculumTitle")}
            onChange={(value) => set("curriculumTitle", value)}
            value={values.curriculumTitle}
          />
          <div className="md:col-span-2">
            <RichTextEditor
              label="Overview key statement"
              error={fieldError("overviewKeyStatement")}
              minHeight={90}
              onChange={(value) => set("overviewKeyStatement", value)}
              value={values.overviewKeyStatement}
            />
          </div>
          <div className="md:col-span-2">
            <RichTextEditor
              label="Curriculum intro"
              error={fieldError("curriculumIntro")}
              minHeight={90}
              onChange={(value) => set("curriculumIntro", value)}
              value={values.curriculumIntro}
            />
          </div>
          <TextField
            label="Opportunity areas title"
            error={fieldError("opportunityTitle")}
            onChange={(value) => set("opportunityTitle", value)}
            value={values.opportunityTitle}
          />
          <TextField
            label="Why study label"
            error={fieldError("whyStudyLabel")}
            onChange={(value) => set("whyStudyLabel", value)}
            value={values.whyStudyLabel}
          />
          <TextField
            label="Why study heading"
            error={fieldError("whyStudyHeading")}
            onChange={(value) => set("whyStudyHeading", value)}
            value={values.whyStudyHeading}
          />
          <div className="md:col-span-2">
            <RichTextEditor
              label="Why study intro"
              error={fieldError("whyStudyIntro")}
              minHeight={90}
              onChange={(value) => set("whyStudyIntro", value)}
              value={values.whyStudyIntro}
            />
          </div>
          <TextField
            label="Career pathways title"
            error={fieldError("careerTitle")}
            onChange={(value) => set("careerTitle", value)}
            value={values.careerTitle}
          />
          <div className="md:col-span-2">
            <RichTextEditor
              label="Career pathways intro"
              error={fieldError("careerIntro")}
              minHeight={90}
              onChange={(value) => set("careerIntro", value)}
              value={values.careerIntro}
            />
          </div>
        </div>
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
        renderRow={(row, update, index) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              error={fieldError(`modules.${index}.number`)}
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              error={fieldError(`modules.${index}.title`)}
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <TextAreaField
              label="Description"
              error={fieldError(`modules.${index}.description`)}
              onChange={(description) => update({ description })}
              required
              value={row.description}
            />
            <ImageUploadField
              category="courses/modules"
              error={fieldError(`modules.${index}.image`)}
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
        renderRow={(row, update, index) => (
          <TextField
            label="Opportunity"
            error={fieldError(`opportunities.${index}.title`)}
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
        renderRow={(row, update, index) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              error={fieldError(`reasons.${index}.number`)}
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              error={fieldError(`reasons.${index}.title`)}
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                error={fieldError(`reasons.${index}.description`)}
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
        renderRow={(row, update, index) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              error={fieldError(`careerPathways.${index}.number`)}
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Pathway title"
              error={fieldError(`careerPathways.${index}.title`)}
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <ImageUploadField
              category="courses/careers"
              error={fieldError(`careerPathways.${index}.image`)}
              label="Career pathway image"
              onChange={(image) => update({ image })}
              value={row.image}
            />
            <TextAreaField
              hint="Each non-empty line becomes an ordered career role."
              label="Career roles"
              error={firstError(`careerPathways.${index}.roles`)}
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
        renderRow={(row, update, index) => (
          <div className="grid gap-3 md:grid-cols-2">
            <TextField
              label="Number"
              error={fieldError(`futurePaths.${index}.number`)}
              onChange={(number) => update({ number })}
              required
              value={row.number}
            />
            <TextField
              label="Title"
              error={fieldError(`futurePaths.${index}.title`)}
              onChange={(title) => update({ title })}
              required
              value={row.title}
            />
            <div className="md:col-span-2">
              <TextAreaField
                label="Description"
                error={fieldError(`futurePaths.${index}.description`)}
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
            error={fieldError("seoTitle")}
            onChange={(value) => set("seoTitle", value)}
            value={values.seoTitle}
          />
          <ImageUploadField
            category="courses/heroes"
            error={fieldError("ogImage")}
            label="Open Graph image"
            onChange={(value) => set("ogImage", value)}
            value={values.ogImage}
          />
          <div className="md:col-span-2">
            <TextAreaField
              label="Meta description"
              error={fieldError("metaDescription")}
              onChange={(value) => set("metaDescription", value)}
              rows={3}
              value={values.metaDescription}
            />
          </div>
          <div className="md:col-span-2">
            <TextField
              label="Canonical URL"
              error={fieldError("canonicalUrl")}
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
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary-700 px-5 py-2 text-sm font-bold text-white hover:bg-primary-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isPending}
          type="submit"
        >
          {isPending ? (
            <>
              <LoaderCircle aria-hidden className="size-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save aria-hidden className="size-4" /> Save course
            </>
          )}
        </button>
      </div>
    </form>
  );
}
