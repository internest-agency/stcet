"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import {
  ABOUT_ICON_KEYS,
  ABOUT_ICON_LABELS,
} from "@/src/lib/content/about-icons";
import {
  deleteAboutFounder,
  deleteAboutMissionItem,
  deleteAboutTrustPillar,
  moveAboutContent,
  saveAboutChairman,
  saveAboutFounder,
  saveAboutMissionItem,
  saveAboutTrust,
  saveAboutTrustPillar,
  saveAboutVisionMission,
  type SaveResult,
} from "@/src/app/admin/(protected)/about/actions";

type Founder = {
  id: number;
  name: string;
  designation: string | null;
  roleLabel: string | null;
  imagePath: string | null;
  biography: string | null;
  quote: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type Chairman = {
  id: number;
  eyebrow: string | null;
  heading: string | null;
  quote: string | null;
  body: string | null;
  closingStatement: string | null;
  name: string | null;
  designation: string | null;
  imagePath: string | null;
  isPublished: boolean;
} | null;

type VisionMission = {
  id: number;
  visionEyebrow: string | null;
  visionHeading: string | null;
  visionStatement: string | null;
  visionTags: string | null;
  visionImagePath: string | null;
  visionCaptionTitle: string | null;
  visionCaptionSubtitle: string | null;
  missionHeading: string | null;
  missionIntro: string | null;
  missionTags: string | null;
  isPublished: boolean;
} | null;

type MissionItem = {
  id: number;
  title: string;
  description: string | null;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
};

type Trust = {
  id: number;
  eyebrow: string | null;
  heading: string | null;
  intro: string | null;
  closingEyebrow: string | null;
  closingLabel: string | null;
  closingStatement: string | null;
  closingFooter: string | null;
  isPublished: boolean;
} | null;

type TrustPillar = {
  id: number;
  title: string;
  description: string | null;
  tag: string | null;
  icon: string | null;
  sortOrder: number;
  isPublished: boolean;
};

export type AboutAdminData = {
  founders: Founder[];
  chairman: Chairman;
  visionMission: VisionMission;
  missionItems: MissionItem[];
  trust: Trust;
  pillars: TrustPillar[];
};

const input =
  "mt-1 min-h-9 w-full rounded border border-gray-300 px-3 py-1.5 text-sm";
const label = "block text-xs font-semibold text-gray-700";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center rounded-md border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60";

/** Wire a result-returning server action to a form, keeping it mounted on failure. */
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
    <p className="text-xs font-semibold text-red-700" aria-live="polite">
      {error}
    </p>
  );
}

/** Self-contained rich-text field that serializes into the parent form. */
function RichField({
  name,
  label: fieldLabel,
  defaultValue,
  hint,
  minHeight = 140,
}: {
  name: string;
  label: string;
  defaultValue: string | null | undefined;
  hint?: string;
  minHeight?: number;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <RichTextEditor
      hint={hint}
      label={fieldLabel}
      minHeight={minHeight}
      name={name}
      onChange={setValue}
      value={value}
    />
  );
}

/** Self-contained image field that serializes into the parent form. */
function ImageField({
  name,
  label: fieldLabel,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string | null | undefined;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <input name={name} type="hidden" value={value} />
      <ImageUploadField
        category="about"
        compact
        label={fieldLabel}
        onChange={setValue}
        value={value}
      />
    </div>
  );
}

function IconSelect({
  defaultValue,
  fallback = "star",
}: {
  defaultValue?: string | null;
  fallback?: string;
}) {
  return (
    <select
      className={input}
      defaultValue={defaultValue ?? fallback}
      name="icon"
    >
      {ABOUT_ICON_KEYS.map((key) => (
        <option key={key} value={key}>
          {ABOUT_ICON_LABELS[key]}
        </option>
      ))}
    </select>
  );
}

function PublishToggle({ canPublish, defaultValue }: { canPublish: boolean; defaultValue: boolean }) {
  if (!canPublish) {
    return <input name="isPublished" type="hidden" value="off" />;
  }
  return (
    <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-gray-700">
      <input defaultChecked={defaultValue} name="isPublished" type="checkbox" />
      Published
    </label>
  );
}

