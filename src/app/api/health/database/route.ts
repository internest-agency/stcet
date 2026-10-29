import { getPrismaClient, isDatabaseConfigured } from "@/src/lib/prisma";
import { rateLimit, getClientIp } from "@/src/lib/rate-limit";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const clientIp = getClientIp(request);
  const rateLimitResult = rateLimit(`health:${clientIp}`, {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 requests per minute
  });

  if (!rateLimitResult.success) {
    return Response.json(
      { status: "unavailable" },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": Math.ceil(
            (rateLimitResult.resetTime - Date.now()) / 1000
          ).toString(),
        },
      },
    );
  }

  if (!isDatabaseConfigured()) {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    await getPrismaClient().$queryRaw`SELECT 1`;

    return Response.json(
      { status: "ok" },
      { status: 200, headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return Response.json(
      { status: "unavailable" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
