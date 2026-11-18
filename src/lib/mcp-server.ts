import { McpServer } from "@modelcontextprotocol/server";
import * as z from "zod/v4";
import { homepageMarkdown } from "./homepage-markdown";
import {
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
  SUPPORTED_PROTOCOL_VERSIONS,
} from "./mcp-config";

const programmes = [
  {
    name: "Computer Science and Engineering",
    url: "https://stcet.in/courses/computer-science-engineering",
    focus:
      "Software development, computing systems, artificial intelligence, and emerging technologies.",
  },
  {
    name: "Computer Science and Engineering (AI/ML)",
    url: "https://stcet.in/courses/computer-science-ai-ml",
    focus: "Artificial intelligence and machine learning.",
  },
  {
    name: "Information Technology",
    url: "https://stcet.in/courses/information-technology",
    focus: "Information systems, software technologies, and networking.",
  },
  {
    name: "Electronics and Communication Engineering",
    url: "https://stcet.in/courses/electronics-communication-engineering",
    focus: "Electronics, communication systems, and embedded technologies.",
  },
  {
    name: "Electrical and Electronics Engineering",
    url: "https://stcet.in/courses/electrical-electronics-engineering",
    focus: "Electrical systems, power engineering, automation, and electronics.",
  },
];

export function createStcetMcpServer() {
  const server = new McpServer(
    { name: MCP_SERVER_NAME, version: MCP_SERVER_VERSION },
    { supportedProtocolVersions: [...SUPPORTED_PROTOCOL_VERSIONS] },
  );

  server.registerTool(
    "get_site_overview",
    {
      title: "Get STCET site overview",
      description: "Get the public homepage summary and key STCET links.",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [{ type: "text", text: homepageMarkdown }],
    }),
  );

  server.registerTool(
    "list_programmes",
    {
      title: "List engineering programmes",
      description: "List STCET engineering programmes and their public pages.",
      inputSchema: z.object({}),
    },
    async () => ({
      content: [
        {
          type: "text",
          text: programmes
            .map(
              ({ name, url, focus }) =>
                `- ${name}: ${focus} ${url}`,
            )
            .join("\n"),
        },
      ],
    }),
  );

  return server;
}