/* ------------------------------------------------------------------ */
/* Founders                                                            */
/* ------------------------------------------------------------------ */

function FounderForm({
  founder,
  canPublish,
  onCancel,
  onSaved,
}: {
  founder?: Founder;
  canPublish: boolean;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useFormAction(saveAboutFounder, onSaved);
  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      {founder ? <input name="id" type="hidden" value={founder.id} /> : null}
      <label className={label}>
        Name
        <input className={input} defaultValue={founder?.name ?? ""} name="name" required />
      </label>
      <label className={label}>
        Designation (role)
        <input className={input} defaultValue={founder?.designation ?? ""} name="designation" />
      </label>
      <label className={label}>
        Card label
        <input className={input} defaultValue={founder?.roleLabel ?? "Founder"} name="roleLabel" />
      </label>
      <label className={label}>
        Order
        <input
          className={input}
          defaultValue={founder?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      <div className="sm:col-span-2">
        <ImageField defaultValue={founder?.imagePath} label="Portrait" name="imagePath" />
      </div>
      <div className="sm:col-span-2">
        <RichField
          defaultValue={founder?.biography}
          hint="Use paragraphs to separate the biography."
          label="Biography"
          name="biography"
        />
      </div>
      <div className="sm:col-span-2">
        <RichField
          defaultValue={founder?.quote}
          label="Highlighted statement"
          minHeight={90}
          name="quote"
        />
      </div>
      <PublishToggle canPublish={canPublish} defaultValue={founder?.isPublished ?? true} />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>{founder ? "Save founder" : "Add founder"}</SaveButton>
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

function MoveButton({
  entity,
  id,
  direction,
  onSaved,
  disabled,
}: {
  entity: "founder" | "mission-item" | "trust-pillar";
  id: number;
  direction: "up" | "down";
  onSaved: (message: string) => void;
  disabled?: boolean;
}) {
  const action = useFormAction(moveAboutContent, onSaved);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        action.submit(event);
      }}
    >
      <input name="entity" type="hidden" value={entity} />
      <input name="id" type="hidden" value={id} />
      <input name="direction" type="hidden" value={direction} />
      <button
        aria-label={`Move ${direction}`}
        className="rounded p-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
        disabled={disabled || action.pending}
        type="submit"
      >
        {direction === "up" ? (
          <ArrowUp aria-hidden className="size-3.5" />
        ) : (
          <ArrowDown aria-hidden className="size-3.5" />
        )}
      </button>
    </form>
  );
}

function DeleteButton({
  action,
  id,
  confirmText,
  onSaved,
}: {
  action: (formData: FormData) => Promise<SaveResult>;
  id: number;
  confirmText: string;
  onSaved: (message: string) => void;
}) {
  const del = useFormAction(action, onSaved);
  return (
    <form
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
          return;
        }
        del.submit(event);
      }}
    >
      <input name="id" type="hidden" value={id} />
      <button
        aria-label="Delete"
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
  );
}

function FounderCard({
  founder,
  canPublish,
  isFirst,
  isLast,
  onMessage,
}: {
  founder: Founder;
  canPublish: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMessage: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
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
          <span className="truncate text-sm font-semibold text-gray-800">{founder.name}</span>
          <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {founder.isPublished ? "Published" : "Draft"}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-gray-400">#{founder.sortOrder}</span>
          <MoveButton
            direction="up"
            disabled={isFirst}
            entity="founder"
            id={founder.id}
            onSaved={onMessage}
          />
          <MoveButton
            direction="down"
            disabled={isLast}
            entity="founder"
            id={founder.id}
            onSaved={onMessage}
          />
          {canPublish ? (
            <DeleteButton
              action={deleteAboutFounder}
              confirmText={`Remove “${founder.name}”?`}
              id={founder.id}
              onSaved={onMessage}
            />
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="px-3 pb-3">
          <FounderForm canPublish={canPublish} founder={founder} onSaved={onMessage} />
        </div>
      ) : null}
    </div>
  );
}

