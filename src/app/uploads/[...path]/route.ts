import { Readable } from "node:stream";
import { getPrismaClient } from "@/src/lib/prisma";
import { openManagedUpload } from "@/src/lib/admin/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

// A registered media row whose file is missing means the storage directory was
// not deployed/persisted (a much more useful signal than a bare 404). Log it,
// but throttle so a page full of broken images does not flood the logs.
const MISSING_FILE_LOG_INTERVAL_MS = 60_000;
let lastMissingFileLog: { signature: string; loggedAt: number } | null = null;

function reportRegisteredButMissing(reference: string, reason: string) {
  const signature = `${reason}:${reference}`;
  const now = Date.now();
  if (
    lastMissingFileLog?.signature === signature &&
    now - lastMissingFileLog.loggedAt < MISSING_FILE_LOG_INTERVAL_MS
  ) {
    return;
  }
  lastMissingFileLog = { signature, loggedAt: now };
  console.error(
    `[uploads] "${reference}" is registered in the database but ${reason}.`,
  );
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ path: string[] }> },
) {
  const { path } = await context.params;
  if (path.length < 2 || path.length > 3) {
    return new Response(null, { status: 404 });
  }

  const reference = `/uploads/${path.join("/")}`;

  try {
    const asset = await getPrismaClient().mediaAsset.findUnique({
      where: { path: reference },
      select: { contentType: true, size: true },
    });
    if (!asset || !allowedContentTypes.has(asset.contentType)) {
      return new Response(null, { status: 404 });
    }

    const storedFile = await openManagedUpload(reference);
    if (!storedFile) {
      reportRegisteredButMissing(reference, "its file is missing from storage");
      return new Response(null, { status: 404 });
    }
    if (storedFile.size !== asset.size) {
      reportRegisteredButMissing(
        reference,
        "its stored file size does not match the database",
      );
      return new Response(null, { status: 404 });
    }

    const responseStream = Readable.toWeb(
      storedFile.stream,
    ) as unknown as ReadableStream<Uint8Array>;

    return new Response(responseStream, {
      status: 200,
      headers: {
        "Content-Type": asset.contentType,
        "Content-Length": String(asset.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; sandbox",
        "Cross-Origin-Resource-Policy": "same-site",
      },
    });
  } catch {
    return new Response(null, { status: 404 });
  }
}
