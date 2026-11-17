# Database and Prisma

## How Prisma is wired

- **Schema:** `prisma/schema.prisma`
- **Generator:** `prisma-client` with output `../src/generated/prisma` (the new
  generated-client layout, not the legacy `@prisma/client` singleton)
- **Datasource:** `mysql` (MySQL 8-compatible or MariaDB)
- **Runtime adapter:** `@prisma/adapter-mariadb`
- **Config file:** `prisma.config.ts` loads `dotenv/config`, points at the
  schema and migrations, and uses `tsx prisma/seed.ts` for seeding

The client factory is `src/lib/prisma-client.ts`:

```ts
import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
```

`src/lib/prisma.ts` is the server-only re-export used by app code.
`src/lib/prisma-client.ts` deliberately has no `server-only` import so scripts
(`db:connectivity`, seed, bootstrap) can use the same initialization.

### Pool configuration

The adapter is built from the pieces of `DATABASE_URL`, with these options:

| Env var | Default | Meaning |
| --- | --- | --- |
| `DATABASE_CONNECTION_LIMIT` | `5` | Maximum pool size. |
| `DATABASE_MIN_IDLE` | `1` | Minimum idle connections. Clamped to at least 1; `0` is a known driver bug. |
| `DATABASE_CONNECT_TIMEOUT_MS` | `5000` | Connect/acquire/query timeout. |
| `DATABASE_IDLE_TIMEOUT_MS` | `60000` | Converted to seconds for the driver. Keep below the server's `wait_timeout`. |
| `DATABASE_PING_TIMEOUT_MS` | `1000` | Keepalive ping. |

Driver errors are logged with their real cause (access denied, unknown
database, unreachable host) instead of only "pool timeout", throttled to one
line per signature every 5 seconds.

### Schema revision cache

`prismaSchemaRevision` in `src/lib/prisma-client.ts` is stored next to the
cached client on `globalThis`. If it changes, the factory discards the cached
client and constructs a new one. **Bump it whenever a migration adds or renames
a field/model that code reads**, otherwise a long-running process can keep a
client that does not know about the new column.

The stale client is most visible in development: after `prisma generate`, a
running `next dev` process can keep the previously compiled generated client and
throw `PrismaClientValidationError` for a new field. Restart the dev server
after generating.

## Schema overview

Models are grouped below by feature. All tables use explicit `@@map` names, and
several legacy table names differ in casing, so always check `@@map` before
writing raw SQL.

### Admin and security

| Model -> table | Purpose |
| --- | --- |
| `AdminUser` -> `adminuser` | Name, unique email, scrypt `passwordHash`, role, `isActive`, `sessionVersion`. |
| `AdminLoginAttempt` -> `adminloginattempt` | Per-email-hash attempt counter, window start, and `blockedUntil` for both login and reset throttling. |
| `AdminAuditLog` -> `adminauditlog` | Actor, action, entity type/id, JSON details. Actor is `SetNull` on delete. |
| `PasswordResetToken` -> `passwordresettoken` | Random token stored as a SHA-256 hash, `expiresAt`, `usedAt`. Cascades with the user. |

Enums: `AdminRole { SUPER_ADMIN, CONTENT_EDITOR }`.

### Courses

`Course` -> `course` is the root. Children cascade on delete:

- `CourseModule` (`coursemodule`) - numbered curriculum slides with image
- `CourseOpportunity` (`courseopportunity`)
- `CourseReason` (`coursereason`)
- `CareerPathway` (`careerpathway`) -> `CareerRole` (`careerrole`)
- `FuturePath` (`futurepath`)
- `AdmissionRoute` (`admissionroute`) can optionally point at a `Course`
  (`SetNull` on delete)
- `TrainingProgramme` and `IndustryInteraction` also optionally point at a
  course, but the placement admin no longer edits them

Most child tables have `@@unique([courseId, number])` plus an indexed
`sortOrder`.

### Media and gallery

| Model -> table | Purpose |
| --- | --- |
| `MediaAsset` -> `mediaasset` | Registry for every stored upload: unique path, content type, size, optional title/alt, uploader. The `/uploads/...` route only serves registered paths. |
| `GalleryCategory` -> `gallerycategory` | Unique name/slug, sort order, active flag. |
| `GalleryImage` -> `galleryimage` | Unique image path, category, publish flag, **`showOnHome`**, **`showOnGalleryPage`**, sort order. |

Gallery placement semantics:

- `isPublished = true` is required for any public display.
- `showOnHome` controls the home page strip.
- `showOnGalleryPage` controls `/gallery`.
- Both may be true. Both may be false (the image exists but is not displayed).
- The migration `20261116182409_add_show_on_gallery_page_to_gallery_image`
  backfills existing rows with `showOnGalleryPage = NOT showOnHome`, preserving
  the old split.

### Admissions

`AdmissionsIntro`, `AdmissionRoute`, `TNEACounselling`, `ManagementQuotaInfo`,
`AdmissionDocuments`, `ImportantNotices`, `ApplicationLink`, `AdmissionContact`.
Each has `isPublished` except the intro, which is a singleton-style row, and a
`sortOrder` where ordering matters. `TNEACounselling.instructions` is JSON.

### Placements

- `PlacementCompany` -> `placementcompany` - unique slug, website, logo,
  `isActive`, `isPublished`, order.
- `PlacementLeadership` -> `PlacementLeadership` - singleton-style intro and
  officer block.
- `PlacementLeadershipItem` -> `PlacementLeadershipItem` - ordered supporting
  items, cascades with the leadership row.