function FoundersTab({
  founders,
  canPublish,
  onMessage,
}: {
  founders: Founder[];
  canPublish: boolean;
  onMessage: (message: string) => void;
}) {
  const [adding, setAdding] = useState(false);
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {founders.length} {founders.length === 1 ? "founder" : "founders"}
        </p>
        <button className={ghostButton} onClick={() => setAdding((value) => !value)} type="button">
          <Plus aria-hidden className="size-3.5" /> Add founder
        </button>
      </div>

      {adding ? (
        <div className="rounded-md border border-dashed border-primary-300 bg-primary-50/40 p-3">
          <p className="text-sm font-bold text-gray-800">New founder</p>
          <FounderForm
            canPublish={canPublish}
            onCancel={() => setAdding(false)}
            onSaved={(message) => {
              onMessage(message);
              setAdding(false);
            }}
          />
        </div>
      ) : null}

      {founders.length === 0 && !adding ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No founders yet. Use “Add founder” to create one.
        </p>
      ) : null}

      <div className="space-y-2">
        {founders.map((founder, index) => (
          <FounderCard
            canPublish={canPublish}
            founder={founder}
            isFirst={index === 0}
            isLast={index === founders.length - 1}
            key={founder.id}
            onMessage={onMessage}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chairman                                                            */
/* ------------------------------------------------------------------ */

function ChairmanTab({
  chairman,
  canPublish,
  onMessage,
}: {
  chairman: Chairman;
  canPublish: boolean;
  onMessage: (message: string) => void;
}) {
  const form = useFormAction(saveAboutChairman, onMessage);
  return (
    <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.submit}>
      <label className={label}>
        Eyebrow
        <input className={input} defaultValue={chairman?.eyebrow ?? ""} name="eyebrow" />
      </label>
      <label className={label}>
        Name (signature)
        <input className={input} defaultValue={chairman?.name ?? ""} name="name" />
      </label>
      <label className={label}>
        Designation (signature)
        <input className={input} defaultValue={chairman?.designation ?? ""} name="designation" />
      </label>
      <div className="sm:col-span-2">
        <ImageField defaultValue={chairman?.imagePath} label="Portrait" name="imagePath" />
      </div>
      <div className="sm:col-span-2">
        <RichField
          defaultValue={chairman?.heading}
          hint="Line breaks are preserved. You may emphasise words."
          label="Heading"
          minHeight={90}
          name="heading"
        />
      </div>
      <div className="sm:col-span-2">
        <RichField defaultValue={chairman?.quote} label="Opening quote" name="quote" />
      </div>
      <div className="sm:col-span-2">
        <RichField
          defaultValue={chairman?.body}
          hint="Use paragraphs to separate the message."
          label="Message paragraphs"
          name="body"
        />
      </div>
      <div className="sm:col-span-2">
        <RichField
          defaultValue={chairman?.closingStatement}
          label="Closing statement (optional)"
          minHeight={90}
          name="closingStatement"
        />
      </div>
      <PublishToggle canPublish={canPublish} defaultValue={chairman?.isPublished ?? true} />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>Save message</SaveButton>
        <FormError error={form.error} />
      </div>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Vision & Mission                                                    */
/* ------------------------------------------------------------------ */

function MissionItemForm({
  item,
  canPublish,
  onCancel,
  onSaved,
}: {
  item?: MissionItem;
  canPublish: boolean;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useFormAction(saveAboutMissionItem, onSaved);
  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      {item ? <input name="id" type="hidden" value={item.id} /> : null}
      <label className={label}>
        Title
        <input className={input} defaultValue={item?.title ?? ""} name="title" required />
      </label>
      <label className={label}>
        Icon
        <IconSelect defaultValue={item?.icon} fallback="graduation-cap" />
      </label>
      <label className={label}>
        Order
        <input
          className={input}
          defaultValue={item?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      <div className="sm:col-span-2">
        <RichField defaultValue={item?.description} label="Description" name="description" />
      </div>
      <PublishToggle canPublish={canPublish} defaultValue={item?.isPublished ?? true} />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>{item ? "Save item" : "Add item"}</SaveButton>
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

function MissionItemCard({
  item,
  canPublish,
  isFirst,
  isLast,
  onMessage,
}: {
  item: MissionItem;
  canPublish: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMessage: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
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
          <span className="truncate text-sm font-semibold text-gray-800">{item.title}</span>
          {!item.isPublished ? (
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
              Draft
            </span>
          ) : null}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-gray-400">#{item.sortOrder}</span>
          <MoveButton
            direction="up"
            disabled={isFirst}
            entity="mission-item"
            id={item.id}
            onSaved={onMessage}
          />
          <MoveButton
            direction="down"
            disabled={isLast}
            entity="mission-item"
            id={item.id}
            onSaved={onMessage}
          />
          {canPublish ? (
            <DeleteButton
              action={deleteAboutMissionItem}
              confirmText={`Delete “${item.title}”?`}
              id={item.id}
              onSaved={onMessage}
            />
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="px-3 pb-3">
          <MissionItemForm canPublish={canPublish} item={item} onSaved={onMessage} />
        </div>
      ) : null}
    </div>
  );
}

function VisionMissionTab({
  visionMission,
  missionItems,
  canPublish,
  onMessage,
}: {
  visionMission: VisionMission;
  missionItems: MissionItem[];
  canPublish: boolean;
  onMessage: (message: string) => void;
}) {
  const form = useFormAction(saveAboutVisionMission, onMessage);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.submit}>
        <label className={label}>
          Vision eyebrow
          <input className={input} defaultValue={visionMission?.visionEyebrow ?? ""} name="visionEyebrow" />
        </label>
        <label className={label}>
          Vision tags
          <input
            className={input}
            defaultValue={visionMission?.visionTags ?? ""}
            name="visionTags"
            placeholder="People, Progress, A Better Tomorrow"
          />
        </label>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={visionMission?.visionHeading}
            hint="Line breaks are preserved. You may emphasise words with the toolbar."
            label="Vision heading"
            minHeight={90}
            name="visionHeading"
          />
        </div>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={visionMission?.visionStatement}
            label="Vision statement"
            name="visionStatement"
          />
        </div>
        <label className={label}>
          Vision image caption (title)
          <input
            className={input}
            defaultValue={visionMission?.visionCaptionTitle ?? ""}
            name="visionCaptionTitle"
          />
        </label>
        <label className={label}>
          Vision image caption (subtitle)
          <input
            className={input}
            defaultValue={visionMission?.visionCaptionSubtitle ?? ""}
            name="visionCaptionSubtitle"
          />
        </label>
        <div className="sm:col-span-2">
          <ImageField
            defaultValue={visionMission?.visionImagePath}
            label="Campus image (optional – replaces the default campus photo)"
            name="visionImagePath"
          />
        </div>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={visionMission?.missionHeading}
            hint="Line breaks are preserved."
            label="Mission heading"
            minHeight={90}
            name="missionHeading"
          />
        </div>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={visionMission?.missionIntro}
            label="Mission introduction"
            minHeight={90}
            name="missionIntro"
          />
        </div>
        <label className={label}>
          Mission tags
          <input
            className={input}
            defaultValue={visionMission?.missionTags ?? ""}
            name="missionTags"
            placeholder="Educate, Innovate, Empower"
          />
        </label>
        <PublishToggle canPublish={canPublish} defaultValue={visionMission?.isPublished ?? true} />
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <SaveButton pending={form.pending}>Save vision &amp; mission</SaveButton>
          <FormError error={form.error} />
        </div>
      </form>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">
            Mission items
          </h4>
          <button className={ghostButton} onClick={() => setAdding((value) => !value)} type="button">
            <Plus aria-hidden className="size-3.5" /> Add item
          </button>
        </div>
        {adding ? (
          <div className="mt-3 rounded-md border border-dashed border-primary-300 bg-primary-50/40 p-3">
            <p className="text-sm font-bold text-gray-800">New mission item</p>
            <MissionItemForm
              canPublish={canPublish}
              onCancel={() => setAdding(false)}
              onSaved={(message) => {
                onMessage(message);
                setAdding(false);
              }}
            />
          </div>
        ) : null}
        <div className="mt-3 space-y-2">
          {missionItems.length === 0 && !adding ? (
            <p className="text-xs text-gray-400">No mission items yet.</p>
          ) : null}
          {missionItems.map((item, index) => (
            <MissionItemCard
              canPublish={canPublish}
              isFirst={index === 0}
              isLast={index === missionItems.length - 1}
              item={item}
              key={item.id}
              onMessage={onMessage}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Our Trust                                                           */
/* ------------------------------------------------------------------ */

function PillarForm({
  pillar,
  canPublish,
  onCancel,
  onSaved,
}: {
  pillar?: TrustPillar;
  canPublish: boolean;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useFormAction(saveAboutTrustPillar, onSaved);
  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      {pillar ? <input name="id" type="hidden" value={pillar.id} /> : null}
      <label className={label}>
        Title
        <input className={input} defaultValue={pillar?.title ?? ""} name="title" required />
      </label>
      <label className={label}>
        Footer tag
        <input className={input} defaultValue={pillar?.tag ?? ""} name="tag" />
      </label>
      <label className={label}>
        Icon
        <IconSelect defaultValue={pillar?.icon} fallback="star" />
      </label>
      <label className={label}>
        Order
        <input
          className={input}
          defaultValue={pillar?.sortOrder ?? 0}
          min="0"
          name="sortOrder"
          type="number"
        />
      </label>
      <div className="sm:col-span-2">
        <RichField defaultValue={pillar?.description} label="Description" name="description" />
      </div>
      <PublishToggle canPublish={canPublish} defaultValue={pillar?.isPublished ?? true} />
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>{pillar ? "Save pillar" : "Add pillar"}</SaveButton>
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

function PillarCard({
  pillar,
  canPublish,
  isFirst,
  isLast,
  onMessage,
}: {
  pillar: TrustPillar;
  canPublish: boolean;
  isFirst: boolean;
  isLast: boolean;
  onMessage: (message: string) => void;
}) {
  const [open, setOpen] = useState(false);
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
          <span className="truncate text-sm font-semibold text-gray-800">{pillar.title}</span>
          {!pillar.isPublished ? (
            <span className="shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
              Draft
            </span>
          ) : null}
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-[10px] text-gray-400">#{pillar.sortOrder}</span>
          <MoveButton
            direction="up"
            disabled={isFirst}
            entity="trust-pillar"
            id={pillar.id}
            onSaved={onMessage}
          />
          <MoveButton
            direction="down"
            disabled={isLast}
            entity="trust-pillar"
            id={pillar.id}
            onSaved={onMessage}
          />
          {canPublish ? (
            <DeleteButton
              action={deleteAboutTrustPillar}
              confirmText={`Delete “${pillar.title}”?`}
              id={pillar.id}
              onSaved={onMessage}
            />
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="px-3 pb-3">
          <PillarForm canPublish={canPublish} pillar={pillar} onSaved={onMessage} />
        </div>
      ) : null}
    </div>
  );
}

function TrustTab({
  trust,
  pillars,
  canPublish,
  onMessage,
}: {
  trust: Trust;
  pillars: TrustPillar[];
  canPublish: boolean;
  onMessage: (message: string) => void;
}) {
  const form = useFormAction(saveAboutTrust, onMessage);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <form className="grid gap-3 sm:grid-cols-2" onSubmit={form.submit}>
        <label className={label}>
          Eyebrow
          <input className={input} defaultValue={trust?.eyebrow ?? ""} name="eyebrow" />
        </label>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={trust?.heading}
            hint="Line breaks are preserved. You may emphasise words with the toolbar."
            label="Heading"
            minHeight={90}
            name="heading"
          />
        </div>
        <div className="sm:col-span-2">
          <RichField defaultValue={trust?.intro} label="Introduction" name="intro" />
        </div>
        <label className={label}>
          Closing eyebrow
          <input className={input} defaultValue={trust?.closingEyebrow ?? ""} name="closingEyebrow" />
        </label>
        <label className={label}>
          Closing label
          <input className={input} defaultValue={trust?.closingLabel ?? ""} name="closingLabel" />
        </label>
        <div className="sm:col-span-2">
          <RichField
            defaultValue={trust?.closingStatement}
            label="Closing statement"
            name="closingStatement"
          />
        </div>
        <label className={label}>
          Closing footer
          <input className={input} defaultValue={trust?.closingFooter ?? ""} name="closingFooter" />
        </label>
        <PublishToggle canPublish={canPublish} defaultValue={trust?.isPublished ?? true} />
        <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
          <SaveButton pending={form.pending}>Save trust content</SaveButton>
          <FormError error={form.error} />
        </div>
      </form>

      <div className="border-t border-gray-100 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wide text-gray-500">Trust pillars</h4>
          <button className={ghostButton} onClick={() => setAdding((value) => !value)} type="button">
            <Plus aria-hidden className="size-3.5" /> Add pillar
          </button>
        </div>
        {adding ? (
          <div className="mt-3 rounded-md border border-dashed border-primary-300 bg-primary-50/40 p-3">
            <p className="text-sm font-bold text-gray-800">New pillar</p>
            <PillarForm
              canPublish={canPublish}
              onCancel={() => setAdding(false)}
              onSaved={(message) => {
                onMessage(message);
                setAdding(false);
              }}
            />
          </div>
        ) : null}
        <div className="mt-3 space-y-2">
          {pillars.length === 0 && !adding ? (
            <p className="text-xs text-gray-400">No pillars yet.</p>
          ) : null}
          {pillars.map((pillar, index) => (
            <PillarCard
              canPublish={canPublish}
              isFirst={index === 0}
              isLast={index === pillars.length - 1}
              key={pillar.id}
              onMessage={onMessage}
              pillar={pillar}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

const TABS = [
  { id: "founders", label: "Our Founders" },
  { id: "chairman", label: "Chairman's Message" },
  { id: "vision", label: "Vision & Mission" },
  { id: "trust", label: "Our Trust" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-selected={active}
      className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-bold transition ${
        active
          ? "bg-primary-700 text-white"
          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
      }`}
      onClick={onClick}
      role="tab"
      type="button"
    >
      {children}
    </button>
  );
}

export default function AboutContentManager({
  data,
  canPublish,
}: {
  data: AboutAdminData;
  canPublish: boolean;
}) {
  const [tab, setTab] = useState<TabId>("founders");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 rounded-lg border border-gray-200 bg-white p-1" role="tablist">
        {TABS.map((item) => (
          <TabButton
            active={tab === item.id}
            key={item.id}
            onClick={() => {
              setTab(item.id);
              setMessage(null);
            }}
          >
            {item.label}
          </TabButton>
        ))}
      </div>

      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-800"
        >
          {message}
        </p>
      ) : null}

      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {tab === "founders" ? (
          <FoundersTab canPublish={canPublish} founders={data.founders} onMessage={setMessage} />
        ) : null}
        {tab === "chairman" ? (
          <ChairmanTab canPublish={canPublish} chairman={data.chairman} onMessage={setMessage} />
        ) : null}
        {tab === "vision" ? (
          <VisionMissionTab
            canPublish={canPublish}
            missionItems={data.missionItems}
            onMessage={setMessage}
            visionMission={data.visionMission}
          />
        ) : null}
        {tab === "trust" ? (
          <TrustTab
            canPublish={canPublish}
            onMessage={setMessage}
            pillars={data.pillars}
            trust={data.trust}
          />
        ) : null}
      </div>
    </div>
  );
}
