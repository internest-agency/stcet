-- Add ZeptoMail email notification settings to SiteSettings
ALTER TABLE `sitesettings`
  ADD COLUMN `zeptoEnabled` BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN `zeptoApiEndpoint` VARCHAR(512) NULL,
  ADD COLUMN `zeptoTokenEncrypted` TEXT NULL,
  ADD COLUMN `zeptoTokenSalt` VARCHAR(64) NULL,
  ADD COLUMN `zeptoSenderEmail` VARCHAR(255) NULL,
  ADD COLUMN `zeptoSenderName` VARCHAR(191) NULL,
  ADD COLUMN `zeptoAdminEmail` VARCHAR(255) NULL,
  ADD COLUMN `zeptoNotifyContact` BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN `zeptoNotifyEnquiry` BOOLEAN NOT NULL DEFAULT TRUE,
  ADD COLUMN `zeptoLastTestAt` DATETIME(3) NULL,
  ADD COLUMN `zeptoLastTestResult` VARCHAR(255) NULL;