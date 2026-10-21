"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowDown,
  ArrowUp,
  ChevronDown,
  Loader2,
  Plus,
  Save,
  Star,
  Trash2,
} from "lucide-react";

import ImageUploadField from "@/src/components/admin/ImageUploadField";
import RichTextEditor from "@/src/components/admin/RichTextEditor";
import {
  deleteEvent,
  moveEvent,
  saveEvent,
  type EventResult,
} from "@/src/app/admin/(protected)/events/actions";
import { formatEventDateRange } from "@/src/lib/events/datetime";

export type EventRecord = {
  id: number;
  title: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  category: string | null;
  imagePath: string | null;
  imageAlt: string | null;
  startDate: string;
  startTime: string | null;
  endDate: string | null;
  endTime: string | null;
  isAllDay: boolean;
  venue: string | null;
  locationDetails: string | null;
  registrationUrl: string | null;
  websiteUrl: string | null;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

const input =
  "mt-1 min-h-9 w-full rounded border border-gray-300 px-3 py-1.5 text-sm";
const textarea = `${input} min-h-24`;
const label = "block text-xs font-semibold text-gray-700";
const primaryButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md bg-primary-700 px-3 text-sm font-bold text-white hover:bg-primary-800 disabled:opacity-60";
const ghostButton =
  "inline-flex min-h-9 items-center gap-2 rounded-md border border-gray-300 px-3 text-sm font-bold text-gray-700 hover:bg-gray-50 disabled:opacity-60";

/** Wire a result-returning server action to a form, keeping it mounted on failure. */
function useFormAction(
  action: (formData: FormData) => Promise<EventResult>,
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
  fieldLabel,
  defaultValue,
  hint,
}: {
  name: string;
  fieldLabel: string;
  defaultValue: string | null | undefined;
  hint?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <RichTextEditor
      hint={hint}
      label={fieldLabel}
      name={name}
      onChange={setValue}
      value={value}
    />
  );
}

/** Self-contained image field that serializes into the parent form. */
function ImageField({
  name,
  fieldLabel,
  defaultValue,
}: {
  name: string;
  fieldLabel: string;
  defaultValue: string | null | undefined;
}) {
  const [value, setValue] = useState(defaultValue ?? "");
  return (
    <div>
      <input name={name} type="hidden" value={value} />
      <ImageUploadField
        category="events"
        compact
        label={fieldLabel}
        onChange={setValue}
        value={value}
      />
    </div>
  );
}

