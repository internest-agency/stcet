import type { MetadataRoute } from "next";

import { getSiteUrl } from "@/src/lib/site-url";

/*
 * Rendered per request so the configured origin is read at runtime rather than
 * baked into the build output.
 */
export const dynamic = "force-dynamic";

export default function robots(): MetadataRoute.Robots {
  const base = getSiteUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"],
        other: {
          "Content-Signal": "search=yes, ai-train=no",
        },
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
