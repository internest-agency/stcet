import "server-only";

// The client factory lives in ./prisma-client (no "server-only") so that
// scripts/prisma-connectivity.ts can exercise the exact same initialization
// the app uses. This module only re-exports it behind the server-only guard.
export { getPrismaClient, isDatabaseConfigured } from "./prisma-client";