function PublishToggle({
  canPublish,
  defaultValue,
}: {
  canPublish: boolean;
  defaultValue: boolean;
}) {
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

function EventForm({
  event,
  canPublish,
  onCancel,
  onSaved,
}: {
  event?: EventRecord;
  canPublish: boolean;
  onCancel?: () => void;
  onSaved: (message: string) => void;
}) {
  const form = useFormAction(saveEvent, onSaved);
  const [isAllDay, setIsAllDay] = useState(event?.isAllDay ?? false);

  return (
    <form
      className="mt-3 grid gap-3 border-t border-gray-100 pt-3 sm:grid-cols-2"
      onSubmit={form.submit}
    >
      {event ? <input name="id" type="hidden" value={event.id} /> : null}

      <label className={label}>
        Title
        <input
          className={input}
          defaultValue={event?.title ?? ""}
          name="title"
          required
        />
      </label>
      <label className={label}>
        Category (optional)
        <input
          className={input}
          defaultValue={event?.category ?? ""}
          name="category"
          placeholder="Workshop, Cultural, Sports…"
        />
      </label>

      <label className={label}>
        Start date
        <input
          className={input}
          defaultValue={event?.startDate ?? ""}
          name="startDate"
          required
          type="date"
        />
      </label>
      <label className={label}>
        End date (optional)
        <input
          className={input}
          defaultValue={event?.endDate ?? ""}
          name="endDate"
          type="date"
        />
      </label>

      <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-gray-700">
        <input
          checked={isAllDay}
          name="isAllDay"
          onChange={(changeEvent) => setIsAllDay(changeEvent.target.checked)}
          type="checkbox"
        />
        All-day event
      </label>
      <span aria-hidden />

      <label className={label}>
        Start time
        <input
          className={input}
          defaultValue={event?.startTime ?? ""}
          disabled={isAllDay}
          name="startTime"
          type="time"
        />
      </label>
      <label className={label}>
        End time (optional)
        <input
          className={input}
          defaultValue={event?.endTime ?? ""}
          disabled={isAllDay}
          name="endTime"
          type="time"
        />
      </label>

      <label className={label}>
        Venue (optional)
        <input
          className={input}
          defaultValue={event?.venue ?? ""}
          name="venue"
          placeholder="Main Auditorium"
        />
      </label>

      <div className="sm:col-span-2">
        <label className={label}>
          Location details (optional)
          <textarea
            className={textarea}
            defaultValue={event?.locationDetails ?? ""}
            name="locationDetails"
          />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label className={label}>
          Short description (optional)
          <textarea
            className={textarea}
            defaultValue={event?.shortDescription ?? ""}
            maxLength={500}
            name="shortDescription"
          />
        </label>
      </div>

      <div className="sm:col-span-2">
        <RichField
          defaultValue={event?.description}
          fieldLabel="Full description (optional)"
          hint="Use paragraphs to separate sections."
          name="description"
        />
      </div>

      <label className={label}>
        Registration URL (optional)
        <input
          className={input}
          defaultValue={event?.registrationUrl ?? ""}
          name="registrationUrl"
          placeholder="https://…"
          type="url"
        />
      </label>
      <label className={label}>
        Website URL (optional)
        <input
          className={input}
          defaultValue={event?.websiteUrl ?? ""}
          name="websiteUrl"
          placeholder="https://…"
          type="url"
        />
      </label>

      <div className="sm:col-span-2">
        <ImageField
          defaultValue={event?.imagePath}
          fieldLabel="Cover image (optional)"
          name="imagePath"
        />
      </div>
      <label className={label}>
        Image alt text (optional)
        <input
          className={input}
          defaultValue={event?.imageAlt ?? ""}
          name="imageAlt"
        />
      </label>
      <label className="flex items-center gap-2 pt-5 text-xs font-semibold text-gray-700">
        <input
          defaultChecked={event?.isFeatured ?? false}
          name="isFeatured"
          type="checkbox"
        />
        Featured event
      </label>

      <PublishToggle canPublish={canPublish} defaultValue={event?.isPublished ?? false} />

      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <SaveButton pending={form.pending}>
          {event ? "Save event" : "Create event"}
        </SaveButton>
        {onCancel ? (
          <button
            className={ghostButton}
            disabled={form.pending}
            onClick={onCancel}
            type="button"
          >
            Cancel
          </button>
        ) : null}
        <FormError error={form.error} />
      </div>
    </form>
  );
}

function MoveButton({
  id,
  direction,
  disabled,
  onSaved,
}: {
  id: number;
  direction: "up" | "down";
  disabled: boolean;
  onSaved: (message: string) => void;
}) {
  const action = useFormAction(moveEvent, onSaved);
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        action.submit(event);
      }}
    >
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
  id,
  title,
  onSaved,
}: {
  id: number;
  title: string;
  onSaved: (message: string) => void;
}) {
  const del = useFormAction(deleteEvent, onSaved);
  return (
    <form
      onSubmit={(event) => {
        if (!window.confirm(`Delete “${title}”? This cannot be undone.`)) {
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

function EventCard({
  event,
  canPublish,
  isFirst,
  isLast,
  onMessage,
}: {
  event: EventRecord;
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
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              {event.isFeatured ? (
                <Star
                  aria-hidden
                  className="size-3.5 shrink-0 fill-amber-400 text-amber-400"
                />
              ) : null}
              <span className="truncate text-sm font-semibold text-gray-800">
                {event.title}
              </span>
            </span>
            <span className="mt-0.5 block text-[11px] text-gray-500">
              {formatEventDateRange(event.startDate, event.endDate)}
              {event.category ? ` · ${event.category}` : ""}
            </span>
          </span>
          <span className="ml-2 shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-semibold text-gray-600">
            {event.isPublished ? "Published" : "Draft"}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <MoveButton
            direction="up"
            disabled={isFirst}
            id={event.id}
            onSaved={onMessage}
          />
          <MoveButton
            direction="down"
            disabled={isLast}
            id={event.id}
            onSaved={onMessage}
          />
          {canPublish ? (
            <DeleteButton id={event.id} onSaved={onMessage} title={event.title} />
          ) : null}
        </div>
      </div>
      {open ? (
        <div className="px-3 pb-3">
          <EventForm canPublish={canPublish} event={event} onSaved={onMessage} />
        </div>
      ) : null}
    </div>
  );
}

export default function EventsManager({
  events,
  canPublish,
}: {
  events: EventRecord[];
  canPublish: boolean;
}) {
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {message ? (
        <p
          aria-live="polite"
          className="rounded-md border border-secondary-200 bg-secondary-50 px-4 py-3 text-sm font-semibold text-secondary-800"
        >
          {message}
        </p>
      ) : null}

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {events.length} {events.length === 1 ? "event" : "events"}
        </p>
        <button
          className={ghostButton}
          onClick={() => setAdding((value) => !value)}
          type="button"
        >
          <Plus aria-hidden className="size-3.5" /> Add event
        </button>
      </div>

      {adding ? (
        <div className="rounded-md border border-dashed border-primary-300 bg-primary-50/40 p-3">
          <p className="text-sm font-bold text-gray-800">New event</p>
          <EventForm
            canPublish={canPublish}
            onCancel={() => setAdding(false)}
            onSaved={(savedMessage) => {
              setMessage(savedMessage);
              setAdding(false);
            }}
          />
        </div>
      ) : null}

      {events.length === 0 && !adding ? (
        <p className="rounded-lg border border-dashed border-gray-300 bg-white px-4 py-8 text-center text-sm text-gray-500">
          No events yet. Use “Add event” to create one.
        </p>
      ) : null}

      <div className="space-y-2">
        {events.map((event, index) => (
          <EventCard
            canPublish={canPublish}
            event={event}
            isFirst={index === 0}
            isLast={index === events.length - 1}
            key={event.id}
            onMessage={setMessage}
          />
        ))}
      </div>
    </div>
  );
}
