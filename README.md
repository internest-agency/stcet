# STCET Website & Admin CMS

The official website and content-management system for **S. Thangapazham College
of Engineering & Technology (STCET)**. It is a Next.js 16 application with a
MySQL/MariaDB database, Prisma, Auth.js administration, a local image-upload
pipeline, and ZeptoMail notifications.

## Features

- Public site: home, about, admissions, courses, faculty, placements,
  scholarships, infrastructure, gallery, events, committees, institutional
  pages, contact, and admissions enquiry.
- Admin CMS: dashboard, enquiries, contact messages, events, about, governing
  council, courses, faculty and groups, gallery, admissions, scholarships,
  placements, infrastructure, committees, media, SEO, users, settings, menus,
  and institutional pages.
- Role-based access (`SUPER_ADMIN`, `CONTENT_EDITOR`) with publishing and
  deletion restricted to super admins.
- Image uploads limited to **1 MB** (JPEG, PNG, WebP), stored outside the deploy
  tree and served only through a validated route.
- Contact and admissions-enquiry emails to both the admin and the visitor, plus
  admin password-reset email via ZeptoMail.
- Events with upcoming/past/category sections, Asia/Kolkata wall-clock dates,
  and schema.org JSON-LD.
- Gallery images with independent **home page** and **gallery page** visibility.
- Per-page SEO, dynamic sitemap/robots, custom head/body code, and security
  headers.

## Quick start

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, NEXTAUTH_SECRET, ...
npm run prisma:validate
npx prisma migrate deploy
npm run admin:bootstrap   # create the first super admin
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>
- Database health: <http://localhost:3000/api/health/database>

Production build:

```bash
npm run build
npm run start
```

## Documentation

Complete developer documentation is in **[docs/](./docs/README.md)**:

| Document | Contents |
| --- | --- |
| [Getting started](./docs/getting-started.md) | Prerequisites, environment, install, migrations, first admin |
| [Architecture](./docs/architecture.md) | Stack, layout, route maps, data-flow conventions |
| [Database](./docs/database.md) | Prisma setup, schema overview, migrations, seed, backups |
| [Admin CMS](./docs/admin-cms.md) | Auth, roles, modules, publishing, users, settings, menus |
| [Content modules](./docs/content-modules.md) | Public pages, data sources, fallbacks, events, gallery |
| [Uploads](./docs/uploads.md) | 1 MB pipeline, storage, serving, cleanup |
| [Email](./docs/email.md) | ZeptoMail configuration, contact/enquiry, password reset |
| [SEO](./docs/seo.md) | Metadata, sitemap, robots, JSON-LD, custom code |
| [Security](./docs/security.md) | AuthN/AuthZ, rate limits, sanitization, headers, secrets |
| [Deployment](./docs/deployment.md) | Build, environment, proxy, post-deploy checks, backups |
| [Troubleshooting](./docs/troubleshooting.md) | Known failure modes and fixes |

Additional references:

- `ADMIN_SETUP.md` - database/bootstrap/deployment notes (partly legacy; see the
  note in `docs/README.md`)
- `THEME_GUIDE.md` - colours, typography, and helper classes
- `STCET-Security-Audit-Report.md` - point-in-time security review
- `AGENTS.md` - repository instructions for AI coding agents

## Tech stack

Next.js 16.4 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 ·
Prisma 7 with `@prisma/adapter-mariadb` · MySQL/MariaDB · Auth.js v4 ·
Zod 4 · ZeptoMail SDK 8 · GSAP/Lenis

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Generate Prisma client and start the dev server |
| `npm run build` | Generate Prisma client and build with Webpack |
| `npm run start` | Start the production server |
| `npm run lint` | ESLint |
| `npm run prisma:migrate -- --name <name>` | Create/apply a development migration |
| `npm run prisma:seed` | Seed the five bundled course records |
| `npm run admin:bootstrap` | Create the first super administrator |
| `npm run media:cleanup` | Remove unreferenced uploads older than 24 hours |
| `npm run db:connectivity` | Diagnose the Prisma/database connection |

## License

Private project. All content and branding belong to STCET.
