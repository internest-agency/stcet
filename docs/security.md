# Security

This document describes what the application enforces today and what the
deployment must enforce. It is not a substitute for a periodic review; see also
`STCET-Security-Audit-Report.md` for a point-in-time assessment.

## Authentication

- **Credentials only.** No OAuth, magic links, or public registration.
- **Password hashing:** Node `scrypt` with `N=32768, r=8, p=1`, a random 16-byte
  salt, and a 64-byte key, stored in a versioned `scrypt$...` string.
- **Verification:** constant-time comparison with `timingSafeEqual`. Unknown or
  malformed hash formats still run a derivation before returning false, reducing
  timing differences.
- **Password policy:** bootstrap and user creation require at least 12
  characters. There is no composition rule or breach-list check.
- **Login throttling:** 5 failed attempts per normalized email in 15 minutes
  triggers a 15-minute block. Keys are HMAC-SHA256 of the email with
  `NEXTAUTH_SECRET`; raw emails are not stored in the attempt table.
- **Sessions:** Auth.js JWT, 4-hour lifetime, 1-hour update age, HTTP-only
  cookie. `sessionVersion` is checked against the database on every protected
  request, so deactivation, password changes, and sign-out invalidate existing
  sessions.
- **No account enumeration on reset:** unknown, inactive, and recently-requested
  emails all return the same generic success page.

## Authorization

- Two roles: `SUPER_ADMIN` and `CONTENT_EDITOR`.
- Every protected admin layout calls `requireAdmin()`.
- Admin-only pages call `requireAdministrator()`: users, settings, SEO, media.
- Destructive and publishing actions call `requireAdministrator()` or check
  `isAdministrator()` before accepting a publish/delete flag.
- Course editors may not modify a course that is already published.
- Hiding a navigation link is never the only control; the server action rechecks
  the role.

## Input handling

- **Zod** validates every admin form and most API payloads. Numeric IDs are
  coerced and range-checked; enums are native enums.
- **Rich text** is sanitized on write and on render through
  `src/lib/content/html.ts` (isomorphic-dompurify with an explicit tag,
  attribute, and class allowlist). Unsafe protocols and arbitrary classes are
  removed.
- **HTML in email** is escaped before interpolation.
- **URLs** in admin content are validated to be `http(s)` where the field is a
  link, and image references are validated against `/images` or the upload
  registry.
- **Prisma** parameterizes queries. The only raw SQL is `SELECT 1` for health.
- **Path traversal** is blocked for uploads and for bundled image references by
  resolving, checking `path.relative`, and rejecting symlinks/real paths outside
  the root.

## Upload security

See [uploads.md](./uploads.md) for the full pipeline. Key properties:

- authenticated admin + same-origin `Origin` check,
- 1 MB hard limit,
- JPEG/PNG/WebP only, detected by magic bytes,
- UUID filenames and restrictive permissions,
- storage outside the web root,
- serving requires a `MediaAsset` row and re-validates the real path,
- `nosniff`, sandbox CSP, and same-site CORP on served files.

## API abuse controls

| Surface | Limit | Scope |
| --- | --- | --- |
| `/api/contact` | 5 per hour | client IP |
| `/api/enquiry` | 5 per hour | client IP |
| `/api/health/database` | 10 per minute | client IP |
| Login | 5 failures / 15 min, then 15-min block | normalized email |
| Password reset request | 3 / 15 min, then 15-min block; plus 15-min recent-token throttle | normalized email |
| Contact/enquiry duplicates | rejected within 2 minutes | same submission fingerprint |

Important limitations:

- The rate limiter is an in-memory `Map` per Node process. It resets on restart
  and is not shared across instances. With multiple processes, the effective
  limit is per process. Put a shared limiter (proxy/WAF/Redis) in front if you
  need strict global limits.
