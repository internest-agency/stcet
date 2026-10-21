-- Create password reset token table for admin users
CREATE TABLE `passwordresettoken` (
    `id` VARCHAR(255) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `userId` INT NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `usedAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `passwordresettoken_tokenHash_key`(`tokenHash`),
    INDEX `passwordresettoken_userId_idx`(`userId`),
    INDEX `passwordresettoken_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign key constraint
ALTER TABLE `passwordresettoken` ADD CONSTRAINT `passwordresettoken_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `adminuser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;