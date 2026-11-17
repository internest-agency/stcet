# SEO, Metadata, and Custom Code

## Origin and `metadataBase`

`getSiteUrl()` (`src/lib/site-url.ts`) resolves the canonical origin in this
order:

1. `NEXT_PUBLIC_BASE_URL`
2. `NEXTAUTH_URL`
3. `http://localhost:3000`

It normalizes to `new URL(value).origin` and falls back silently on an invalid
value. The root layout sets `metadataBase` from it, so relative canonical and
Open Graph URLs become absolute.

**Production requirement:** set `NEXT_PUBLIC_BASE_URL` to the real HTTPS origin.
Without it, canonical URLs, OG images, sitemap URLs, and password-reset links
point at localhost.

## Metadata sources

### Root layout

`src/app/layout.tsx` defines the default title and description:

```text
STCET | College Website
A modern college website built with Next.js
```

Every page that does not override them inherits these. Pages should always
provide a real title and description.

### Per-page `PageSeo` records

`PageSeo` has one row per `pagePath` with `seoTitle`, `metaDescription`,
`canonicalUrl`, `ogImage`, and `noIndex`. `getPageSeo(path)` returns safe empty
values when the database is unavailable.

All public pages across the site integrate with `getPageMetadata(pagePath, defaults)`
(which delegates to `getPageSeo`) and generate canonical URLs (`alternates.canonical`),
falling back to their route paths when no database override exists:

- Home (`/`)
- About (`/about`)
- Admissions (`/admissions`)
- Careers (`/careers`)
- Contact (`/contact`)
- Enquire Now (`/enquire-now`)
- Events (`/events`) and Event details (`/events/[slug]`)
- Faculty (`/faculties`)
- Gallery (`/gallery`)
- Infrastructure (`/infrastructure`)
- IQAC (`/iqac`)
- Placements (`/placements`)
- Scholarships (`/scholarships`)
- Statutory Committees (`/anti-ragging-committee`, `/grievance-redressal-committee`, `/internal-complaints-committee`, `/sc-st-cell`)
- Institutional Pages (`/[institutionalSlug]`)
- Courses (`/courses/[slug]`)

### Courses

`/courses/[slug]` uses course fields directly:

- `seoTitle`, else `<name> | STCET`
- `metaDescription`, else the first overview paragraph, else a generated line
- `canonicalUrl`, else `/courses/<slug>`
- `ogImage`, else the bundled hero image
- `noIndex` -> `robots: { index: false, follow: false }`

If neither a published database course nor bundled content exists, metadata is
`Course Not Found | STCET` with `noindex` and the page calls `notFound()`.

### Events

`/events` reads `/events` from `PageSeo` with a descriptive fallback. Event
detail pages generate their own title/description from the event and use
`schema.org/Event` JSON-LD (date, time with `+05:30`, venue, image, organizer,
offers/registration URL when present).

### Gallery and others

Gallery, admissions, placements, infrastructure, committees, and the remaining
pages define static or component-provided metadata. Review them individually if
you need per-page overrides.

## Sitemap

`src/app/sitemap.ts` is `force-dynamic`, so it reflects the database at request
time and never needs a database at build time. It includes:

1. **Fixed public routes** from its `STATIC_ROUTES` list, with priorities and
   change frequencies. Entries whose `PageSeo.noIndex` is true are skipped.
2. **Published, indexable database courses**, using their canonical URL when it
   stays on the same origin.
3. **Bundled course slugs** that are not shadowed by a database record.
4. **Published institutional pages**, except slugs in `RESERVED_SLUGS` that
   collide with real routes.
5. **Published events**, at `/events/<slug>`.

The sitemap de-duplicates by URL (first writer wins), and excludes cross-origin
canonicals because the canonical points elsewhere.

Rules when adding a page:

- Add its path to `STATIC_ROUTES` only if a real `page.tsx` exists.
- Add route-colliding slugs to `RESERVED_SLUGS`.
- Make sure the path matches the actual route. (The faculty entry currently
  says `/faculty` while the page is `/faculties`; see below.)

## Robots

`src/app/robots.ts` is `force-dynamic` and returns:

```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api
Content-Signal: search=yes, ai-train=no

Sitemap: <origin>/sitemap.xml
```

`/uploads` is not disallowed because public pages need those images.

## Custom head and body code

Super admins can paste raw HTML/script into **Settings -> Custom head code** and
**Custom body end code**. Both are stored in `SiteSettings` and rendered by
`renderCustomCode()` (`src/lib/custom-code.tsx`):

- The snippet is parsed into React nodes, not injected as one HTML blob.
- Inline event-handler attributes (`onclick`, `onerror`, ...) are stripped.
- `<script>` tags are rendered with `dangerouslySetInnerHTML` (inline) or as
  external `src` scripts so they execute.
- `<style>` tags pass through.
- Parse errors are logged and the snippet is skipped; the page still renders.

This is intentionally powerful (analytics, verification meta tags, chat widgets).
Treat super-admin access as equivalent to code injection. Never paste untrusted
snippets.

The root layout renders head code, and body-end code at the end of `<body>`.
Because the root layout is database-backed, custom code is applied to both the
public site and admin pages. Test carefully; a broken script can affect the
admin UI too.

## Security headers and CSP

`next.config.ts` applies headers to every route:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` denying camera/microphone/geolocation
- `Content-Security-Policy` with `default-src 'self'`, inline/eval scripts
  allowed, Google Maps frames and images allowed, `frame-ancestors 'none'`,
  `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, and
  `upgrade-insecure-requests`

Implications:

- Custom inline scripts work because `'unsafe-inline'` and `'unsafe-eval'` are
  allowed. Tightening the CSP later will break custom code unless nonces are
  introduced.
- Images must be same-origin, `data:`, `blob:`, Google, or gstatic. External
  images from other hosts are blocked; upload them or add the host to `img-src`.
- Forms can only submit to this origin. Third-party form endpoints will be
  blocked.
- The `/uploads` route adds its own stricter `default-src 'none'; sandbox` CSP.

## Images and Open Graph

- Bundled images live under `public/images`.
- Uploaded images live under `/uploads/...` and are served by the validated
  route.
- `next/image` is used for most content images; the CSP still applies.
- Use absolute URLs (or paths resolved against `metadataBase`) for OG images.
- Prefer a 1200x630 image for OG, and keep uploaded files under 1 MB.

## Structured data

Structured data (JSON-LD) is currently provided on:
- **Homepage (`/`)**: Emits `EducationalOrganization` / `CollegeOrUniversity` and `WebSite` schemas describing the institution name, alternate names (STCET), contact points, postal address, logo, campus image, and official social links (`sameAs`).
- **Event detail pages (`/events/[slug]`)**: Emits `schema.org/Event` with date, venue, organizer, and registration/ticket details.

If you add Course, BreadcrumbList, or FAQ schema, keep it consistent with
visible content and test with a structured-data validator. Do not add markup
for content that is not on the page.

## Analytics and verification

Use the custom head/body fields for:

- analytics scripts,
- search-engine verification meta tags,
- third-party chat widgets,
- pixel tags.

There is no built-in analytics integration. Because custom code is global, a
verification tag added for one page also appears on every page; that is usually
acceptable for site verification.

## SEO checklist for a new page

1. Create the route under `src/app/(website)/`.
2. Add `generateMetadata` (title, description, canonical, OG image, robots).
3. If it should be editable, add a `PageSeo` row and call `getPageSeo`.
4. Add the path to `src/app/sitemap.ts` if it is a fixed public route.
5. Ensure it is excluded from the sitemap when `noIndex` is set.
6. Check the rendered page with JavaScript disabled and with a crawler user
   agent.
7. Verify the canonical URL uses the production origin.

## Known issue: faculty URL

The public page is `/faculties`; the SEO path and sitemap entry are `/faculty`.
Until reconciled:

- `/faculties` works and reads SEO from `/faculty`.
- `/faculty` 404s (unless an institutional page shadows it).
- `/sitemap.xml` advertises a URL that does not exist.

Fix by choosing one URL and updating all three places (page folder, `PAGE_PATH`,
sitemap) together. See [troubleshooting.md](./troubleshooting.md#faculty-url).
