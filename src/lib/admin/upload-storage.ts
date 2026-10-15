import { randomUUID } from "node:crypto";
import { constants, createWriteStream, createReadStream } from "node:fs";
import {
  access,
  chmod,
  lstat,
  mkdir,
  realpath,
  rename,
  rm,
  stat,
  unlink,
} from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  Readable,
  Transform,
  type Readable as NodeReadable,
} from "node:stream";
import { pipeline } from "node:stream/promises";

export const UPLOAD_CATEGORIES = [
  "courses/heroes",
  "courses/modules",
  "courses/careers",
  "gallery",
  "admissions",
  "placements",
  "infrastructure",
  "committees",
  "pages",
  "faculty",
] as const;

export type UploadCategory = (typeof UPLOAD_CATEGORIES)[number];

const MIME_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

// Magic-byte signatures for the only three formats the app accepts. Detection
// runs in-process on the first bytes of the incoming stream instead of using
// the `file-type` package: that package dynamically imports `strtok3`, which
// Next.js bundles into .next/server/chunks where the dynamic import cannot be
// resolved at runtime on some hosts (ERR_MODULE_NOT_FOUND "Cannot find package
// 'strtok3'"), which broke every image upload in production.
const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const RIFF_SIGNATURE = Buffer.from("RIFF", "ascii");
const WEBP_SIGNATURE = Buffer.from("WEBP", "ascii");
const SIGNATURE_BYTES = 12;

function sniffImageMime(header: Buffer): string | null {
  if (header.length >= 8 && header.subarray(0, 8).equals(PNG_SIGNATURE)) {
    return "image/png";
  }
  if (header.length >= 3 && header.subarray(0, 3).equals(JPEG_SIGNATURE)) {
    return "image/jpeg";
  }
  if (
    header.length >= 12 &&
    header.subarray(0, 4).equals(RIFF_SIGNATURE) &&
    header.subarray(8, 12).equals(WEBP_SIGNATURE)
  ) {
    return "image/webp";
  }
  return null;
}

const UUID_FILENAME =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png|webp)$/;

export class UploadTooLargeError extends Error {}
export class UnsupportedImageError extends Error {}
export class InvalidUploadError extends Error {}

// Thrown when the upload directory cannot be created or written to.
// Kept separate from the validation errors so the API can log the real
// filesystem cause instead of a generic "upload failed".
export class UploadStorageError extends Error {}

export function getUploadLimit() {
  const configured = Number(process.env.UPLOAD_MAX_BYTES ?? 5 * 1024 * 1024);
  return Number.isSafeInteger(configured) && configured > 0
    ? configured
    : 5 * 1024 * 1024;
}

/**
 * Returns the absolute path of the upload root directory.
 *
 * Uses os.homedir() as the writable base so that:
 * - The path is always absolute (no accidental resolution against process.cwd()).
 * - On Hostinger the running user's home directory (/home/<user>) is writable
 *   and persists across redeployments because it is outside the deploy tree.
 * - Locally the developer's home directory is always writable.
 *
 * No environment variable is read. The directory is created on first use by
 * ensureUploadRoot().
 */
export function getUploadRoot() {
  return path.join(
    /*turbopackIgnore: true*/
    os.homedir(),
    "uploads",
  );
}

/**
 * Creates the upload root if needed and verifies it is writable. Returns the
 * resolved absolute path, or throws an UploadStorageError that names the
 * directory and preserves the underlying filesystem error.
 */
export async function ensureUploadRoot() {
  const root = getUploadRoot();
  try {
    await mkdir(root, { recursive: true, mode: 0o750 });
    await access(root, constants.W_OK);
  } catch (error) {
    throw new UploadStorageError(
      `Upload directory "${root}" is not writable. ` +
        `Verify that the process user owns or has write permission on that path.`,
      { cause: error },
    );
  }
  return root;
}

/**
 * Non-throwing readiness probe used by startup diagnostics. Never throws so it
 * is safe to call during instrumentation.
 */
export async function checkStorageReadiness() {
  const root = getUploadRoot();
  try {
    await mkdir(root, { recursive: true, mode: 0o750 });
    await access(root, constants.W_OK);
    return { ok: true as const, root };
  } catch (error) {
    return { ok: false as const, root, error };
  }
}

export function parseUploadCategory(
  value: string | null,
): UploadCategory | null {
  return UPLOAD_CATEGORIES.find((category) => category === value) ?? null;
}

