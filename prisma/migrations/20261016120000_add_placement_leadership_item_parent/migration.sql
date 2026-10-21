-- Give every qualification / experience item an explicit parent "Placement
-- Leadership" record. The column is added nullable, backfilled to the existing
-- singleton section, and only then made required — so existing rows are kept and
-- the migration stays safe on a fresh (empty) database as well.

-- AlterTable
ALTER TABLE `PlacementLeadershipItem` ADD COLUMN `leadershipId` INTEGER NULL;

-- Backfill: attach every existing item to the leadership section.
UPDATE `PlacementLeadershipItem`
SET `leadershipId` = (SELECT `id` FROM `PlacementLeadership` ORDER BY `id` ASC LIMIT 1)
WHERE `leadershipId` IS NULL;

-- Safety net: if items exist without any section (possible before this change),
-- create a minimal draft section so the backfill resolves and the FK can apply.
INSERT INTO `PlacementLeadership` (`isPublished`, `createdAt`, `updatedAt`)
SELECT false, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM DUAL
WHERE EXISTS (SELECT 1 FROM `PlacementLeadershipItem` WHERE `leadershipId` IS NULL)
  AND NOT EXISTS (SELECT 1 FROM `PlacementLeadership`);

UPDATE `PlacementLeadershipItem`
SET `leadershipId` = (SELECT `id` FROM `PlacementLeadership` ORDER BY `id` ASC LIMIT 1)
WHERE `leadershipId` IS NULL;

-- AlterTable: make the relationship required.
ALTER TABLE `PlacementLeadershipItem` MODIFY COLUMN `leadershipId` INTEGER NOT NULL;

-- DropIndex: replaced by the composite index below.
DROP INDEX `PlacementLeadershipItem_isPublished_sortOrder_idx` ON `PlacementLeadershipItem`;

-- CreateIndex
CREATE INDEX `PlacementLeadershipItem_leadershipId_isPublished_sortOrder_idx` ON `PlacementLeadershipItem`(`leadershipId`, `isPublished`, `sortOrder`);

-- AddForeignKey
ALTER TABLE `PlacementLeadershipItem` ADD CONSTRAINT `PlacementLeadershipItem_leadershipId_fkey` FOREIGN KEY (`leadershipId`) REFERENCES `PlacementLeadership`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
