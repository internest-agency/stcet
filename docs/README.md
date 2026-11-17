# STCET Developer Documentation

This folder is the technical reference for the S. Thangapazham College of
Engineering & Technology website: a Next.js 16 application with a MySQL/MariaDB
database, a Prisma data layer, Auth.js administration, a local upload pipeline,
and ZeptoMail notifications.

If you are new to the project, read **Getting started** first, then
**Architecture**. Everything else can be read on demand.

## Documentation map

| Document | What it covers |
| --- | --- |
| [getting-started.md](./getting-started.md) | Prerequisites, environment variables, install, migrations, first admin, running the site |
| [architecture.md](./architecture.md) | Stack, directory layout, route groups, rendering and data-flow conventions, public/admin route maps |
| [database.md](./database.md) | Prisma setup, schema overview, migrations, seeding, the schema-revision cache, backups |
| [admin-cms.md](./admin-cms.md) | Authentication, roles and permissions, admin modules, publishing workflow, users, settings, menus, media, SEO |
| [content-modules.md](./content-modules.md) | Every public page and where its content comes from, including fallbacks |
| [uploads.md](./uploads.md) | The 1 MB image pipeline, storage location, serving, media registry, cleanup |
| [email.md](./email.md) | ZeptoMail configuration, contact/enquiry delivery, password-reset mail, testing |
| [seo.md](./seo.md) | Metadata, per-page SEO, sitemap, robots, JSON-LD, custom head/body code |
| [security.md](./security.md) | AuthN/AuthZ, password hashing, rate limits, sanitization, headers, secrets, audit trail |
| [deployment.md](./deployment.md) | Build, environment, migrations, upload persistence, reverse proxy, post-deploy checks, backups |
| [troubleshooting.md](./troubleshooting.md) | Known failure modes and fixes (DNS, stale Next cache, uploads, DB resets, login/reset, events) |

## Stack at a glance

- **Framework:** Next.js 16.4 (App Router), React 19.2, TypeScript 5
- **Build:** Webpack (`next build --webpack`); `next dev` uses the default dev bundler
- **Database:** MySQL 8-compatible / MariaDB via Prisma 7 and `@prisma/adapter-mariadb`
- **Auth:** Auth.js (NextAuth) v4, credentials provider, JWT session, scrypt password hashes
- **UI:** Tailwind CSS 4, lucide-react icons, GSAP and Lenis for animation
- **Email:** ZeptoMail Node SDK 8
- **Validation:** Zod 4
- **Content:** database-first with bundled fallbacks for courses, gallery, and some static sections

## Repository layout

```text
prisma/
  schema.prisma          All models and enums
  migrations/            Committed SQL migrations (keep in sync with schema)
  seed.ts                Idempotent course seed for the five bundled course routes
scripts/                 Operational scripts (bootstrap admin, cleanup, diagnostics, e2e)
src/
  app/
    (website)/           Public site (own layout with header/footer)
    admin/               Admin login, password reset, and protected CMS
    api/                 Contact, enquiry, health, media upload, exports, Auth.js
    uploads/[...path]/   Authenticated-by-registry image serving route
    layout.tsx           Root layout: fonts, metadataBase, custom code
    globals.css          Tailwind entry, theme tokens, rich-text safelist
    robots.ts sitemap.ts Metadata routes
  components/
    layout/              Header, Footer, navigation
    sections/            Page sections grouped by feature
    admin/               Admin shell, managers, forms, upload field
    ui/                  Shared primitives (Button, Container, RichText, ...)
  config/                Site/theme configuration
  lib/
    admin/               Auth, authorization, validation, uploads, settings, encryption
    content/             Bundled fallback content and HTML policy
    courses/             Bundled course page content
    events/              Asia/Kolkata date/time helpers
    queries/             All read queries (public and admin)
    prisma*.ts           Prisma client factory and server-only re-export
  generated/prisma/      Generated Prisma client (do not edit)
```

## Conventions worth knowing

- **Reads live in `src/lib/queries/*`.** Public queries never throw: they log and
  return `null`, `[]`, or bundled fallback content so a database outage degrades
  a page instead of crashing it.
- **Writes live in `actions.ts` files** under the admin routes and use
  `"use server"`, Zod validation, `requireAdmin`/`requireAdministrator`, and
  `revalidatePath` after a successful change.
- **Images are stored outside the deploy tree** and referenced by database rows;
  see [uploads.md](./uploads.md).
- **`prismaSchemaRevision`** in `src/lib/prisma-client.ts` must be bumped after
  additive migrations, or a long-running process can keep a stale client.
- **Rich text is sanitized on write and render** through
  `src/lib/content/html.ts`. Tailwind classes allowed in stored content must also
  be listed in `src/app/globals.css`.
- **Events are wall-clock strings** in `Asia/Kolkata`, not UTC instants; see
  [content-modules.md](./content-modules.md#events).

## Legacy documents

These files still exist at the repository root and are useful, but partly
outdated:

- `ADMIN_SETUP.md` - database/bootstrap/deployment notes. Its statements about
  "other CMS modules are not active", "sessions expire after eight hours",
  "5 MiB uploads", and "password-reset email is not configured" predate the
  current implementation. The current values are: most CMS modules are active, a
  session lasts **4 hours**, uploads are capped at **1 MB**, and password-reset
  email is implemented through ZeptoMail.
- `THEME_GUIDE.md` - colours, typography, and helper classes.
- `STCET-Security-Audit-Report.md` - a point-in-time security review.

When this folder and a root-level document disagree, treat `docs/` and the code
as authoritative, then update the older document.
