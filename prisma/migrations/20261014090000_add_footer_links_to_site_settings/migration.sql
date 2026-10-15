-- Add footer_links JSON column to SiteSettings for managing footer menu links
-- Structure: { "importantLinks": [...], "quickLinks": [...] }
-- Existing SiteSettings records will get NULL; admins will populate via the UI.

ALTER TABLE `SiteSettings` ADD COLUMN `footerLinks` JSON NULL DEFAULT NULL;