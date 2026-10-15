import path from "node:path";
import os from "node:os";
import { rm } from "node:fs/promises";
import { Readable } from "node:stream";
import {
  getUploadRoot,
  openManagedUpload,
  removeManagedUpload,
  storeImageStream,
} from "../src/lib/admin/upload-storage";

const PNG_1x1 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

async function main() {
  const dir = path.join(os.tmpdir(), `stcet-upload-probe-${Date.now()}`);
  process.env.UPLOADS_DIR = dir;
  console.log("UPLOADS_DIR =", dir, "| getUploadRoot() =", getUploadRoot());

  const bytes = Buffer.from(PNG_1x1, "base64");
  const body = Readable.toWeb(Readable.from(bytes)) as ReadableStream<Uint8Array>;

  const stored = await storeImageStream(body, "pages");
  console.log("storeImageStream ->", stored);

  const opened = await openManagedUpload(stored.path);
  console.log("openManagedUpload ->", opened ? { size: opened.size } : null);

  const removed = await removeManagedUpload(stored.path);
  console.log("removeManagedUpload ->", removed);

  await rm(dir, { recursive: true, force: true }).catch(() => undefined);
  console.log("DONE");
}

main().catch((error: unknown) => {
  const e = error as { code?: string; message?: string };
  console.log("PROBE FAILED code=", e.code, "msg=", e.message);
  process.exitCode = 1;
});
