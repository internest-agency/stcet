export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === "phase-production-build") return;

  if (!process.env.DATABASE_URL) {
    console.error(
      "[startup] DATABASE_URL is not set; database-backed features will fail.",
    );
  }

  const { checkStorageReadiness } = await import("./lib/admin/upload-storage");
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
    }. Verify the process user has write access to that path.`,
  );
}
