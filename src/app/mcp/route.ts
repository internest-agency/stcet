import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/server";
import { createStcetMcpServer } from "@/src/lib/mcp-server";

const MCP_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Accept, Content-Type, MCP-Protocol-Version",
  "Access-Control-Expose-Headers": "MCP-Protocol-Version",
  "Cache-Control": "no-store",
};

function withCorsHeaders(response: Response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(MCP_CORS_HEADERS)) {
    headers.set(name, value);
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

export async function POST(request: Request) {
  const server = createStcetMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
    maxRequestBodySize: 64 * 1024,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(request);

  return withCorsHeaders(response);
}

export function GET() {
  return methodNotAllowed();
}

export function DELETE() {
  return methodNotAllowed();
}

export function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: MCP_CORS_HEADERS,
  });
}

function methodNotAllowed() {
  return new Response("Method Not Allowed", {
    status: 405,
    headers: {
      ...MCP_CORS_HEADERS,
      Allow: "POST, OPTIONS",
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
