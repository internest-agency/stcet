-- CreateTable: Events managed from the admin panel and rendered on the public
-- site. Dates/times are stored as Asia/Kolkata wall-clock strings
-- (`startDate` = ISO `YYYY-MM-DD`, `startTime` = `HH:mm`) so the calendar value
-- an admin enters is never shifted by UTC conversion.
CREATE TABLE `event` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `shortDescription` TEXT NULL,
    `description` TEXT NULL,
    `category` VARCHAR(120) NULL,
    `imagePath` VARCHAR(2048) NULL,
    `imageAlt` VARCHAR(255) NULL,
    `startDate` VARCHAR(10) NOT NULL,
    `startTime` VARCHAR(5) NULL,
    `endDate` VARCHAR(10) NULL,
    `endTime` VARCHAR(5) NULL,
    `isAllDay` BOOLEAN NOT NULL DEFAULT false,
    `venue` VARCHAR(191) NULL,
    `locationDetails` TEXT NULL,
    `registrationUrl` VARCHAR(2048) NULL,
    `websiteUrl` VARCHAR(2048) NULL,
    `isPublished` BOOLEAN NOT NULL DEFAULT false,
    `isFeatured` BOOLEAN NOT NULL DEFAULT false,
    `sortOrder` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `event_slug_key`(`slug`),
    INDEX `event_isPublished_startDate_idx`(`isPublished`, `startDate`),
    INDEX `event_isPublished_isFeatured_sortOrder_idx`(`isPublished`, `isFeatured`, `sortOrder`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
