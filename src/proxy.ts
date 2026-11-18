import { NextResponse, type NextRequest } from "next/server";
import { homepageMarkdown } from "./lib/homepage-markdown";

function acceptsMarkdown(accept: string | null) {
  return (
    accept?.split(",").some((mediaRange) => {
      const [mediaType, ...parameters] = mediaRange.split(";");
      if (mediaType.trim().toLowerCase() !== "text/markdown") return false;

      const quality = parameters
        .map((parameter) => parameter.trim().toLowerCase())
        .find((parameter) => parameter.startsWith("q="));

      return quality === undefined || Number(quality.slice(2)) > 0;
    }) ?? false
  );
}

export function proxy(request: NextRequest) {
  if (acceptsMarkdown(request.headers.get("accept"))) {
    return new Response(homepageMarkdown, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
        "Cache-Control": "no-store",
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
