-- AlterTable
ALTER TABLE galleryimage ADD COLUMN showOnGalleryPage BOOLEAN NOT NULL DEFAULT true;

-- Preserve the previous split: images featured on home were not shown on the gallery page.
UPDATE galleryimage
SET showOnGalleryPage = NOT showOnHome;

-- CreateIndex
CREATE INDEX galleryimage_isPublished_showOnGalleryPage_sortOrder_idx ON galleryimage(isPublished, showOnGalleryPage, sortOrder);