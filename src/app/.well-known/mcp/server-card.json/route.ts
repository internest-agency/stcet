import { createHash } from "node:crypto";
import {
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  SUPPORTED_PROTOCOL_VERSIONS,
} from "@/src/lib/mcp-config";

const serverCard = {
  $schema:
    "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  name: MCP_SERVER_NAME,
  version: MCP_SERVER_VERSION,
  title: "STCET Public Information",
  description:
    "Read public information about STCET and its engineering programmes.",
  websiteUrl: "https://stcet.in",
  remotes: [
    {
      type: "streamable-http",
      url: "https://stcet.in/mcp",
      supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS],
    },
  ],
};

const body = JSON.stringify(serverCard);
const etag = `"${createHash("sha256").update(body).digest("hex")}"`;
const headers = {
  "Content-Type": "application/mcp-server-card+json",
  "Cache-Control": "public, max-age=3600",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, If-None-Match",
  "Access-Control-Expose-Headers": "ETag",
  ETag: etag,
};

function isNotModified(request: Request) {
  return request.headers
    .get("if-none-match")
    ?.split(",")
    .some((value) => value.trim() === etag || value.trim() === "*");
}

export function GET(request: Request) {
  if (isNotModified(request)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(body, { headers });
}

export function HEAD(request: Request) {
  if (isNotModified(request)) {
    return new Response(null, { status: 304, headers });
  }

  return new Response(null, { headers });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers });
}
