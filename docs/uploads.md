# Image Uploads

## Limits and formats

- **Maximum size: 1 MB (1,048,576 bytes).** Hard-coded as `MAX_UPLOAD_BYTES` in
  `src/lib/admin/upload-storage.ts`. It is enforced in three places:
  1. the browser (`ImageUploadField` rejects larger files before uploading),
  2. the upload API (`Content-Length` check returns `413`),
  3. the server stream (`storeImageStream` aborts as soon as the limit is
     exceeded, so a missing/lying `Content-Length` cannot bypass it).
- **Formats: JPEG, PNG, WebP only.** The type is detected from magic bytes, not
  from the client-provided MIME type or filename.
- `UPLOAD_MAX_BYTES` is **not read by the application** and cannot raise the
  limit. The e2e scripts under `scripts/` still use it to size their test
  payloads.
- Text labels across the admin say "maximum 1 MB" and must stay in sync with the
  constant.

## Upload flow

1. An admin form uses `src/components/admin/ImageUploadField.tsx`.
2. The field sends a `POST` to
   `/api/admin/media/upload?category=<category>` with the file as the raw
   request body.
3. The route:
   - checks `Origin` against the request host (same-origin only),
   - requires an authenticated admin (`getCurrentAdmin`),
   - validates the category against the allowlist,
   - rejects an oversized `Content-Length` with `413`,
   - calls `storeImageStream`.
4. `storeImageStream`:
   - resolves and creates `<home>/uploads/<category>` (`0750`),
   - writes to a temporary `.upload-<uuid>.tmp` file with `flags: "wx"`,
     `0600`,
   - counts bytes and aborts past 1 MB,
   - sniffs the first bytes for PNG/JPEG/WebP,
   - renames to `<uuid>.<jpg|png|webp>`, chmod `0640`,
   - returns `{ path: "/uploads/<category>/<uuid>.<ext>", contentType, size }`.
5. The route registers a `MediaAsset` row with the path, content type, size, and
   uploading admin.
6. If registration fails, the just-written file is removed and the API returns
   `503`. No orphan file is left behind.
7. The form receives the path and stores it in a hidden field. The module's
   server action validates the reference with `validateImageReferences` before
   saving.

Category allowlist:

```text
courses/heroes      courses/modules     courses/careers
gallery             admissions          placements
infrastructure      committees          pages
faculty             about               council
events
```

Adding a category requires updating `UPLOAD_CATEGORIES` **and** keeping it in sync
with `parseManagedPath`, which matches a stored reference against those
categories by prefix (so two-segment categories such as `courses/heroes` work).
The remaining relative path must be a UUID filename with a `.jpg`, `.png`, or
`.webp` extension.

## Storage location

```ts
getUploadRoot() => path.join(os.homedir(), "uploads")
```

- No environment variable is involved.
- On Hostinger this is `/home/<account-user>/uploads`, outside the deploy tree,
  so uploads survive redeploys.
- On Windows it is `C:\Users\<you>\uploads`.
- The directory is created on first use; `instrumentation.ts` verifies
  writability at startup and logs:

  ```text
  [startup] upload storage ready at /home/<user>/uploads
  ```

  If it logs `upload storage is NOT writable`, fix permissions before letting
  anyone upload.

Files are not served from `public/` and are not exposed by Nginx/Apache. They are
only reachable through the Next.js route below.

## Serving route

`GET /uploads/[...path]` (`src/app/uploads/[...path]/route.ts`):

1. Accepts 2-3 path segments (because categories can be one or two segments).
2. Requires a `MediaAsset` row with exactly that path and an allowed content
   type. An unregistered file is a `404`, even if it exists on disk.
3. `openManagedUpload` resolves the real path and rejects:
   - non-files and symlinks,
   - paths outside the upload root (including after `realpath`),
   - files larger than the 1 MB limit.
4. The file size must match the database row, otherwise it is treated as missing
   and logged (throttled to once per minute per reference).
