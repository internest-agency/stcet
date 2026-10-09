import "dotenv/config";
import { createInterface } from "node:readline/promises";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { hashAdminPassword } from "../src/lib/admin/password";

function readHiddenPassword(prompt: string) {
  if (!process.stdin.isTTY || typeof process.stdin.setRawMode !== "function") {
    throw new Error("Run this command in an interactive terminal.");
  }

  process.stdout.write(prompt);
  process.stdin.setRawMode(true);
  process.stdin.resume();

  return new Promise<string>((resolve, reject) => {
    let password = "";
    const finish = (error?: Error) => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(false);
      process.stdin.pause();
      process.stdout.write("\n");
      if (error) reject(error);
      else resolve(password);
    };
    const onData = (chunk: Buffer) => {
      for (const character of chunk.toString("utf8")) {
        if (character === "\u0003") {
          finish(new Error("Bootstrap cancelled."));
          return;
        }
        if (character === "\r" || character === "\n") {
          finish();
          return;
        }
        if (character === "\u007f" || character === "\b") {
          password = password.slice(0, -1);
        } else {
          password += character;
        }
      }
    };
    process.stdin.on("data", onData);
  });
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

  const terminal = createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const name = (await terminal.question("Administrator name: ")).trim();
  const email = (await terminal.question("Administrator email: "))
    .trim()
    .toLowerCase();
  terminal.close();

  const password = await readHiddenPassword("Password (12+ characters): ");
  const confirmation = await readHiddenPassword("Confirm password: ");
  if (name.length < 2 || name.length > 120)
    throw new Error("Enter a valid name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Enter a valid email.");
  if (password.length < 12 || password.length > 256)
    throw new Error("Password must be 12 to 256 characters.");
  if (password !== confirmation) throw new Error("Passwords do not match.");

  const url = new URL(databaseUrl);
  const adapter = new PrismaMariaDb({
    host: url.hostname,
    port: Number(url.port || 3306),
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    connectionLimit: 2,
  });
  const prisma = new PrismaClient({ adapter });

  try {
    const existingAdmin = await prisma.adminUser.count({
      where: { role: "SUPER_ADMIN" },
    });
    if (existingAdmin > 0) {
      throw new Error(
        "An administrator already exists; bootstrap can only run once.",
      );
    }

    const passwordHash = await hashAdminPassword(password);
    await prisma.adminUser.create({
      data: { name, email, passwordHash, role: "SUPER_ADMIN", isActive: true },
    });
    process.stdout.write(`Created administrator account for ${email}.\n`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  process.stderr.write(`Administrator bootstrap failed: ${message}\n`);
  process.exitCode = 1;
});
