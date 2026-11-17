# Admin CMS

## Authentication

- **Provider:** Auth.js (NextAuth) v4 credentials provider.
- **Session:** JWT strategy, `maxAge` **4 hours**, `updateAge` 1 hour.
- **Cookie:** `next-auth.session-token` in development,
  `__Secure-next-auth.session-token` over HTTPS. HTTP-only.
- **Per-request revalidation:** `getCurrentAdmin()` loads the user from the
  database and rejects the session when `isActive` is false or
  `sessionVersion` no longer matches. Deactivating a user or signing out
  increments `sessionVersion`, invalidating existing cookies.
- **Password storage:** Node `scrypt` (`N=32768, r=8, p=1`, 16-byte salt,
  64-byte key) in a self-describing `scrypt$...` string. Verification uses
  `timingSafeEqual` and still performs derivation for unsupported hashes.
- **Login throttling:** 5 failed attempts for the same normalized email within a
  15-minute window triggers a 15-minute block. The counter is keyed by an HMAC
  of the email using `NEXTAUTH_SECRET`, so raw emails are not stored in the
  attempt table.

Routes:

- `/admin/login`
- `/admin/forgot-password`
- `/admin/reset-password?token=...`

## Password reset

The flow is implemented with server actions (not a client `fetch`), so it works
without JavaScript and survives a redirect.

1. `requestPasswordReset` normalizes the email and applies a 3-attempts /
   15-minute throttle keyed by the same HMAC used for login.
2. If the account exists, is active, and has not requested a token in the last
   15 minutes, it creates a 32-byte random token, stores **only its SHA-256
   hash** with a 60-minute expiry, and emails the raw link to the user's real
   address.
3. Unknown, inactive, throttled, and recently-requested accounts all produce the
   same generic `?sent=1` response to prevent account enumeration.
4. `resetPassword` validates the token hash, expiry, and unused state; updates
   the password hash; marks the token used; and increments `sessionVersion` so
   other sessions are logged out.
5. `NEXT_REDIRECT` errors are rethrown, so a redirect is not swallowed by the
   surrounding `try/catch`.

Reset links use `NEXT_PUBLIC_BASE_URL`, then `VERCEL_URL`, then
`http://localhost:3000`. Set the public URL in production or emailed links point
at localhost.

Failure codes are surfaced on the page: `invalid_email`, `mail_unavailable`,
`send_failed`, and generic errors. The mail is sent through the same ZeptoMail
configuration as contact/enquiry; see [email.md](./email.md).

## Roles and permissions

Two roles exist:

| Role | Intended use |
| --- | --- |
| `SUPER_ADMIN` | Full access, including publishing, deletion, users, settings, SEO, and media library. |
| `CONTENT_EDITOR` | Creates and edits content but cannot publish, delete, or change site-wide configuration. |

Authorization helpers (`src/lib/admin/authorization.ts`):

- `getCurrentAdmin()` - session + database check, returns `null` when invalid.
- `requireAdmin()` - redirects to `/admin/login` when unauthenticated.
- `requireAdministrator()` - redirects to `/admin/dashboard?error=forbidden`
  when the role is not `SUPER_ADMIN`.
- `isAdministrator(admin)` - boolean used to show/hide admin-only controls.

Rules enforced in server actions:

- **Publishing is administrator-only.** Modules that accept an `isPublished`
  value preserve the previous value for editors. Courses go further: an editor
  may not edit a course that is already published (`?error=forbidden`), and a
  saved draft stays a draft.
- **Deletion is administrator-only** in every module that supports it.
- **Users, Settings, SEO, and Media Library pages require a super admin.**
- **Content editors can** manage enquiries/contact status and notes, and edit
  drafts or non-published records in modules that expose `canPublish`.
- **Audit:** deletions and security-relevant changes write `AdminAuditLog` rows.
  Course create/update, user update/delete, and other destructive operations are
  audited.

The navigation shell still lists admin-only pages for editors; opening one
redirects to the dashboard with `?error=forbidden`. This is intentional
defense-in-depth: hiding a link is not authorization.

## Admin modules

