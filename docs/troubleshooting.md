# Troubleshooting

Work through the symptom, likely cause, and fix below. Server logs are the first
place to look; most errors are logged with a bracketed prefix such as
`[prisma]`, `[startup]`, `[uploads]`, `[media-upload]`, `[ZeptoMail]`,
`[Contact API]`, `[Enquiry API]`, or `[forgot-password]`.

## Database

### `pool timeout ... active=0 idle=0 limit=N` (45028)

**Cause:** the MariaDB driver never opened a connection. The most common reason
is `DATABASE_MIN_IDLE=0` (a known driver bug), followed by a bad host, bad
credentials, or a missing database.

**Fix:**

- Set `DATABASE_MIN_IDLE` to at least `1` (the code clamps it, but do not set 0).
- Run `npm run db:connectivity` to see the real driver error.
- Check the host, port, database name, and percent-encoded credentials.
- Check the server's `max_connections` and the configured pool size.

### `read ECONNRESET`

**Cause:** an idle pooled connection was closed by the MySQL server
(`wait_timeout`) and then reused.

**Fix:** keep `DATABASE_IDLE_TIMEOUT_MS` below the server's `wait_timeout`
(default 60s vs commonly 300s) and keep `DATABASE_CONNECTION_LIMIT` modest on
shared hosts. Restart the app after changing pool settings.

### Prisma validation error for a field that exists in the schema

**Cause:** the running process has a stale generated client, or
`prismaSchemaRevision` was not bumped after an additive migration.

**Fix:**

1. `npm run prisma:generate`
2. Restart `next dev` / the production process.
3. Bump `prismaSchemaRevision` in `src/lib/prisma-client.ts` to the latest
   migration timestamp.

### Migrations fail or want to reset

**Cause:** migration history does not match the database (common when pointing at
an existing/live database).

**Fix:** take a backup, compare the schema with `prisma/migrations`, and baseline
the matching migration. Do not accept a reset prompt, and never use `db push`
against real data.

### Build fails because the database is unavailable

The build should not need the database. If a build-time page starts querying,
make it dynamic (`await connection()` in its queries or `force-dynamic`) or move
the query to request time. The sitemap and robots routes are already
`force-dynamic`.

## Next.js and runtime

### `SyntaxError` / "Unexpected token" after changing code or migrations

**Cause:** stale `.next` output, especially after switching branches or
generating a new Prisma client.

