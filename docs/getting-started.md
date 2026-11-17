# Getting Started

## Prerequisites

| Tool | Version | Notes |
| --- | --- | --- |
| Node.js | 22 or newer | Verified with Node 24.14. The image signature detector is in-process and has no native dependency, but the project targets modern Node. |
| npm | 10 or newer | The repository uses `package-lock.json`; use npm, not yarn/pnpm. |
| MySQL | 8-compatible | MariaDB also works through the Prisma MariaDB adapter. |
| Git | any recent | The default branch is `master`. |

The app needs a **writable home directory** because uploads are stored at
`<os.homedir()>/uploads`. On a normal developer machine and on Hostinger this
already holds. See [uploads.md](./uploads.md).

## 1. Install

```bash
npm install
```

`postinstall` runs `prisma generate`, so the generated client in
`src/generated/prisma` exists after install. If you ever see "did you forget to
run prisma generate?", run `npm run prisma:generate` and restart `next dev`.

## 2. Create the environment file

Copy `.env.example` to `.env` (never commit `.env`) and fill in real values.

| Variable | Required | Purpose |
| --- | --- | --- |
| `DATABASE_URL` | Yes | MySQL/MariaDB connection string: `mysql://USER:PASSWORD@HOST:3306/DATABASE`. Percent-encode reserved characters in the user/password. |
| `NEXTAUTH_SECRET` | Yes | Signs session JWTs and is also used to HMAC login/reset rate-limit keys. Generate with `openssl rand -base64 32`. |
| `NEXTAUTH_URL` | Production | The site origin used by Auth.js, e.g. `https://stcet.in`. |
| `NEXT_PUBLIC_BASE_URL` | Production | Canonical public origin for `metadataBase`, canonical URLs, Open Graph images, sitemap entries, and password-reset links. Falls back to `NEXTAUTH_URL`, then `http://localhost:3000`. |
| `DATABASE_CONNECT_TIMEOUT_MS` | No | Default `5000`. |
| `DATABASE_CONNECTION_LIMIT` | No | Default `5`. Keep low on shared MySQL hosts. |
| `DATABASE_MIN_IDLE` | No | Default `1`. **Must be at least 1**; `0` triggers a driver bug that looks like a permanent pool timeout. |
| `DATABASE_IDLE_TIMEOUT_MS` | No | Default `60000`. Must stay below the server's `wait_timeout`. |
| `DATABASE_PING_TIMEOUT_MS` | No | Default `1000`. |
| `ZEPTOMAIL_ENCRYPTION_KEY` | For email | 32+ character secret used to encrypt the ZeptoMail token stored in the database. Use the same value across restarts, or saved tokens cannot be decrypted. |

Notes:

- Uploads are capped at **1 MB in code** (`MAX_UPLOAD_BYTES` in
  `src/lib/admin/upload-storage.ts`). `UPLOAD_MAX_BYTES` is **not** read by the
  application and cannot raise the limit. It is only used by the manual e2e
  scripts.
- Never put a secret behind a `NEXT_PUBLIC_` prefix; those values are sent to
  the browser.

## 3. Prepare the database

For a new, empty database:

```bash
npm run prisma:validate
npx prisma migrate deploy
```

If you are working on schema changes locally:

```bash
npm run prisma:migrate -- --name describe_the_change
```

This creates a migration and applies it. Review the SQL before committing.
Never run `prisma migrate dev`, `db push`, or a reset against a database that
holds data you care about. See [database.md](./database.md).

## 4. Create the first administrator

```bash
npm run admin:bootstrap
```

The script prompts for name, email, and password (password is read without
echo), requires 12+ characters, and refuses to run when a super administrator
already exists. It creates **no default account**.

After signing in, additional administrators/editors can be created at
`/admin/users`. Only `SUPER_ADMIN` users can manage users.

## 5. Seed the bundled courses (optional but recommended)

```bash
npm run prisma:seed
```

Seeds the five course records that match the bundled course routes. It is
idempotent and does not change existing records or their publish state.

## 6. Run the site

```bash
npm run dev
```

- Public site: <http://localhost:3000>
- Admin: <http://localhost:3000/admin/login>
- Forgot password: <http://localhost:3000/admin/forgot-password>
- Database health: <http://localhost:3000/api/health/database>

`npm run dev` regenerates the Prisma client before starting Next. If you add a
migration while the dev server is running, restart it; the running process can
keep the previously compiled Prisma client.

## Useful commands

| Command | What it does |
| --- | --- |
| `npm run dev` | `prisma generate` then `next dev` |
| `npm run build` | `prisma generate` then `next build --webpack` |
| `npm run start` | Start a production build |
| `npm run lint` | ESLint (Next core-web-vitals + TypeScript) |
| `npx tsc --noEmit` | Type check without emitting |
| `npm run prisma:validate` | Validate `schema.prisma` |
| `npm run prisma:generate` | Regenerate the client |
| `npm run prisma:migrate -- --name <name>` | Create and apply a dev migration |
| `npm run prisma:seed` | Run `prisma/seed.ts` |
| `npm run prisma:studio` | Browse data in Prisma Studio |
| `npm run admin:bootstrap` | Create the first super administrator |
| `npm run media:cleanup` | Delete unreferenced uploads older than the grace period |
| `npm run media:test` | Upload storage end-to-end check |
| `npm run e2e:http` | HTTP upload check (needs a running server and credentials) |
| `npm run e2e:seed-admin` | Create a disposable admin for e2e runs |
| `npm run db:connectivity` | Exercise the exact app Prisma initialization |
| `npm run faculty:import` | Import faculty records from the bundled dataset |

## First-run checklist

1. `npm run prisma:validate` passes.
2. `npx prisma migrate deploy` reports no pending migrations.
3. `GET /api/health/database` returns `{"status":"ok"}`.
4. `npm run admin:bootstrap` created your account; you can sign in.
5. The startup log shows `[startup] upload storage ready at ...`.
6. You can upload a JPEG/PNG/WebP under 1 MB in the admin and see it on the
   public site.
7. Site Settings has contact details, and (if email is needed) a ZeptoMail token
   plus `ZEPTOMAIL_ENCRYPTION_KEY` is set. Use **Send test email** before going
   live.

If something fails, see [troubleshooting.md](./troubleshooting.md).
