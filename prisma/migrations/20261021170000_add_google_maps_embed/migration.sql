-- Add googleMapsEmbedUrl column to SiteSettings table
ALTER TABLE `sitesettings` ADD COLUMN `googleMapsEmbedUrl` VARCHAR(2048) NULL;