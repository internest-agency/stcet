-- Preserve all existing facilities while allowing administrators to temporarily hide one.
ALTER TABLE `InfrastructureFacility` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