| Module | What it manages | Notable rules |
| --- | --- | --- |
| Dashboard | Counts, recent enquiries/messages, quick links | Read-only. |
| Enquiries | Admissions enquiry records | Status (`New`, `In Progress`, `Contacted`, `Resolved`, `Spam`), admin notes, CSV export. |
| Contact Messages | Contact-form records | Same status/notes/export flow. |
| Events | Upcoming/past events, detail pages | Auto slug from title with collision suffix, manual `sortOrder`, featured flag, Asia/Kolkata dates. |
| About | Founder, chairman message, vision/mission, trust, mission items | Multiple singleton-style records plus ordered items. |
| Governing Council | Council members | Ordered, publishable, image + alt. |
| Courses | Courses and all nested sections | Slug unique; child rows ordered/numbered; preview route; publish is admin-only. |
| Faculty | Faculty records | Department/group, AU/AICTE IDs, photo, publish. `faculty:import` can bulk import. |
| Faculty Groups | Group names/slugs/order | Delete is admin-only; deleting clears `groupId` on members. |
| Gallery | Categories and images | Per-image `showOnHome` and `showOnGalleryPage`; see below. |
| Admissions | Intro, routes, TNEA steps, quota, documents, notices, links, contacts | Ordered and publishable. |
| Scholarships | Scholarship records | Ordered, publishable. |
| Placements | Companies and leadership | Companies have active + published flags; leadership has intro/officer + ordered items. Training Programmes and Industry Interactions are **not** part of this module. |
| Infrastructure | Facilities | Category, optional section id/layout, image, active/published. |
| Committees | Committee pages and members | Denormalized committee name/slug on members; hero image. |
| Institutional Pages | Custom pages at `/[slug]` | Ordered sections, layouts, publish. Slugs colliding with real routes are shadowed by those routes. |
| Media | Uploaded asset registry | Admin-only; delete is blocked while a file is still referenced. |
| SEO | `PageSeo` records | Admin-only; per-path title/description/canonical/OG/no-index. |
| Users | Admin accounts | Admin-only; see below. |
| Settings | Site-wide configuration | Admin-only; see below. |
| Menus | Header/footer navigation | Nested items, order, new-tab flag, active/published. |

### Gallery placement

Each image has two independent display switches:

- `showOnHome` - home page gallery strip.
- `showOnGalleryPage` - `/gallery`.

Both can be on, both can be off, or either one alone. `isPublished` and an
active category are also required for public display. The fallback bundled
gallery is used only when the database is unavailable or has no matching
published rows (4 home items, 5 gallery items).

### User management

`/admin/users` is super-admin only.

- **Create:** name, email, password (12+ characters), role.
- **Update:** name, email, role, active flag. You cannot change your own role or
  deactivate yourself.
- **Deactivate:** increments `sessionVersion`, killing existing sessions.
- **Delete:** blocked for yourself and for the last active super admin. The
  delete and its audit row run in one transaction. If the user still owns
  `MediaAsset` rows, the FK restriction (`P2003`) is reported as
  `?error=has-uploads` rather than a generic failure. Reassign or remove those
  assets first.

### Settings

Admin-only. Sections include:

- Site identity: college name, logo, favicon
- Contact details and address
- Social links
- Footer text and two footer link groups (important links, quick links)
- Google Maps embed URL (validated)
- Custom head code and end-of-body code
- ZeptoMail configuration and a **Send test email** action

Saving settings invalidates the in-process 60-second settings cache. With
multiple Node processes, other processes may serve the old settings for up to a
minute.

### Menus

Menus are stored as a self-referencing tree. The public query:

- loads only published + active rows,
- promotes orphans to top level,
- breaks cycles so rendering cannot loop,
- attaches every row exactly once,
- preserves sibling `sortOrder`.

### Media library

The media library lists `MediaAsset` rows (the registry of files on disk). It can
label assets and remove them, but deletion is refused while any content still
references the path. Prefer deleting from the module that owns the image, or run
`npm run media:cleanup` for abandoned uploads.

## Editing workflow

1. Sign in at `/admin/login`.
2. Open the module from the sidebar.
3. Create or edit the record. Drafts are invisible on the public site.
4. Preview where available (courses have `/admin/courses/[id]/preview`).
5. A super admin publishes. The public page is revalidated by the action.
6. Verify the public page, especially images and links.

Because public pages read the database per request, a published change appears
immediately in the process that handled the save. In a multi-instance
deployment, `revalidatePath` only affects the instance that ran the action; other
instances still see fresh database reads on their next request unless a cached
layer is added later.

## Session and login troubleshooting

- **Locked out:** wait 15 minutes after 5 failed attempts, or clear the matching
  `adminloginattempt` row (admin action, not routine).
- **Signed out unexpectedly:** the user was deactivated, the role/session
  version changed, the 4-hour session expired, or `NEXTAUTH_SECRET` changed
  (which invalidates every session).
- **Reset link says invalid:** tokens expire after 60 minutes and are single-use.
  Request a new one. A request made within 15 minutes of the previous one is
  intentionally ignored.
- **Reset email never arrives:** the request still shows the generic success
  message. Check ZeptoMail configuration and server logs; see
  [email.md](./email.md) and [troubleshooting.md](./troubleshooting.md).
