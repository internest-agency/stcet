# Deployment

The application is a standard long-running Next.js Node server with a MySQL
database and a writable home directory for uploads. It is not a static export.

## Build and start

```bash
npm ci
npm run prisma:validate
npx prisma migrate deploy
npm run build
npm run start
```

- `npm run build` runs `prisma generate` and `next build --webpack`.
- `npm run start` runs `next start` (default port 3000; set `PORT` to change it).
- Node 22+ is required; verified on Node 24.
- The build does not need a database. Public pages and metadata routes read the
  database at request time.
- `postinstall` also runs `prisma generate`, so `npm ci` leaves a usable client.

If you use a process manager (systemd, pm2, Hostinger's Node.js app runner),
make sure it:

- sets the environment variables below,
- runs as the user whose home directory holds `uploads`,
- restarts on failure,
- starts in the repository root (so `public/` and `.next/` resolve).

## Required environment

| Variable | Value |
| --- | --- |
| `DATABASE_URL` | Production MySQL/MariaDB URL. Percent-encode reserved characters. |
| `NEXTAUTH_SECRET` | Unique random secret for this environment. |
| `NEXTAUTH_URL` | Public HTTPS origin, e.g. `https://stcet.in`. |
| `NEXT_PUBLIC_BASE_URL` | Same public HTTPS origin. Used for canonical/OG URLs, sitemap, and reset links. |
| `ZEPTOMAIL_ENCRYPTION_KEY` | 32+ character secret; required to save/decrypt the ZeptoMail token. |

Optional pool tuning: `DATABASE_CONNECTION_LIMIT`,
`DATABASE_CONNECT_TIMEOUT_MS`, `DATABASE_MIN_IDLE`,
`DATABASE_IDLE_TIMEOUT_MS`, `DATABASE_PING_TIMEOUT_MS`. Keep
`DATABASE_MIN_IDLE >= 1` and idle timeout below the server's `wait_timeout`.

Do **not** set `UPLOAD_MAX_BYTES` expecting it to change the limit; the app caps
uploads at 1 MB in code.

Check the database target before running migrations. Development `.env` files in
this project have pointed at a shared live database; a migration against the
wrong host is destructive.

## Database migrations

Deploy committed migrations only:

```bash
npx prisma migrate deploy
```

- Never run `prisma migrate dev`, `prisma db push`, or a reset in production.
- Back up first, especially for destructive or non-transactional DDL.
- For an existing database without migration history, baseline it rather than
  letting Prisma reset.
- Restart the app after deploying an additive migration. The app caches the
  Prisma client; `prismaSchemaRevision` must be bumped in code when a new
  field/model is read.

## Upload storage

Uploads live at `path.join(os.homedir(), "uploads")`:

- Hostinger: `/home/<account-user>/uploads`
- A VPS: `/home/<app-user>/uploads`

Requirements:

- the Node process user owns or can write that directory,
- the directory is outside the deploy/release directory so redeploys do not
  erase it,
- it is included in backups,
- the startup log says `[startup] upload storage ready at ...`.

If you run multiple app instances on different machines, they need shared
storage (or a future object-storage adapter). The current implementation assumes
local disk.

## Reverse proxy (Nginx)

Terminate TLS at the proxy and forward to the Node port:

```nginx
server {
    listen 443 ssl http2;
    server_name stcet.in www.stcet.in;

    # ... certificates ...

    client_max_body_size 2m;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_read_timeout 60s;
    }
}
```

Notes:

- `client_max_body_size` must be above 1 MB. `2m` is enough for the 1 MB image
  limit plus overhead. A `413` from Nginx means the proxy limit is too low.
- `X-Forwarded-For` and `X-Real-IP` must be overwritten by the proxy. Rate
  limiting trusts these headers.
- The app already sets HSTS. Only submit the domain to the HSTS preload list
  when every subdomain is HTTPS-ready.
- Redirect HTTP to HTTPS at the proxy.

## Startup checks

On every cold start the app logs:

```text
[startup] upload storage ready at <path>
```

or a clear `NOT writable` error. It also warns when `DATABASE_URL` is missing.

Verify after deploy:

```bash
curl -fsS https://<host>/api/health/database
# {"status":"ok"}
```

`ok` means a `SELECT 1` succeeded, not that migrations are current. Also open a
public page that reads content and the admin login page.

## Post-deploy checklist

1. `npx prisma migrate deploy` reports no pending migrations.
2. `/api/health/database` returns `ok`.
3. `[startup] upload storage ready` appears in the logs.
4. A public page shows current content (not stale/fallback content).
5. Admin sign-in works, and the dashboard loads.
6. Upload a small image; it appears on the public page.
7. Settings -> **Send test email** succeeds; submit a contact form and confirm
   both admin and visitor mail.
8. Request a password reset and confirm the link uses the public HTTPS origin.
9. `/sitemap.xml` and `/robots.txt` use the production origin.
10. Custom head/body code (if any) still loads and does not break the admin.
11. Check the browser console for CSP violations after adding third-party
    scripts or images.

## Caching and multi-instance behavior

- Public pages are dynamic and read the database per request.
- `revalidatePath` runs in the process that handled the admin save. With one
  instance, the change is visible immediately. With multiple instances, other
  instances still read fresh database rows on their next request unless a shared
  cache is introduced.
- Site settings are cached in-process for 60 seconds and invalidated on save.
  Other processes can lag up to 60 seconds.
- Uploaded files are served with a one-year immutable cache; filenames are
  UUIDs, so this is safe. Replacing an image requires a new file/reference.

## Scheduled tasks

Run these from cron/systemd timers as the app user:

```bash
# Daily: remove unreferenced uploads older than 24 hours
npm run media:cleanup

# Nightly: database dump
mysqldump ... > /backups/stcet-$(date +%F).sql

# Nightly/weekly: uploads archive
tar -czf /backups/uploads-$(date +%F).tar.gz "$HOME/uploads"
```

Back up the database and uploads together, and test a restore. A database
restore without files leaves broken images; a files restore without the database
loses references and content.

## Rollback

1. Keep the previous release directory and its `.next` build.
2. Roll back code by pointing the process manager at the previous release and
   restarting.
3. Roll back migrations only with a tested, deliberate down-migration or a
   restore. Prisma migrations are forward-only by default. Never run a reset.
4. If a bad upload was deployed, restore the uploads archive alongside the
   database snapshot from the same point in time.

## Email and DNS

The server must be able to resolve and reach the configured ZeptoMail endpoint
over HTTPS. A `getaddrinfo EAI_AGAIN` in logs means DNS is failing on the host or
network; the form record is still saved but mail is not sent. Test outbound DNS
and HTTPS from the production user before launch, and use Settings -> Send test
email.

## Local development vs production

| Concern | Development | Production |
| --- | --- | --- |
| Database | Local MySQL/MariaDB | Private TLS endpoint, least-privilege user |
| Secrets | `.env` | Secret manager/environment injection |
| Uploads | User home directory | Persistent home directory outside deploy tree |
| Origin | `http://localhost:3000` | HTTPS origin in both URL variables |
| Migrations | `prisma migrate dev` | `prisma migrate deploy` only |
| Secrets rotation | Free to reset | Changing `NEXTAUTH_SECRET` logs everyone out; changing `ZEPTOMAIL_ENCRYPTION_KEY` requires re-entering the token |