**Fix:** stop the dev server, remove `.next`, and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```

### Changes to content do not appear

- Confirm the record is published (and active, where applicable).
- Confirm you are looking at the right surface: gallery images need
  `showOnGalleryPage` for `/gallery` and `showOnHome` for `/`.
- Settings cache: wait up to 60 seconds or restart the process.
- Multiple instances: `revalidatePath` only affects the instance that handled
  the save; others read fresh database rows on their next request.
- Check the browser/CDN cache for static assets; content pages are dynamic.

### Custom code breaks the admin

Custom head/body code is applied to the root layout, including `/admin`. If a
snippet throws or blocks rendering:

1. Disable it by clearing the fields directly in the `sitesettings` table.
2. Restart if needed.
3. Re-add it incrementally and test both the public site and admin.

External scripts may be blocked by the CSP if their source is not allowed. Inline
scripts are allowed by the current policy.

### CSP blocks an image, font, frame, or form

Update the `Content-Security-Policy` in `next.config.ts` deliberately, or host
the asset locally. Current allowed sources are listed in
[seo.md](./seo.md#security-headers-and-csp).

### Rich-text classes disappear in production

Tailwind only generates classes found in source files. Stored-content classes
must be listed in the `@source inline(...)` block in `src/app/globals.css` and in
`ALLOWED_HTML_CLASSES` in `src/lib/content/html.ts`. Keep both in sync.

## Uploads

### `[startup] upload storage is NOT writable`

**Cause:** the Node process user cannot write to `os.homedir()/uploads`.

**Fix:**

- Confirm which user runs the process.
- Check ownership and permissions on the home directory.
- As the app user: `mkdir -p "$HOME/uploads" && touch "$HOME/uploads/.probe"`.
- On unusual Hostinger setups, confirm the account user's home path with support.

### `413 Payload Too Large`

- From Nginx: raise `client_max_body_size` to at least `2m`.
- From Next: the file exceeds 1 MB or the request really is larger than the
  limit. The limit is not configurable by `UPLOAD_MAX_BYTES`.

### `415 Unsupported Media Type`

Only JPEG, PNG, and WebP are accepted. A renamed file is rejected because the
type is sniffed from magic bytes. Convert the image and re-upload.

### Upload succeeds but the image 404s

Possible causes:

1. The file is not registered in `MediaAsset` (the serving route requires a row).
2. The storage directory was not persisted across a deploy.
3. The file was removed by a cleanup while content still referenced it.
4. The stored size does not match the database row (the route treats this as
   missing).

Check logs for `[uploads] "<path>" is registered in the database but ...`. If the
file is gone, restore the uploads backup or re-upload the image.

### Uploads disappear after deploy

The upload directory is outside the deploy tree. If it was not persisted (for
example, the process runs as a different user, or a container has an ephemeral
home), configure persistent storage at `/home/<app-user>/uploads`.

### Media cleanup deleted an image that was in use

Reference checking is centralized in `src/lib/admin/upload-references.ts`. If a
new image column was added and not added there, the sweep can delete a live file.
Restore from backup, add the missing column to the check, and re-run only after
verifying.

## Authentication and password reset

### Locked out after failed sign-ins

Wait 15 minutes. A super admin can also clear the matching `adminloginattempt`
row by email hash. Do not disable the throttle globally.

### Everyone was signed out at once

`NEXTAUTH_SECRET` changed, a session version was incremented, or the 4-hour
session expired. Sign in again.

### `?error=forbidden` after opening a page

The account is a `CONTENT_EDITOR` and the page requires `SUPER_ADMIN` (users,
settings, SEO, media). Use a super-admin account.

### Reset email never arrives

- The UI always shows the generic success page to prevent enumeration.
- Check the server log for `[forgot-password]` and `[ZeptoMail]`.
- Verify ZeptoMail is enabled, the token decrypts, and the sender is verified.
- Check spam and the exact address on the account.
- A request within 15 minutes of a previous one is intentionally ignored.

### Reset email fails with `EAI_AGAIN`

DNS resolution of `api.zeptomail.com` is failing on the server/network. The app
redirects to `?error=send_failed`. Fix outbound DNS/connectivity, then retry. This
is not fixed by code changes.

### Reset link points at localhost

Set `NEXT_PUBLIC_BASE_URL` to the public HTTPS origin and restart/redeploy.

### Reset link is invalid or expired

Links expire after 60 minutes and are single-use. Request a new one after the
15-minute request throttle.

## Email

### Contact/enquiry saved but no email

This is expected when ZeptoMail is not configured or unreachable. The record is
saved before sending. Check:

- Settings: enabled, token, sender, admin recipient, per-form notification flag.
- `ZEPTOMAIL_ENCRYPTION_KEY` is set and unchanged.
- Server logs for the specific send result.
- Outbound HTTPS/DNS.

### `401`/`403` from ZeptoMail

Token is invalid/revoked or belongs to a different data center. Re-enter it and
confirm the endpoint. The app adds the `Zoho-enczapikey ` prefix if missing.

### Sender rejected

Verify the sender address/domain in the ZeptoMail console. Use a sender the
account is allowed to send from.

## Events

### An event shows as past/upcoming on the wrong day

Dates are Asia/Kolkata wall-clock strings. "Today" is computed in
`Asia/Kolkata`, independent of the server timezone. A multi-day event remains
upcoming through `endDate`. Check the stored `YYYY-MM-DD` and `HH:mm` values, not
the admin browser's local timezone.

### Event appears on `/events` but the detail page is 404

The event is unpublished. `/events` only lists published rows, and the detail
route requires `isPublished = true`. Publish it as a super admin.

### Category grouping says "Other"

The event's `category` is blank. Set a category in the admin.

## Pages and SEO

### Faculty URL

- Working page: `/faculties`
- SEO lookup and sitemap entry: `/faculty`
- `/faculty` is not a route.

Fix by choosing one canonical URL and updating:
1. `src/app/(website)/faculties` (folder name),
2. `PAGE_PATH` in that page,
3. `STATIC_ROUTES` in `src/app/sitemap.ts`,
4. menu links and any internal links.

### Sitemap contains a URL that 404s

Check `STATIC_ROUTES` against the actual `page.tsx` files. Only list routes that
exist, and add route-colliding institutional page slugs to `RESERVED_SLUGS`.

### Institutional page 404s

Its slug collides with a real route and is shadowed, or it is unpublished. Check
`RESERVED_SLUGS` and `isPublished`.

### `next/image` fails on an external URL

The image host is not allowed by the CSP, or the URL is not reachable. Upload the
image or extend the policy.

## Build and tooling

### `next dev` shows a Prisma client error after `prisma generate`

Restart the dev server. A running process can keep the previously compiled
client even after generation.

### Type check fails on generated types

Run `npm run prisma:generate` first, then `npx tsc --noEmit`. Generated types are
not hand-edited.

### ESLint flags a pattern that is intentional

Fix the code where possible. Do not disable rules globally; use a scoped disable
with a comment explaining why, if truly necessary.

### `media:test` or `e2e:http` fails

- `media:test` uses a scratch home/database configuration; read the script's
  header for required env.
- `e2e:http` needs a running server plus `E2E_BASE_URL`, `E2E_ADMIN_EMAIL`, and
  `E2E_ADMIN_PASSWORD`. Create the test admin with `npm run e2e:seed-admin`.

## Getting more information

- Database: `npm run db:connectivity`, `npm run prisma:studio`
- Upload storage: startup log, `npm run media:test`
- Email: Settings -> Send test email, server logs
- HTTP: browser devtools Network tab (status, response body) and the server
  console
- Prisma errors: run the failing action in development where logs include the
  real driver cause
