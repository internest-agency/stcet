# Public Content Modules

Every public page is a server component under `src/app/(website)/`. This
document explains where each page's data comes from, what happens when the
database is empty or unreachable, and the rules that determine what is visible.

General rule: a record is public only when `isPublished = true` (and, where the
model has it, `isActive = true`). Admin drafts are never fetched by public
queries.

## Home page

`src/app/(website)/page.tsx` composes home sections. The gallery strip comes
from `getHomeGalleryItems()`:

- published images,
- `showOnHome = true`,
- belonging to an active category,
- ordered by `sortOrder`, then `id`.

If the database is unavailable or no rows match, it uses
`fallbackHomeGalleryItems` from `src/lib/content/gallery.ts`.

Other home sections combine static section components with content from About,
courses, events, and site settings.

## About

`getPublishedAboutContent()` loads:

- published founders (ordered),
- the first published chairman message,
- the first published vision/mission record,
- published mission items,
- the first published trust record,
- published trust pillars.

If **none** of those exist (or the database is down), the query returns `null`
and the page renders the bundled content in `src/lib/content/about-content.ts`.
Partial data is used as-is; the fallback is all-or-nothing.

Governing council members come from `getPublishedGoverningCouncilMembers()`, with
a bundled fallback in `src/lib/content/governing-council-content.ts`.

## Courses

There is no course index. `/courses` calls `notFound()`. Courses render at
`/courses/[slug]`.

`src/lib/queries/courses.ts` merges a database course over the bundled content
for that slug:

- scalar fields (name, degree, tagline, description, hero image, headings) use
  the database value when non-empty, otherwise the bundled value;
- ordered child collections (modules, opportunities, reasons, career pathways,
  future paths) replace the bundled collections only when present.

`src/lib/courses/course-content.ts` contains the five bundled courses:

- `computer-science-engineering`
- `electronics-communication-engineering`
- `electrical-electronics-engineering`
- `information-technology`
- `computer-science-ai-ml`

`getPublishedCourseMetadata()` returns metadata only for published rows; the
page uses the bundled content for metadata when there is no database record.
`prisma/seed.ts` creates matching records. A database row can therefore shadow a
bundled slug. Publication status in the database wins for the course page body
and for the sitemap.

## Events

### Storage model

`Event.startDate`/`endDate` are `YYYY-MM-DD` strings; `startTime`/`endTime` are
`HH:mm`. They represent the **Asia/Kolkata wall clock**, not a UTC instant. This
avoids a date shifting by a day when the server runs in another timezone.

### Visibility and ordering

`getPublishedEvents()` returns all published events ordered by manual
`sortOrder`, then `id`. The public `/events` page then buckets them in
`src/components/sections/events/EventsList.tsx`:

- **Today** is computed with `Intl.DateTimeFormat("en-CA", { timeZone:
  "Asia/Kolkata" })`, which yields `YYYY-MM-DD`.
- **Upcoming:** `(endDate || startDate) >= today`. A multi-day event remains
  upcoming through its end date.
- **Past:** everything else.
- Upcoming is sorted ascending by `startDate` + `startTime` (missing time =
  `00:00`).
- Past is sorted descending by effective end (`endDate || startDate`,
  `endTime || startTime || 23:59`).
- Categories are grouped from `event.category`; a blank category becomes
  **"Other"**. Category groups are A-Z, and events inside a group are newest
  first by start.
- Sort keys are strings, which works because ISO dates and zero-padded times sort
  chronologically.

### Anchors

- `/events#upcoming-events`
- `/events#past-events`
- `/events#events-by-category`

Each heading has `scroll-mt-24` so the fixed header does not cover it.

### Detail pages

`/events/[slug]` loads one published event (`getPublishedEventBySlug`), renders
the rich description, date/time range, venue, location details, registration and
website links, and emits `schema.org/Event` JSON-LD using
`toSchemaDate()` (adds `+05:30` when a time is present). Missing or draft events
return 404.

### Admin behavior

- Slug is derived from the title, with `-2`, `-3`, ... on collision.
- New events append to the end of the manual order.
- Editors can edit but cannot change `isPublished`; the existing state is kept.
- Dates/times are validated with `isValidDate`/`isValidTime`, which reject
  rolled-over dates such as `2026-02-31`.

## Gallery

Two independent queries, both requiring `isPublished` and an active category:

| Surface | Flag | Fallback |
| --- | --- | --- |
| Home | `showOnHome` | 4 bundled home items |
| `/gallery` | `showOnGalleryPage` | 5 bundled gallery items + categories |

The gallery page derives its filter tabs from the returned items ("All" plus each
category in first-seen order). If either query returns zero rows, the bundled
content is used for that surface, even if the other surface has database rows.

Image paths are either bundled `/images/...` assets or managed `/uploads/...`
paths registered in `MediaAsset`.