### Infrastructure, committees, pages

| Model -> table | Purpose |
| --- | --- |
| `InfrastructureFacility` -> `infrastructurefacility` | Category, optional `sectionId`, optional `layout`, image, publish/active flags. |
| `Committee` -> `committee` | Unique slug, page title, intro, hero, publish flag. |
| `CommitteeMember` -> `committeemember` | Denormalized `committeeSlug`/`committeeName`, role, order. |
| `InstitutionalPage` -> `institutionalpage` | Custom page with unique slug and publication flag. |
| `PageSection` -> `pagesection` | Ordered sections belonging to an institutional page, cascade delete. |
| `GeneralPage` -> `generalpage` | Generic page model with intro/content/CTA and SEO fields (available for future use). |
| `MenuItem` -> `menuitem` | Self-referencing navigation tree: parent, title, URL, type, order, new-tab flag, active/published. Cascade on parent delete. |
| `PageSeo` -> `pageseo` | One row per `pagePath`: SEO title, description, canonical, OG image, no-index. |

### Site settings and email

`SiteSettings` -> `sitesettings` is a single-row configuration table:

- Identity: `collegeName`, `logoPath`, `faviconPath`
- Contact: `contactEmail`, `phoneNumber`, `alternativePhone`, `address`
- Footer/social: `socialLinks` (JSON), `footerLinks` (JSON), `footerText`
- Defaults: `defaultSeoTitle`, `defaultMetaDescription`, `googleMapsEmbedUrl`
- Custom code: `customHeadCode`, `customBodyEndCode`
- ZeptoMail: `zeptoEnabled`, `zeptoApiEndpoint`, `zeptoTokenEncrypted`,
  `zeptoTokenSalt`, `zeptoSenderEmail`, `zeptoSenderName`, `zeptoAdminEmail`,
  `zeptoNotifyContact`, `zeptoNotifyEnquiry`, `zeptoLastTestAt`,
  `zeptoLastTestResult`

### Faculty

- `Faculty` -> `faculty` - name, designation, department, free-text `group` plus
  relational `groupId`, AU/AICTE identifiers, qualification, specialization,
  experience, contact, photo, bio, order, publish flag.
- `FacultyGroup` -> `FacultyGroup` (capitalized table name) - unique name/slug,
  order. Faculty `groupId` is `SetNull` on delete.

### Submissions

- `Enquiry` -> `enquiry` - unique `enquiryNumber`, large flattened admissions
  form (student, parent, school marks, preferences), `clientIp`, `status`,
  `adminNotes`, timestamps.
- `ContactMessage` -> `contactmessage` - name/email/phone/subject/message,
  `clientIp`, `status`, `adminNotes`, timestamps.

### Events

`Event` -> `event` - unique slug, title, short/full description, category, image,
wall-clock `startDate`/`startTime`/`endDate`/`endTime`, `isAllDay`, venue and
location details, registration/website URLs, `isPublished`, `isFeatured`,
`sortOrder`.

Dates are strings: `YYYY-MM-DD`, times are `HH:mm`. They intentionally store the
Asia/Kolkata wall clock, not a UTC instant. ISO date strings sort
chronologically, so `ORDER BY startDate` is correct. See
[content-modules.md](./content-modules.md#events).

### About

Singleton-style content plus ordered children:

- `AboutFounder`, `AboutChairmanMessage`, `AboutVisionMission`, `AboutTrust`
- `AboutMissionItem`, `AboutTrustPillar`
- `GoverningCouncilMember` -> `GoverningCouncilMember`

Table names for about models are capitalized (`AboutFounder`, etc.); quote them
in raw SQL on case-sensitive filesystems.

## Migration workflow

Commit every migration under `prisma/migrations/`. The project has 33
migrations as of November 2026, from `20261009090347_init` onward.

Development:

```bash
npm run prisma:validate
npm run prisma:migrate -- --name add_the_field
npm run prisma:generate        # usually part of dev/build, but explicit is fine
```

Production / any database with real data:

```bash
npx prisma migrate deploy
```

Rules:

- Never `prisma migrate reset` or `db push` against a database containing real
  content unless you have a verified backup and a deliberate reason.
- For an existing database with app tables but no migration history, baseline it
  (mark the matching migration as applied) instead of letting Prisma reset it.
- Review generated SQL. MySQL DDL is not transactional in all cases.
- After an additive migration that the code reads, bump
  `prismaSchemaRevision`.
- Restart long-running processes after `prisma generate`.

## Seeding

`prisma/seed.ts` seeds the five courses whose routes are backed by bundled
content: Computer Science, ECE, EEE, IT, and CS (AI & ML). It is idempotent and
does not overwrite existing records or change publication state.

```bash
npm run prisma:seed
```

## Bootstrap the first admin

```bash
npm run admin:bootstrap
```

- Interactive terminal only (hidden password input).
- Minimum password length 12.
- Refuses to run if a `SUPER_ADMIN` already exists.
- Creates no default credentials.

## Inspecting and diagnosing

```bash
npm run prisma:studio   # browse tables
npm run db:connectivity # exercise the real adapter + pool
```

`db:connectivity` distinguishes a bad URL, an unreachable host, bad credentials,
and a missing database, which the generic Prisma error often hides.

## Backups

Back up **both** the database and the upload directory
(`<os.homedir()>/uploads`). A database restore without the files leaves
`MediaAsset` rows pointing at missing images; a files restore without the
database leaves orphan files and lost content.

Test a restore on a staging database before relying on the backup. Do not
restore production over staging or vice versa with the same upload path.