- `getClientIp()` trusts `cf-connecting-ip`, then `x-real-ip`, then the first
  `x-forwarded-for` hop. These headers are only trustworthy when your reverse
  proxy overwrites them. If clients can reach Node directly, they can spoof the
  IP and evade limits.
- Rate limiting is not a substitute for a WAF or bot protection.

## CSRF and origin checks

- Admin writes use Next.js server actions with the authenticated session cookie;
  Next applies its server-action origin protections.
- `/api/admin/media/upload` explicitly rejects a mismatched `Origin`.
- The public contact/enquiry endpoints are unauthenticated by design. They do
  not rely on cookies, validate content, rate-limit, and deduplicate. They do
  **not** implement a separate CSRF token, so do not add cookie-authenticated
  behavior to them without adding CSRF protection.
- Auth.js provides its own CSRF token for the credentials sign-in flow.

## HTTP headers

`next.config.ts` sets HSTS, `nosniff`, `X-Frame-Options: DENY`,
`Referrer-Policy`, `Permissions-Policy`, and a CSP. See
[seo.md](./seo.md#security-headers-and-csp) for the exact policy and its
trade-offs.

## Secrets

Server secrets:

- `DATABASE_URL`
- `NEXTAUTH_SECRET`
- `ZEPTOMAIL_ENCRYPTION_KEY`

Rules:

- Never prefix a secret with `NEXT_PUBLIC_`.
- `.env` is git-ignored; `.env.example` contains placeholders only.
- Use different secrets per environment. Changing `NEXTAUTH_SECRET` logs out
  every admin; changing `ZEPTOMAIL_ENCRYPTION_KEY` makes the stored ZeptoMail
  token undecryptable.
- ZeptoMail tokens are AES-256-GCM encrypted at rest with a key derived from
  `ZEPTOMAIL_ENCRYPTION_KEY`. The token is never sent to the browser.
- Restrict database credentials to the application schema and use a separate
  migration user in production. Do not use MySQL `root`.
- Rotate credentials if they appear in logs, screenshots, tickets, or git
  history.

## Audit trail

`AdminAuditLog` records actor, action, entity type/id, JSON details, and time
for creates, updates, deletes, publishing, user changes, media changes, and
settings/SEO changes. Deletes and user changes are often written inside the same
transaction as the change.

Operational notes:

- There is no automatic retention/pruning. Plan a retention window and archive
  or delete old rows deliberately.
- The admin UI does not currently expose an audit viewer, so use SQL/Prisma
  Studio when investigating.
- `actorId` is `SetNull` when an admin is deleted; the action and entity remain.

## Data protection and privacy

- Contact and enquiry records store the submitter's IP address (`clientIp`) and
  the submitted personal data (including student/parent details).
- Restrict database and backup access. Backups contain personal data.
- Define a retention policy for enquiries/messages and purge or anonymize old
  rows as required by the institution's policy.
- Do not log full form bodies. Current logs focus on send outcomes and
  error codes.
- Error responses avoid leaking database or filesystem details; detailed causes
  go to server logs only.

## Dependency and platform hygiene

- Keep Next.js, Prisma, Auth.js, Zod, and the ZeptoMail SDK patched.
- Run `npm audit` periodically and review breaking changes before upgrading.
- Serve only over HTTPS. HSTS is set with `preload`; make sure every subdomain
  supports HTTPS before submitting to the preload list.
- Keep the upload directory and database backed up together, and test restores.
- Do not run `prisma migrate reset`, `db push`, or destructive SQL against a
  database with real content.

## Recommended production additions

These are not implemented in the repository but are worth considering:

- A shared rate-limit store or edge/WAF rate limiting.
- Bot protection/CAPTCHA on the public contact and enquiry forms if spam
  becomes a problem.
- An admin audit-log viewer with filtering.
- A content security policy with nonces/hashes instead of `unsafe-inline` and
  `unsafe-eval`.
- Two-factor authentication for super admins.
- Automated database and upload backups with restore drills.
