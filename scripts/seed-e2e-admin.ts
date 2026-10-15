/**
 * Seeds an admin account for authenticated HTTP end-to-end tests. Refuses to
 * run against any host other than localhost so it can never create an account
 * on a production database.
 *
 *   DATABASE_URL=mysql://root:@127.0.0.1:3306/stcet_e2e npx tsx scripts/seed-e2e-admin.ts
 */
import { getPrismaClient } from "../src/lib/prisma-client";
import { hashAdminPassword } from "../src/lib/admin/password";

const LOCAL_HOSTS = new Set(["127.0.0.1", "localhost", "::1", "[::1]"]);
const email = process.env.E2E_ADMIN_EMAIL ?? "e2e-uploads@example.com";
const password = process.env.E2E_ADMIN_PASSWORD ?? "E2e!UploadTest123";

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not set.");

  const host = new URL(databaseUrl).hostname;
  if (!LOCAL_HOSTS.has(host)) {
    throw new Error(
      `Refusing to seed an admin on non-local host "${host}". ` +
        "This helper is for scratch databases only.",
    );
  }

  const prisma = getPrismaClient();
  const passwordHash = await hashAdminPassword(password);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { isActive: true, passwordHash },
    create: { name: "E2E Admin", email, passwordHash, role: "SUPER_ADMIN" },
  });

  console.log(`seeded admin id=${admin.id} email=${admin.email} host=${host}`);
  await prisma.$disconnect().catch(() => undefined);
  process.exit(0);
}

main().catch((error) => {
  console.error("seed-e2e-admin fatal:", error);
  process.exit(1);
});
