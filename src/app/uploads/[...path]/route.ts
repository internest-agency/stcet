import { Readable } from "node:stream";
import { getPrismaClient } from "@/src/lib/prisma";
import { openManagedUpload } from "@/src/lib/admin/uploads";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const allowedContentTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

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
    if (!storedFile || storedFile.size !== asset.size) {
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
