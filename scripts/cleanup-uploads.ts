import "dotenv/config";

import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../src/generated/prisma/client";
import { removeManagedUpload } from "../src/lib/admin/upload-storage";

const GRACE_PERIOD_MS = 24 * 60 * 60 * 1000;

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error("DATABASE_URL is not configured.");

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
  let removedCount = 0;
  let retainedCount = 0;

  try {
    const candidates = await prisma.mediaAsset.findMany({
      where: { createdAt: { lt: new Date(Date.now() - GRACE_PERIOD_MS) } },
      select: { id: true, path: true },
    });

    for (const asset of candidates) {
      const reference = await prisma.course.findFirst({
        where: {
          OR: [
            { heroImage: asset.path },
            { ogImage: asset.path },
            { modules: { some: { image: asset.path } } },
            { careerPathways: { some: { image: asset.path } } },
          ],
        },
        select: { id: true },
      });
      const galleryReference = await prisma.galleryImage.findFirst({
        where: { imagePath: asset.path },
        select: { id: true },
      });
      if (reference || galleryReference) {
        retainedCount += 1;
        continue;
      }

      try {
        if (await removeManagedUpload(asset.path)) {
          await prisma.mediaAsset.delete({ where: { id: asset.id } });
          removedCount += 1;
        } else {
          retainedCount += 1;
        }
      } catch {
        retainedCount += 1;
        process.stderr.write(
          "An old unreferenced upload could not be removed.\n",
        );
      }
    }

    process.stdout.write(
      `Upload cleanup complete. Removed ${removedCount}; retained ${retainedCount}.\n`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Unknown error.";
  process.stderr.write(`Upload cleanup failed: ${message}\n`);
  process.exitCode = 1;
});
