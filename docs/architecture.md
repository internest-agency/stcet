# Architecture

## Stack

| Layer | Choice | Notes |
| --- | --- | --- |
| Framework | Next.js 16.4 App Router | Server Components by default; client components are opt-in with `"use client"`. |
| UI runtime | React 19.2 | `useActionState`-style patterns in some forms; server actions used for admin writes. |
| Language | TypeScript 5, `strict: true` | Path alias `@/*` maps to the repository root. |
| Styling | Tailwind CSS 4 | Theme tokens in `src/app/globals.css`; no `tailwind.config.js`. |
| Database | MySQL 8 / MariaDB | Prisma 7 with the `@prisma/adapter-mariadb` driver adapter. |
| Auth | Auth.js v4 | Credentials provider, JWT session, scrypt password hashes. |
| Email | ZeptoMail SDK 8 | Configured in the database, token encrypted at rest. |
| Validation | Zod 4 | One schema per admin module in `src/lib/admin/*-validation.ts`. |
| Animation | GSAP + Lenis | Client-side, used by section components. |
| HTML sanitizing | isomorphic-dompurify | One shared allowlist on write and render. |

## Request and render model

The application has two route groups with very different layouts:

```text
src/app/layout.tsx                  Root: <html>, fonts, metadataBase, custom <head>/<body> code
  src/app/(website)/layout.tsx      Public shell: header, footer, smooth scroll, enquiry/WhatsApp widgets
    ...public pages...
  src/app/admin/...                 Admin: login/reset pages + (protected) group with AdminShell
  src/app/api/...                   Route handlers (Node.js runtime)
  src/app/uploads/[...path]/        Image serving route handler
```

- **Public pages are server-rendered per request.** Most read queries call
  `connection()` from `next/server`, which marks the render as dynamic. This is
  deliberate: content edited in the admin must appear without a rebuild.
- **The root layout is also dynamic** because it reads site settings (custom
  code, favicon, site identity) from the database.
- **Reads never throw** on the public side. Each query catches database errors,
  logs them, and returns a safe fallback:
  - `src/lib/queries/gallery.ts` falls back to bundled gallery content.
  - `src/lib/queries/courses.ts` merges database values over bundled course
    content, and `src/lib/courses/course-content.ts` is the fallback.
  - Other queries return `[]` or `null`; pages render empty states or call
    `notFound()`.
- **Writes are server actions** in `actions.ts` next to the admin page. They
  authenticate, validate with Zod, sanitize rich text, write inside a
  transaction when needed, and call `revalidatePath` for the affected public and
  admin paths.
- **Site settings are cached in-process for 60 seconds** (`src/lib/admin/settings.ts`).
  Saving settings calls `invalidateSiteSettingsCache()` so the change is visible
  immediately in that process. With multiple Node processes, other processes
  can lag up to 60 seconds.
- **Route handlers** are used for machine-shaped endpoints: contact, enquiry,
  health, media upload, CSV exports, and Auth.js.

## Data access conventions

All database access goes through `getPrismaClient()`:

```ts
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
```

- `src/lib/prisma-client.ts` holds the factory and is importable from scripts.
- `src/lib/prisma.ts` re-exports it behind `server-only` for application code.
- The client is cached on `globalThis` so dev hot reloads do not open a new pool.
- `isDatabaseConfigured()` is checked before queries so the app can boot and
  render fallbacks when `DATABASE_URL` is missing.

Public queries live in `src/lib/queries/`; admin read models live there too
(`admin-*.ts`) and begin with `requireAdmin()` (or check the current admin) so
they cannot be imported into a public page and leak drafts.

## Public route map

| Route | File | Source of content |
| --- | --- | --- |
| `/` | `(website)/page.tsx` | Home sections + featured gallery (`showOnHome`) |
| `/about` | `(website)/about/page.tsx` | About tables + bundled fallback |
| `/admissions` | `(website)/admissions/page.tsx` | Admissions tables |
| `/careers` | `(website)/careers/page.tsx` | Course career content |
| `/contact` | `(website)/contact/page.tsx` | Settings + contact form |
| `/courses` | `(website)/courses/page.tsx` | Always `notFound()` (there is no course index) |
| `/courses/[slug]` | `(website)/courses/[slug]/page.tsx` | DB course + bundled content fallback |
| `/enquire-now` | `(website)/enquire-now/page.tsx` | Enquiry form + admissions data |
| `/events` | `(website)/events/page.tsx` | Published events, bucketed in the client |
| `/events/[slug]` | `(website)/events/[slug]/page.tsx` | One published event + JSON-LD |
| `/faculties` | `(website)/faculties/page.tsx` | Faculty + groups (note the URL segment) |
| `/gallery` | `(website)/gallery/page.tsx` | Gallery (`showOnGalleryPage`) |
| `/infrastructure` | `(website)/infrastructure/page.tsx` | Facilities by category |
| `/iqac` | `(website)/iqac/page.tsx` | Static/section content |
| `/placements` | `(website)/placements/page.tsx` | Companies + leadership |
| `/scholarships` | `(website)/scholarships/page.tsx` | Scholarship records |
| `/sc-st-cell` | `(website)/sc-st-cell/page.tsx` | Static/section content |
| `/anti-ragging-committee` | `(website)/anti-ragging-committee/page.tsx` | Committee records/fallback |
| `/grievance-redressal-committee` | `(website)/grievance-redressal-committee/page.tsx` | Committee records/fallback |
| `/internal-complaints-committee` | `(website)/internal-complaints-committee/page.tsx` | Committee records/fallback |
| `/[institutionalSlug]` | `(website)/[institutionalSlug]/page.tsx` | Published `InstitutionalPage` + sections |

