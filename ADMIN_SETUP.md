# STCET Admin Setup

The current admin release provides Auth.js sign-in, a database-backed dashboard, and course create/edit/publish/delete with ordered nested content. Other CMS modules are not active yet; their sidebar entries are intentionally disabled.

## Database and Environment

Use a MySQL 8-compatible database. Create a dedicated database and application user; do not use the MySQL root account. For example, from an administrative MySQL session:

```sql
CREATE DATABASE stcet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'stcet_app'@'%' IDENTIFIED BY '<use-a-generated-secret>';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON stcet.* TO 'stcet_app'@'%';
```

Prefer separate migration and runtime database users in production. The runtime user only needs data access; use the migration user only for deployment migrations.

Local database testing currently uses MySQL `root` with an empty password. This is strictly a local-development configuration; replace it with a dedicated least-privilege account and a strong password before exposing the database beyond localhost or deploying.

Copy the placeholders from `.env.example` into the existing local `.env` without replacing any existing values:

```dotenv
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/DATABASE_NAME"
NEXTAUTH_SECRET="a-unique-random-secret"
NEXTAUTH_URL="http://localhost:3000"
DATABASE_CONNECTION_LIMIT="5"
DATABASE_CONNECT_TIMEOUT_MS="5000"
UPLOADS_DIR="./uploads"
UPLOAD_MAX_BYTES="5242880"
```

Percent-encode reserved characters in the database username and password. Generate an Auth.js secret with `openssl rand -base64 32` or PowerShell:

```powershell
$bytes = [System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32)
[Convert]::ToBase64String($bytes)
```

Never prefix server secrets with `NEXT_PUBLIC_`. `.env*` files are ignored by Git; `.env.example` contains placeholders only.

## Install and Validate

The repository uses npm, Next.js 16, and Prisma ORM 7. The development environment was verified with Node.js 24.14.0 and npm 11.18.0. The image-signature detector requires Node.js 22 or newer.

```bash
npm install
npm run prisma:validate
npm run prisma:generate
```

## Migrations

The initial migration is `prisma/migrations/20261009090347_init`. It was generated and applied only after read-only introspection confirmed the local `stcet` database was empty. No reset or destructive migration was run.

For a **new, empty database**, apply the committed initial migration with:

```bash
npx prisma migrate deploy
```

For an **existing database**, take a verified backup and inspect its tables first. Compare its schema with the migration before deploying. If it already contains application tables, baseline the actual schema and mark the matching baseline before deploying; do not run `prisma migrate dev`, accept a reset prompt, or use `prisma db push` against it.

For future development schema changes, create and apply a reviewed migration with:

```bash
npm run prisma:migrate -- --name describe_the_change
```

After migrations have been reviewed and committed, production deployment applies them with:

```bash
npx prisma migrate deploy
```

## Bootstrap and Sample Course Records

After the schema migration, create the first administrator interactively:

```bash
npm run admin:bootstrap
```

The command prompts for the administrator name and email, reads the password without echoing it, requires at least 12 characters, hashes it with Node.js scrypt, and refuses to run after a super administrator exists. It creates no public/default account. Run it in a trusted terminal and do not put passwords in shell history or deployment source.

Seed the five course records whose names, slugs, degree labels, taglines, and image paths are present in the existing route source:

```bash
npm run prisma:seed
```

They are created as published because these records correspond to existing public routes. Only route-verified metadata is seeded; empty content sections continue to use their existing bundled fallback. Seeding is idempotent and leaves existing records, including their publication status, unchanged.

Inspect records with:

```bash
npm run prisma:studio
```

Abandoned course image uploads are eligible for cleanup after a 24-hour grace period. Run this safe sweep manually or schedule it once daily on the VPS:

```bash
npm run media:cleanup
```

The command retains any asset referenced by a course, module, career pathway, or Open Graph field. Extend its reference checks before wiring `MediaAsset` into other content modules.

## Run and Verify

```bash
npm run dev
```

Admin routes:

- `/admin/login`
- `/admin/forgot-password`
- `/admin/dashboard`
- `/admin/courses`
- `/admin/courses/new`
- `/admin/courses/[id]/edit`
- `/admin/courses/[id]/preview`

The database check is `GET /api/health/database`. It returns only `{"status":"ok"}` or `{"status":"unavailable"}`; `ok` confirms a simple query, not that migrations are current. Sign-in and course operations require the schema to be migrated.

Auth.js provides the HTTP-only session cookie. Sessions expire after eight hours; each protected request rechecks that the user is active and that the database session version matches. Signing out increments that version and clears the cookie. Five failed attempts for the same normalized email within the throttle window trigger a 15-minute cooldown. Administrator accounts map to the existing `SUPER_ADMIN` role; editors map to `CONTENT_EDITOR`. Editors can edit drafts but cannot change published courses, publish, or delete.

## Deployment

Use a private, TLS-protected MySQL endpoint and inject `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` from the deployment secret manager. Commit reviewed migrations; deploy them with `npx prisma migrate deploy`, generate the client with `npm run prisma:generate`, then build and start the Next.js application. Bootstrap the initial administrator through a controlled one-time deployment job or trusted terminal, then remove bootstrap access from routine deployment procedures. Never run a database reset in production.

### Hostinger VPS Upload Storage

The selected target is a Hostinger VPS running the Node.js application. Uploaded files use the Node filesystem and are served only through the Next.js `/uploads/[...path]` route; they are not written into `public/` and are not directly exposed by arbitrary filesystem paths. The running VPS filesystem is expected to persist across process restarts, but persistence across your particular deployment/release workflow must be verified on the VPS.

Configure `UPLOADS_DIR` to a persistent location outside the directory replaced by deployments. For example, if the Node service runs as the `stcet` user and group:

```bash
sudo install -d -o stcet -g stcet -m 0750 /var/lib/stcet/uploads
```

Set the production environment values:

```dotenv
UPLOADS_DIR="/var/lib/stcet/uploads"
UPLOAD_MAX_BYTES="5242880"
```

Ensure the Node process runs as that unprivileged service account and can write this directory. If Nginx is the reverse proxy, allow enough request-body overhead for a 5 MiB image, for example `client_max_body_size 6m;`. Keep the application limit configured independently; the server checks streamed bytes and image signatures. Do not grant uploads execute permission.

Back up `/var/lib/stcet/uploads` together with the MySQL database, and test restoring both. Before the first production deploy, verify the service user can create a file, upload and retrieve an image, restart/redeploy the application, and confirm the same image remains available. This repository cannot verify the VPS filesystem or proxy configuration without access to the deployed Hostinger instance.

Password-reset email is not configured, so the forgot-password route directs staff to the system administrator. Course image uploads are implemented for hero, module, career-pathway, and Open Graph images. Gallery/media-library UI, uploads in placement/infrastructure/committee modules, administrator and editor management, editor assignments, and the Admissions, Scholarships, Placements, Gallery, Infrastructure, Committees, Pages, Menus, and general SEO modules remain future work.
