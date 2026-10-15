export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  if (!process.env.DATABASE_URL) {
    console.error(
      "[startup] DATABASE_URL is not set; database-backed features will fail.",
    );
  }

  const { checkStorageReadiness, isUploadDirAbsolute } = await import(
    "./lib/admin/upload-storage"
  );

  // Warn immediately if UPLOADS_DIR is missing or relative — before we even
  // try the filesystem so the operator sees a targeted message, not just EACCES.
  const uploadsDir = process.env.UPLOADS_DIR;
  if (!uploadsDir) {
    console.warn(
      "[startup] UPLOADS_DIR is not set. " +
        "Uploads will fall back to <cwd>/uploads, which is the read-only deploy " +
        "directory on Hostinger. Set UPLOADS_DIR to an absolute path such as " +
        "/home/<user>/uploads in hPanel > Node.js > Environment Variables.",
    );
  } else if (!isUploadDirAbsolute()) {
    console.error(
      `[startup] UPLOADS_DIR is set to a relative path ("${uploadsDir}"). ` +
        `This resolves inside the read-only deploy directory on managed hosts ` +
        `and will cause EACCES on every upload. ` +
        `Change it to an absolute path such as /home/<user>/uploads in hPanel.`,
    );
  }

  const storage = await checkStorageReadiness();

  if (storage.ok) {
    console.log(`[startup] upload storage ready at ${storage.root}`);
    return;
  }

  const code =
    storage.error instanceof Error
      ? (storage.error as NodeJS.ErrnoException).code
      : undefined;
  console.error(
    `[startup] upload storage is NOT writable at ${storage.root}${
      code ? ` (${code})` : ""
    }. Set UPLOADS_DIR to a writable, persistent absolute path outside the deploy folder.`,
  );
}
