-- AlterTable
ALTER TABLE `galleryimage` ADD COLUMN `showOnHome` BOOLEAN NOT NULL DEFAULT false;

-- Feature a few existing published images on the home page gallery.
UPDATE `galleryimage`
SET `showOnHome` = true
WHERE `id` IN (
  SELECT `id` FROM (
    SELECT `id`
    FROM `galleryimage`
    WHERE `isPublished` = true
    ORDER BY `sortOrder` ASC, `id` ASC
    LIMIT 4
  ) AS featured
);

-- CreateIndex
CREATE INDEX `galleryimage_isPublished_showOnHome_sortOrder_idx` ON `galleryimage`(`isPublished`, `showOnHome`, `sortOrder`);
