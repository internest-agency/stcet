-- Keep company availability distinct from publication without altering existing records.
ALTER TABLE `PlacementCompany` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
