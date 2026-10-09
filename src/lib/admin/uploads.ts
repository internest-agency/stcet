import "server-only";

import { stat as statFile } from "node:fs/promises";
import path from "node:path";
import { getPrismaClient } from "@/src/lib/prisma";
import { isManagedUploadPath, removeManagedUpload } from "./upload-storage";

export {
  getUploadLimit,
  InvalidUploadError,
  openManagedUpload,
  parseUploadCategory,
  storeImageStream,
  UnsupportedImageError,
  UploadTooLargeError,
  type UploadCategory,
} from "./upload-storage";

function pathWithinRoot(root: string, target: string) {
  const relativePath = path.relative(root, target);
  return (
    relativePath !== "" &&
    relativePath !== ".." &&
    !relativePath.startsWith(`..${path.sep}`) &&
    !path.isAbsolute(relativePath)
  );
}

export async function cleanupUnreferencedUploads(references: string[]) {
  const paths = [...new Set(references)].filter((reference) =>
    isManagedUploadPath(reference),
  );
  if (!paths.length) return;

  const prisma = getPrismaClient();
  let assets: { id: number; path: string }[];
  try {
    assets = await prisma.mediaAsset.findMany({
      where: { path: { in: paths } },
      select: { id: true, path: true },
    });
  } catch {
    console.error("Unreferenced uploads could not be checked for cleanup.");
    return;
  }

  for (const asset of assets) {
    try {
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
      if (reference || galleryReference) continue;

      if (await removeManagedUpload(asset.path)) {
        await prisma.mediaAsset.delete({ where: { id: asset.id } });
      }
    } catch {
      console.error("An unreferenced upload could not be cleaned up.");
    }
  }
}

export async function validateImageReferences(
  references: string[],
  unchangedReferences: string[] = [],
) {
  const unchanged = new Set(unchangedReferences);
  const publicRoot = path.resolve(process.cwd(), "public", "images");
  const prisma = getPrismaClient();

  for (const reference of new Set(references)) {
    if (!reference || unchanged.has(reference)) continue;

    if (reference.startsWith("/images/")) {
      const target = path.resolve(process.cwd(), "public", reference.slice(1));
      if (!pathWithinRoot(publicRoot, target)) return false;
      try {
        if (!(await statFile(target)).isFile()) return false;
      } catch {
        return false;
      }
      continue;
    }

    if (!isManagedUploadPath(reference)) return false;
    try {
      const registered = await prisma.mediaAsset.findUnique({
        where: { path: reference },
        select: { id: true },
      });
      if (!registered) return false;
    } catch {
      return false;
    }
  }

  return true;
}

export async function removeUnregisteredUpload(reference: string) {
  try {
    await removeManagedUpload(reference);
  } catch {
    console.error("An unregistered upload could not be cleaned up.");
  }
}
