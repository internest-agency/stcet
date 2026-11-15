-- Add site-wide custom code fields to SiteSettings
ALTER TABLE `sitesettings`
  ADD COLUMN `customHeadCode` TEXT NULL,
  ADD COLUMN `customBodyEndCode` TEXT NULL;