5. Responses are streamed with:

   ```text
   Cache-Control: public, max-age=31536000, immutable
   X-Content-Type-Options: nosniff
   Content-Security-Policy: default-src 'none'; sandbox
   Cross-Origin-Resource-Policy: same-site
   ```

Because filenames are UUIDs and content is immutable, the long cache is safe.
Replacing an image means uploading a new file and updating the reference; never
overwrite an existing file.

## Reference validation

`validateImageReferences(references, unchangedReferences)`:

- `/images/...` must resolve to a real file under `public/images` (path traversal
  rejected).
- `/uploads/...` must be a managed path and must exist in `MediaAsset`.
- Any other value is rejected.
- `unchangedReferences` lets an edit form keep an existing value without
  re-validating it.

Server actions call this before saving, so a forged hidden field cannot inject an
arbitrary path.

## Cleanup and lifecycle

### On delete

Admin modules call `cleanupUnreferencedUploads(paths)` after removing a record.
It only deletes a file when **no** content table references it anymore.

### Scheduled sweep

`npm run media:cleanup` deletes `MediaAsset` rows (and files) older than a
**24-hour grace period** when no content record references them.

Reference checking is centralized in `src/lib/admin/upload-references.ts` and
covers every image-bearing column in the schema:

- courses: `heroImage`, `ogImage`, module images, career-pathway images
- gallery images
- admission routes and TNEA counselling images
- training programmes and industry interactions
- placement company logos and leadership officer photo
- infrastructure facilities
- committee hero images
- institutional page sections
- general pages
- page SEO Open Graph images
- site settings logo and favicon
- faculty photos
- event images
- governing council, about founder, chairman message, vision image

When you add a new image column, **add it to `isUploadReferenced`**. Otherwise a
future cleanup can delete a file that a live page still renders.

### Media library deletion

`/admin/media` refuses to delete an asset while content references it and keeps
the file when the check cannot be completed. Prefer removing the reference
through the owning module, then let cleanup handle the file, or delete from the
media library after the reference is gone.

## Reverse proxy and request size

If Nginx sits in front, allow a little overhead above 1 MB:

```nginx
client_max_body_size 2m;
```

A `413` before the request reaches Next means the proxy limit is too low. A `413`
from Next itself means the file genuinely exceeds 1 MB or the form is sending a
larger multipart payload. (`ImageUploadField` sends the raw file body, not
multipart, to the upload endpoint.)

## Security properties

- Requires an authenticated admin and same-origin `Origin`.
- Content type is derived from bytes, not user input.
- UUID filenames; no user-controlled path components.
- Files are created with restrictive permissions and outside the web root.
- Serving requires a database registry row, blocks symlinks, and re-checks the
  real path.
- The served response is `nosniff`, sandboxed by CSP, and constrained by
  `Cross-Origin-Resource-Policy`.
- Stored files are limited to image formats; no SVG (which can contain script)
  is accepted.

## Testing uploads

```bash
npm run media:test     # storage + validation end to end, no HTTP
npm run e2e:http       # needs a running server and admin credentials
npm run e2e:seed-admin # creates a disposable admin for the HTTP test
```

The e2e scripts use `E2E_BASE_URL`, `E2E_ADMIN_EMAIL`, `E2E_ADMIN_PASSWORD`, and
optionally `UPLOAD_MAX_BYTES` to size payloads. They are development tools, not
part of the production runtime.

## Manual checklist

1. Upload a JPEG, PNG, and WebP under 1 MB; each appears after save.
2. Try a 2 MB file: the browser blocks it; forcing a request returns `413`.
3. Try a `.gif` or a renamed `.txt`: `415`.
4. Confirm the image URL is `/uploads/<category>/<uuid>.<ext>`.
5. Delete the owning record (as super admin) and confirm the file is eventually
   removed by cleanup, not while another record still references it.
