/**
 * Date and time helpers for events.
 *
 * Every event date/time is stored as an Asia/Kolkata *wall-clock* string:
 *   - `startDate` / `endDate`  → ISO calendar date, `YYYY-MM-DD`
 *   - `startTime` / `endTime`  → 24-hour time, `HH:mm`
 *
 * Storing the wall clock (instead of a UTC instant) means the value an admin
 * types is exactly the value the public site shows, with no conversion step
 * where a date could silently shift by a day. Formatting below therefore only
 * ever reads the digits of the string and builds its `Date` in UTC, so the
 * server's local timezone can never change the result.
 *
 * These helpers are pure and free of server-only imports so they can run in
 * both server components and the browser.
 */

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** True when `value` is a real calendar date in ISO `YYYY-MM-DD` form. */
export function isValidDate(value: string): boolean {
  return parseIsoDate(value) !== null;
}

/** True when `value` is a 24-hour `HH:mm` time. */
export function isValidTime(value: string): boolean {
  return TIME_PATTERN.test(value);
}

/** Parse an ISO `YYYY-MM-DD` string into a UTC `Date`, or null when invalid. */
export function parseIsoDate(value: string): Date | null {
  if (!DATE_PATTERN.test(value)) return null;
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  // Reject rolled-over dates such as 2026-02-31.
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

const DAY_MONTH = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const MONTH_YEAR = new Intl.DateTimeFormat("en-GB", {
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const FULL_DATE = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const LONG_DATE = new Intl.DateTimeFormat("en-GB", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Format a single ISO date as `Fri, 16 Oct 2026`. */
export function formatEventDate(value: string): string {
  const date = parseIsoDate(value);
  return date ? FULL_DATE.format(date) : value;
}

/** Format a single ISO date as `Friday, 16 October 2026`. */
export function formatEventDateLong(value: string): string {
  const date = parseIsoDate(value);
  return date ? LONG_DATE.format(date) : value;
}

/** Format a date range, collapsing shared day/month/year parts. */
export function formatEventDateRange(
  startDate: string,
  endDate?: string | null,
): string {
  if (!endDate || endDate === startDate) return formatEventDate(startDate);

  const start = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  if (!start || !end) return formatEventDate(startDate);

  if (start.getUTCFullYear() === end.getUTCFullYear()) {
    if (
      start.getUTCMonth() === end.getUTCMonth() &&
      start.getUTCDate() === end.getUTCDate()
    ) {
      return formatEventDate(startDate);
    }
    if (start.getUTCMonth() === end.getUTCMonth()) {
      return `${start.getUTCDate()} – ${end.getUTCDate()} ${MONTH_YEAR.format(end)}`;
    }
    return `${DAY_MONTH.format(start)} – ${DAY_MONTH.format(end)} ${end.getUTCFullYear()}`;
  }
  return `${FULL_DATE.format(start)} – ${FULL_DATE.format(end)}`;
}

/** Format a 24-hour `HH:mm` time as `10:00 AM`. */
export function formatEventTime(value: string): string {
  const match = TIME_PATTERN.exec(value);
  if (!match) return value;
  const hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${hour12}:${minute} ${period}`;
}

/** Format an event's time as `All day`, `10:00 AM – 4:00 PM` or `10:00 AM`. */
export function formatEventTimeRange(
  startTime?: string | null,
  endTime?: string | null,
  isAllDay = false,
): string | null {
  if (isAllDay) return "All day";
  if (startTime && endTime) {
    return `${formatEventTime(startTime)} – ${formatEventTime(endTime)}`;
  }
  if (startTime) return formatEventTime(startTime);
  return null;
}

/**
 * Build the ISO 8601 value used for schema.org `Event` markup. Adds the
 * Asia/Kolkata offset (`+05:30`) when a time is present, otherwise returns the
 * plain calendar date.
 */
export function toSchemaDate(
  date: string,
  time?: string | null,
  isAllDay = false,
): string {
  return !isAllDay && time ? `${date}T${time}:00+05:30` : date;
}
