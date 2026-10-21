-- Introduce a dedicated FacultyGroup model and link each faculty member to it,
-- while preserving every existing faculty record and its free-text `group`
-- assignment. The `group` string column is intentionally kept (not dropped) so
-- nothing that still reads it breaks and so the backfill is reversible.

-- CreateTable
CREATE TABLE `FacultyGroup` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `FacultyGroup_slug_key`(`slug`),
    INDEX `FacultyGroup_sortOrder_idx`(`sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AlterTable (nullable so existing rows are kept and unassigned members stay valid)
ALTER TABLE `faculty` ADD COLUMN `groupId` INTEGER NULL;

-- Backfill: create one group per distinct trimmed name (case-insensitive),
-- ordered by the first faculty record that used it. The slug is suffixed with
-- the first faculty id to guarantee uniqueness even when two names normalise to
-- the same slug.
INSERT INTO `FacultyGroup` (`name`, `slug`, `sortOrder`, `createdAt`, `updatedAt`)
SELECT
    src.`name`,
    CONCAT(src.`base_slug`, '-', src.`first_id`),
    src.`rn` - 1,
    CURRENT_TIMESTAMP(3),
    CURRENT_TIMESTAMP(3)
FROM (
    SELECT
        MIN(TRIM(`group`)) AS `name`,
        LOWER(REGEXP_REPLACE(MIN(TRIM(`group`)), '[^a-zA-Z0-9]+', '-')) AS `base_slug`,
        MIN(`id`) AS `first_id`,
        ROW_NUMBER() OVER (ORDER BY MIN(`id`) ASC) AS `rn`
    FROM `faculty`
    WHERE `group` IS NOT NULL AND TRIM(`group`) <> ''
    GROUP BY LOWER(TRIM(`group`))
) AS src;

-- Link existing faculty to their newly created group.
UPDATE `faculty` f
JOIN `FacultyGroup` fg ON LOWER(TRIM(f.`group`)) = LOWER(fg.`name`)
SET f.`groupId` = fg.`id`
WHERE f.`group` IS NOT NULL AND TRIM(f.`group`) <> '';

-- CreateIndex
CREATE INDEX `faculty_groupId_idx` ON `faculty`(`groupId`);

-- AddForeignKey
ALTER TABLE `faculty` ADD CONSTRAINT `faculty_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `FacultyGroup`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
