import { getCurrentAdmin } from "@/src/lib/admin/authorization";
import {
  getUploadLimit,
  parseUploadCategory,
  removeUnregisteredUpload,
  storeImageStream,
  UnsupportedImageError,
  UploadTooLargeError,
} from "@/src/lib/admin/uploads";
import { getPrismaClient } from "@/src/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Surface the real filesystem/prisma cause in logs (EACCES, EROFS, ENOSPC,
// ECONNRESET, ...) without leaking it to the client. Never includes file
// contents or credentials.
function describeError(error: unknown) {
  if (error instanceof Error) {
    const details: Record<string, unknown> = {
      name: error.name,
      message: error.message,
    };
    const code = (error as NodeJS.ErrnoException).code;
    if (code) details.code = code;
    const syscall = (error as NodeJS.ErrnoException).syscall;
    if (syscall) details.syscall = syscall;
    if (error.cause instanceof Error) {
      const causeCode = (error.cause as NodeJS.ErrnoException).code;
      details.cause = causeCode
        ? `${error.cause.name} ${causeCode}: ${error.cause.message}`
        : `${error.cause.name}: ${error.cause.message}`;
    }
    return details;
  }
  return { message: typeof error === "string" ? error : "Unknown error" };
}

function isSameOrigin(request: Request) {
  const originHeader = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol =
    request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ??
    new URL(request.url).protocol.slice(0, -1);

  if (!originHeader || !host) return false;

  try {
    const origin = new URL(originHeader);
    return (
      origin.host.toLowerCase() === host.toLowerCase() &&
      origin.protocol === `${protocol}:`
    );
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) {
    return Response.json(
      { error: "Request origin not allowed." },
      { status: 403 },
    );
  }

  const admin = await getCurrentAdmin();
  if (!admin) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 },
    );
  }

  const category = parseUploadCategory(
    new URL(request.url).searchParams.get("category"),
  );
  if (!category || !request.body) {
    return Response.json({ error: "Invalid upload request." }, { status: 400 });
  }

  const lengthHeader = request.headers.get("content-length");
  if (lengthHeader !== null) {
    const length = Number(lengthHeader);
    if (!Number.isSafeInteger(length) || length < 0) {
      return Response.json(
        { error: "Invalid content length." },
        { status: 400 },
      );
    }
    if (length > getUploadLimit()) {
      return Response.json(
        { error: "Image exceeds the upload size limit." },
        { status: 413 },
      );
    }
  }

  let uploaded: Awaited<ReturnType<typeof storeImageStream>>;
  try {
    uploaded = await storeImageStream(request.body, category);
  } catch (error) {
    if (error instanceof UploadTooLargeError) {
      return Response.json(
        { error: "Image exceeds the upload size limit." },
        { status: 413 },
      );
    }
    if (error instanceof UnsupportedImageError) {
      return Response.json(
        { error: "Only JPEG, PNG, and WebP images are supported." },
        { status: 415 },
      );
    }
    console.error(
      "[media-upload] image could not be stored",
      describeError(error),
    );
    return Response.json({ error: "Image upload failed." }, { status: 500 });
  }

  try {
    await getPrismaClient().mediaAsset.create({
      data: {
        path: uploaded.path,
        contentType: uploaded.contentType,
        size: uploaded.size,
        uploadedById: admin.id,
      },
    });
  } catch (error) {
    console.error(
      "[media-upload] stored image could not be registered",
      describeError(error),
    );
    await removeUnregisteredUpload(uploaded.path);
    return Response.json(
      { error: "Image could not be registered." },
      { status: 503 },
    );
  }

  return Response.json(uploaded, {
    status: 201,
    headers: { "Cache-Control": "no-store" },
  });
}
