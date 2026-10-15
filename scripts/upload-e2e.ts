/**
 * End-to-end verification of the media upload pipeline against a SCRATCH
 * database and a scratch upload directory. Never touches production data.
 *
 * Run with (see package.json "media:test"):
 *   USERPROFILE=<scratch dir> DATABASE_URL=<scratch url> UPLOAD_MAX_BYTES=2048 \
 *     npx tsx scripts/upload-e2e.ts
 * (On POSIX set HOME instead of USERPROFILE.)
 *
 * Covers: magic-byte content-type detection for the three accepted formats,
 * byte-for-byte persistence, DB registration, serving/open, traversal
 * blocking, rejection of unsupported/oversized/empty payloads, temp-file
 * cleanup, and removal of a registered file.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { getPrismaClient } from "../src/lib/prisma-client";
import { hashAdminPassword } from "../src/lib/admin/password";
import {
  InvalidUploadError,
  UnsupportedImageError,
  UploadTooLargeError,
  getUploadRoot,
  openManagedUpload,
  removeManagedUpload,
  storeImageStream,
} from "../src/lib/admin/upload-storage";

const CATEGORY = "pages" as const;
const ADMIN_EMAIL = "e2e-uploads@example.com";
const UPLOAD_LIMIT = Number(process.env.UPLOAD_MAX_BYTES ?? 5_242_880);

let passed = 0;
const failures: string[] = [];

function check(label: string, ok: boolean, detail?: unknown) {
  if (ok) {
    passed += 1;
    console.log(`  PASS  ${label}`);
    return;
  }
  const suffix = detail === undefined ? "" : ` :: ${String(detail)}`;
  failures.push(`${label}${suffix}`);
  console.log(`  FAIL  ${label}${suffix}`);
}

function bodyOf(buffer: Buffer): ReadableStream<Uint8Array> {
  return new Response(new Uint8Array(buffer))
    .body as ReadableStream<Uint8Array>;
}

const PNG_SAMPLE = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64",
);

const JPEG_SAMPLE = Buffer.concat([
  Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10]),
  Buffer.from("JFIF\0", "ascii"),
  Buffer.alloc(64, 0x22),
  Buffer.from([0xff, 0xd9]),
]);

const WEBP_SAMPLE = Buffer.concat([
  Buffer.from("RIFF", "ascii"),
  Buffer.from([0x30, 0x00, 0x00, 0x00]),
  Buffer.from("WEBPVP8 ", "ascii"),
  Buffer.alloc(32, 0x33),
]);

const SAMPLES = [
  { label: "PNG", buffer: PNG_SAMPLE, mime: "image/png", ext: "png" },
  { label: "JPEG", buffer: JPEG_SAMPLE, mime: "image/jpeg", ext: "jpg" },
  { label: "WebP", buffer: WEBP_SAMPLE, mime: "image/webp", ext: "webp" },
];

function listPages(root: string): string[] {
  const dir = path.join(root, CATEGORY);
  if (!existsSync(dir)) return [];
  return readdirSync(dir);
}

async function capture(fn: () => Promise<unknown>) {
  try {
    await fn();
    return null;
  } catch (error) {
    return error;
  }
}

async function main() {
  const root = getUploadRoot();
  // getUploadRoot() deliberately ignores environment variables and uses
  // os.homedir()/uploads so that production uploads survive Hostinger's
  // versioned deploy directories. Point HOME (POSIX) or USERPROFILE (Windows)
  // at a scratch directory to keep this test out of the real home folder.
  if (!root.startsWith(os.tmpdir()) && process.env.UPLOADS_E2E_ALLOW_HOME !== "1") {
    throw new Error(
      `Refusing to run: upload root "${root}" is outside the system temp ` +
        "directory. Set USERPROFILE (Windows) or HOME (POSIX) to a scratch " +
        "directory, or set UPLOADS_E2E_ALLOW_HOME=1.",
    );
  }

  console.log(`upload root : ${root}`);
  console.log(`upload limit: ${UPLOAD_LIMIT} bytes`);

  const prisma = getPrismaClient();

  const admin = await prisma.adminUser.upsert({
    where: { email: ADMIN_EMAIL },
    update: { isActive: true },
    create: {
      name: "E2E Upload Tester",
      email: ADMIN_EMAIL,
      passwordHash: await hashAdminPassword("E2e!UploadTest123"),
      role: "SUPER_ADMIN",
    },
  });
  check("scratch database reachable and admin seeded", admin.id > 0, admin.id);

  // The fixtures themselves must carry the magic bytes being asserted.
  check(
    "PNG fixture has PNG signature",
    PNG_SAMPLE.subarray(0, 8).toString("hex") === "89504e470d0a1a0a",
  );
  check(
    "JPEG fixture has JPEG signature",
    JPEG_SAMPLE.subarray(0, 3).toString("hex") === "ffd8ff",
  );
  check(
    "WebP fixture has RIFF/WEBP signatures",
    WEBP_SAMPLE.subarray(0, 4).toString("ascii") === "RIFF" &&
      WEBP_SAMPLE.subarray(8, 12).toString("ascii") === "WEBP",
  );

  for (const sample of SAMPLES) {
    const uploaded = await storeImageStream(bodyOf(sample.buffer), CATEGORY);
    check(
      `${sample.label}: content type detected`,
      uploaded.contentType === sample.mime,
      uploaded.contentType,
    );
    check(
      `${sample.label}: extension matches type`,
      uploaded.path.endsWith(`.${sample.ext}`),
      uploaded.path,
    );
    check(`${sample.label}: size preserved`, uploaded.size === sample.buffer.length, uploaded.size);

    const onDisk = path.join(root, CATEGORY, path.basename(uploaded.path));
    check(`${sample.label}: file written to disk`, existsSync(onDisk), onDisk);
    check(
      `${sample.label}: bytes identical on disk`,
      existsSync(onDisk) && readFileSync(onDisk).equals(sample.buffer),
    );

    const opened = await openManagedUpload(uploaded.path);
    check(
      `${sample.label}: serving layer opens file`,
      opened !== null && opened.size === sample.buffer.length,
      JSON.stringify(opened ? { size: opened.size } : null),
    );
    opened?.stream.destroy();

    const row = await prisma.mediaAsset.create({
      data: {
        path: uploaded.path,
        contentType: uploaded.contentType,
        size: uploaded.size,
        uploadedById: admin.id,
      },
    });
    check(`${sample.label}: mediaasset row saved in MySQL`, row.path === uploaded.path, row.path);

    const removed = await removeManagedUpload(uploaded.path);
    check(`${sample.label}: registered file removable`, removed === true);
    check(`${sample.label}: file gone after removal`, !(await openManagedUpload(uploaded.path)));
    await prisma.mediaAsset.delete({ where: { id: row.id } });
  }

  const cleanBaseline = listPages(root);
  check(
    "no temp files left after happy path",
    cleanBaseline.filter((f) => f.startsWith(".upload-")).length === 0,
    cleanBaseline.join(","),
  );
  check("no orphan files left after happy path", cleanBaseline.length === 0, cleanBaseline.join(","));

  let error: unknown;
  error = await capture(() => storeImageStream(bodyOf(Buffer.from("plain text, not an image")), CATEGORY));
  check(
    "non-image payload rejected as UnsupportedImageError",
    error instanceof UnsupportedImageError,
    error?.constructor?.name,
  );

  error = await capture(() =>
    storeImageStream(
      bodyOf(Buffer.concat([PNG_SAMPLE, Buffer.alloc(UPLOAD_LIMIT + 512, 0x41)])),
      CATEGORY,
    ),
  );
  check(
    "oversized payload rejected as UploadTooLargeError",
    error instanceof UploadTooLargeError,
    error?.constructor?.name,
  );

  error = await capture(() => storeImageStream(bodyOf(Buffer.alloc(0)), CATEGORY));
  check(
    "empty payload rejected as InvalidUploadError",
    error instanceof InvalidUploadError,
    error?.constructor?.name,
  );

  const afterRejections = listPages(root);
  check(
    "rejections leave no temp files",
    afterRejections.filter((f) => f.startsWith(".upload-")).length === 0,
    afterRejections.join(","),
  );
  check(
    "rejections persist no images",
    afterRejections.length === cleanBaseline.length,
    afterRejections.join(","),
  );

  check(
    "relative traversal blocked",
    (await openManagedUpload("/uploads/pages/../../../Windows/win.ini")) === null,
  );
  check(
    "absolute path blocked",
    (await openManagedUpload("C:\\Windows\\win.ini")) === null,
  );
  check("wrong category blocked", (await openManagedUpload("/gallery/x.png")) === null);
  check("malformed reference blocked", (await openManagedUpload("x.png")) === null);

  await prisma.mediaAsset.deleteMany({ where: { uploadedById: admin.id } });
  await prisma.adminUser.delete({ where: { id: admin.id } });
  check("scratch database rows cleaned up", true);

  console.log(`\nRESULT: ${passed} passed, ${failures.length} failed`);
  for (const failure of failures) console.log(`  FAILED: ${failure}`);

  // The driver pool holds open handles, so exit explicitly once done.
  await prisma.$disconnect().catch(() => undefined);
  process.exit(failures.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error("upload-e2e fatal:", error);
  process.exit(1);
});
