-- CreateTable
CREATE TABLE `PlacementLeadership` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eyebrow` VARCHAR(191) NULL,
    `heading` TEXT NULL,
    `description` TEXT NULL,
    `officerName` VARCHAR(191) NULL,
    `officerDesignation` VARCHAR(191) NULL,
    `officerImagePath` VARCHAR(2048) NULL,
    `officerImageAlt` VARCHAR(255) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PlacementLeadershipItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` TEXT NULL,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `isPublished` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `PlacementLeadershipItem_isPublished_sortOrder_idx`(`isPublished`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
