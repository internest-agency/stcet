/**
 * Storage probe — exercises the upload/open/remove cycle against a temporary
 * directory so the real uploads folder is not touched.
 *
 * Usage: npm run storage:probe
 */
import os from "node:os";
import path from "node:path";
import { rm } from "node:fs/promises";
import { Readable } from "node:stream";

const PNG_1x1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

// Point the storage module at a throw-away temp directory for the probe so
// the developer's real ~/uploads folder is not used.
const probeDir = path.join(os.tmpdir(), `stcet-upload-probe-${Date.now()}`);

// Monkey-patch the module's getUploadRoot before importing so every function
// that calls it (storeImageStream, openManagedUpload, removeManagedUpload)
// uses the temp directory.  We import the module object so we can replace the
// export on the same reference the other functions close over.
import * as storageModule from "../src/lib/admin/upload-storage";

// @ts-expect-error — intentional override for probe isolation
storageModule.getUploadRoot = () => probeDir;

const { storeImageStream, openManagedUpload, removeManagedUpload } =
  storageModule;

console.log("probe dir =", probeDir);

async function main() {
  const bytes = Buffer.from(PNG_1x1, "base64");
  const body = Readable.toWeb(
    Readable.from(bytes),
  ) as ReadableStream<Uint8Array>;

  const stored = await storeImageStream(body, "pages");
  console.log("storeImageStream ->", stored);

  const opened = await openManagedUpload(stored.path);
  console.log("openManagedUpload ->", opened ? { size: opened.size } : null);

  const removed = await removeManagedUpload(stored.path);
  console.log("removeManagedUpload ->", removed);

  await rm(probeDir, { recursive: true, force: true }).catch(() => undefined);
  console.log("DONE");
}

main().catch((error: unknown) => {
  const e = error as { code?: string; message?: string };
  console.log("PROBE FAILED code=", e.code, "msg=", e.message);
  process.exitCode = 1;
});