## Faculty

`/faculties` (not `/faculty`) loads:

- `getPublishedFaculty()` - published records ordered by `sortOrder`, `id`.
- `getFacultyGroups()` - groups with members for the grouped view.

Faculty have both a free-text `group` and a relational `groupId`. Deleting a
group sets members' `groupId` to null; their free-text group remains.

`npm run faculty:import` imports from the bundled dataset in
`src/lib/faculty/faculty-groups.ts`.

If the query fails, the page renders an empty listing rather than crashing.

## Admissions

`getPublicAdmissionsData()` loads the published intro, routes, TNEA counselling
steps, management quota info, notices, application links, and contacts. If none
of them exist, it returns `null` and the page keeps its static/bundled sections.
`/enquire-now` uses the same admissions data for its surrounding content.

TNEA step `instructions` is JSON and rendered as a list. Ordering is
`sortOrder`, then `stepNumber` for TNEA.

## Placements

- `getPublishedPlacementContent()` returns published + active companies and
  published training programmes/industry interactions. The admin placement
  module no longer edits the latter two, but the public page can still display
  any existing rows.
- `getPublishedPlacementLeadership()` returns the first published leadership
  row with its published ordered items, or `null` so the page uses bundled
  content from `src/lib/content/placement-leadership-content.ts`.

## Infrastructure

`getPublishedInfrastructureFacilities()` returns published + active facilities,
ordered by category then `sortOrder`. The page groups them by `sectionId` /
`category` and applies the stored `layout` token through
`src/lib/content/section-layouts.ts`. An empty result renders the page's empty
state.

## Committees

Three dedicated routes exist:

- `/anti-ragging-committee`
- `/grievance-redressal-committee`
- `/internal-complaints-committee`

`getPublishedCommittee(slug)` returns the committee row plus published + active
members. If neither exists, it returns `null` and the page uses its bundled
content. Members are linked by the denormalized `committeeSlug`, so renaming a
committee's slug requires updating members.

Other committee-like pages (`/iqac`, `/sc-st-cell`) are static/section pages.
Additional committees can be modeled with institutional pages if needed.

## Institutional pages

`/[institutionalSlug]` loads a published `InstitutionalPage` by slug and renders
its ordered `PageSection` rows. Each section can have rich content, an image,
and a layout token. The hero uses the first section image, otherwise
`/images/committee-hero.webp`.

Because Next resolves fixed route segments before dynamic ones, a slug that
matches a real route (`about`, `events`, `courses`, `admin`, `api`, `uploads`,
...) is shadowed. `src/app/sitemap.ts` maintains a reserved-slug list for this
reason. Do not create institutional pages with route-colliding slugs.

## Menus and site chrome

`getMenuItems()` returns the published + active navigation tree. The header
falls back to its own built-in navigation if the database is unavailable or the
query fails. See [admin-cms.md](./admin-cms.md#menus) for tree-repair behavior.

The website layout also renders:

- `SmoothScroll` (Lenis) and `HashScroll` for anchor navigation,
- `EnquireNow` floating action,
- `GoToTop`,
- `WhatsAppChat` with the configured hard-coded number.

Site settings provide the college name, logo, favicon, contact details, and
footer data. Settings are cached for 60 seconds per process.

## Contact and enquiry forms

- `/contact` posts JSON to `/api/contact`.
- `/enquire-now` posts the admissions enquiry to `/api/enquiry`.

Both endpoints:

- accept JSON or `FormData`,
- validate required fields and formats,
- rate-limit to 5 submissions per hour per IP,
- deduplicate identical submissions within a 2-minute window,
- save the record first,
- then await both ZeptoMail sends (admin notification and visitor
  confirmation), logging each result,
- return a success response even when email fails, because the record is saved.

They are described in detail in [email.md](./email.md) and
[security.md](./security.md).

## Rich text

Stored rich text is sanitized on write and again on render using the allowlist in
`src/lib/content/html.ts`:

- allowed tags and attributes are explicitly listed,
- only approved utility classes survive,
- links get safe `rel` attributes,
- `RichText` (`src/components/ui/RichText.tsx`) is the render component.

Tailwind only generates classes it sees in source. Classes that appear only in
stored content are force-generated by the `@source inline(...)` block in
`src/app/globals.css`. Keep `ALLOWED_HTML_CLASSES` and that safelist in sync.

## Known content issues

### Faculty URL

The page lives at `/faculties`, but:

- its SEO lookup uses `PAGE_PATH = "/faculty"`,
- the sitemap lists `/faculty`,
- there is no `/faculty` route.

So SEO overrides saved under `/faculty` still apply (the code reads that path
directly), but `/faculty` 404s unless an institutional page with that slug
exists. Choose one canonical URL before launch and update the page folder or the
sitemap and SEO path together. See
[troubleshooting.md](./troubleshooting.md#faculty-url).