Known inconsistency: the public faculty page is served at **`/faculties`** while
its SEO record is stored under `/faculty` and `src/app/sitemap.ts` lists
`/faculty`. Until that is reconciled, `/faculty` is not a real route and the
sitemap contains one incorrect URL. See [troubleshooting.md](./troubleshooting.md#faculty-url).

`next.config.ts` adds permanent/redirect entries:

- `/news-and-events` -> `/events` (308)
- `/admin/pages` -> `/admin/institutional-pages` (307)

## Admin route map

All routes below `/admin/(protected)` are wrapped by
`src/app/admin/(protected)/layout.tsx`, which calls `requireAdmin()` and renders
`AdminShell`.

| Route | Module |
| --- | --- |
| `/admin/login` | Credentials sign-in |
| `/admin/forgot-password` | Request a reset link |
| `/admin/reset-password` | Consume a reset token |
| `/admin/dashboard` | Counts, recent submissions, shortcuts |
| `/admin/enquiries` | Enquiry inbox, status, notes, CSV export |
| `/admin/contact-messages` | Contact inbox, status, notes, CSV export |
| `/admin/events` | Event drafts/publishing |
| `/admin/about` | Founder, chairman message, vision/mission, trust, mission items |
| `/admin/governing-council` | Council members |
| `/admin/courses` | Course list, create, edit, preview |
| `/admin/faculty` and `/admin/faculty/groups` | Faculty records and groups |
| `/admin/gallery` | Categories and images, including home/gallery placement |
| `/admin/admissions` | Intro, routes, TNEA steps, management quota, documents, notices, links, contacts |
| `/admin/scholarships` | Scholarship records |
| `/admin/placements` | Companies and placement leadership |
| `/admin/infrastructure` | Facilities and section layout |
| `/admin/committees` | Committee pages and members |
| `/admin/institutional-pages` | Custom institutional pages + sections |
| `/admin/media` | Uploaded media registry |
| `/admin/seo` | Per-page SEO records |
| `/admin/users` | Admin users (super admin only) |
| `/admin/settings` | Site identity, contact, footer, maps, custom code, ZeptoMail |
| `/admin/menus` | Header/footer navigation tree |

## API route map

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/contact` | `GET` | Health message (no database write). |
| `/api/contact` | `POST` | Validate, rate-limit, dedupe, save `ContactMessage`, email admin + visitor. |
| `/api/enquiry` | `GET` | Health message. |
| `/api/enquiry` | `POST` | Validate, rate-limit, dedupe, save `Enquiry`, email admin + visitor. |
| `/api/health/database` | `GET` | `SELECT 1` check. Returns only `ok`/`unavailable`. Rate-limited 10/min/IP. |
| `/api/admin/media/upload` | `POST` | Authenticated multipart image upload (1 MB). |
| `/api/admin/enquiries/export` | `GET` | CSV export (admin only). |
| `/api/admin/contact-messages/export` | `GET` | CSV export (admin only). |
| `/api/auth/[...nextauth]` | * | Auth.js endpoints. |
| `/uploads/[...path]` | `GET` | Serve a file only if a `MediaAsset` row references it. |

## Error and not-found behavior

- `src/app/not-found.tsx` renders the global 404.
- Dynamic pages call `notFound()` for missing or unpublished records.
- Admin pages surface failures as error messages or redirect with `?error=...`
  codes; they do not leak database details to the browser.
- Public queries log server-side and degrade. The most common fallback is an
  empty section (for example, an events page with no events).
- Login and password-reset forms use redirects with query params
  (`?error=invalid_email`, `?sent=1`) so they work with progressive enhancement
  and survive a full page reload.

## Components and styling

- `src/components/ui/` - primitives: `Button`, `Container`, `Breadcrumb`,
  `EditorialHero`, `RichText`, `SectionHeading`, `CourseCallToAction`.
- `src/components/sections/<feature>/` - page sections grouped by feature
  (`home`, `about`, `courses`, `events`, `gallery`, `placements`, ...).
- `src/components/layout/` - `Header`, `Footer`, menu rendering.
- `src/components/admin/` - `AdminShell`, managers and forms per module,
  `ImageUploadField`.
- `src/app/globals.css` defines theme tokens, fonts, and a Tailwind
  `@source inline(...)` safelist for classes allowed inside stored rich text.
  If you add a class to `ALLOWED_HTML_CLASSES` in `src/lib/content/html.ts`, add
  it to the safelist too, or it will be stripped in production builds.
- Theme documentation: `THEME_GUIDE.md`.

## Startup instrumentation

`src/instrumentation.ts` runs once per server process (Node.js runtime, not
during `next build`):

- Warns if `DATABASE_URL` is missing.
- Verifies `<home>/uploads` exists and is writable.
- Logs either `[startup] upload storage ready at ...` or a clear error.

Treat a non-ready upload log as a deployment failure for any admin that uploads
images.