function parseManagedPath(reference: string) {
  if (!reference.startsWith("/uploads/")) return null;
  const relative = reference.slice("/uploads/".length);
  const category = UPLOAD_CATEGORIES.find((item) =>
    relative.startsWith(`${item}/`),
  );
  if (!category) return null;

  const fileName = relative.slice(category.length + 1);
  if (!UUID_FILENAME.test(fileName)) return null;

  return { category, fileName };
}

export function isManagedUploadPath(reference: string) {
  return parseManagedPath(reference) !== null;
}

function pathWithinRoot(root: string, target: string) {
  const relativePath = path.relative(root, target);
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

function absoluteUploadPath(reference: string) {
  const parsed = parseManagedPath(reference);
  if (!parsed) return null;

  const root = getUploadRoot();
  const target = path.resolve(root, parsed.category, parsed.fileName);
  return pathWithinRoot(root, target) ? target : null;
}

export async function storeImageStream(
  body: ReadableStream<Uint8Array>,
  category: UploadCategory,
) {
  const root = getUploadRoot();
  const directory = path.resolve(root, category);
  if (!pathWithinRoot(root, directory)) throw new InvalidUploadError();
  await ensureUploadRoot();
  try {
    await mkdir(directory, { recursive: true, mode: 0o750 });
  } catch (error) {
    throw new UploadStorageError(
      `Upload directory "${directory}" is not writable. ` +
        `Verify that the process user owns or has write permission on that path.`,
      { cause: error },
    );
  }

  const temporaryPath = path.join(directory, `.upload-${randomUUID()}.tmp`);
  let size = 0;
  const limit = getUploadLimit();
  const header = Buffer.alloc(SIGNATURE_BYTES);
  let headerLength = 0;
  const limiter = new Transform({
    transform(chunk: Buffer, _encoding, callback) {
      size += chunk.length;
      if (size > limit) {
        callback(new UploadTooLargeError());
        return;
      }
      if (headerLength < SIGNATURE_BYTES) {
        const take = Math.min(SIGNATURE_BYTES - headerLength, chunk.length);
        chunk.copy(header, headerLength, 0, take);
        headerLength += take;
      }
      callback(null, chunk);
    },
  });

  try {
    await pipeline(
      Readable.fromWeb(body as import("node:stream/web").ReadableStream),
      limiter,
      createWriteStream(temporaryPath, { flags: "wx", mode: 0o600 }),
    );

    if (size === 0) throw new InvalidUploadError();

    const detectedMime = sniffImageMime(header.subarray(0, headerLength));
    const extension = detectedMime ? MIME_EXTENSIONS[detectedMime] : undefined;
    if (!detectedMime || !extension) throw new UnsupportedImageError();

    const fileName = `${randomUUID()}.${extension}`;
    const finalPath = path.join(
      /*turbopackIgnore: true*/
      directory,
      fileName,
    );
    await rename(temporaryPath, finalPath);
    await chmod(finalPath, 0o640);

    return {
      path: `/uploads/${category}/${fileName}`,
      contentType: detectedMime,
      size,
    };
  } catch (error) {
    await rm(temporaryPath, { force: true }).catch(() => undefined);
    throw error;
  }
}

export async function openManagedUpload(reference: string) {
  const target = absoluteUploadPath(reference);
  if (!target) return null;

  try {
    const rootRealPath = await realpath(
      /*turbopackIgnore: true*/
      getUploadRoot(),
    );
    const entry = await lstat(target);
    if (!entry.isFile() || entry.isSymbolicLink()) return null;

    const fileRealPath = await realpath(
      /*turbopackIgnore: true*/
      target,
    );
    if (!pathWithinRoot(rootRealPath, fileRealPath)) return null;

    const fileStats = await stat(fileRealPath);
    if (!fileStats.isFile() || fileStats.size > getUploadLimit()) return null;

    return {
      stream: createReadStream(fileRealPath) as NodeReadable,
      size: fileStats.size,
      modifiedAt: fileStats.mtime,
    };
  } catch {
    return null;
  }
}

export async function removeManagedUpload(reference: string) {
  const target = absoluteUploadPath(reference);
  if (!target) return false;

  try {
    const rootRealPath = await realpath(
      /*turbopackIgnore: true*/
      getUploadRoot(),
    );
    const entry = await lstat(target);
    if (!entry.isFile() || entry.isSymbolicLink()) return false;

    const fileRealPath = await realpath(
      /*turbopackIgnore: true*/
      target,
    );
    if (!pathWithinRoot(rootRealPath, fileRealPath)) return false;
    await unlink(fileRealPath);
    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return true;
    }
    throw error;
  }
}
