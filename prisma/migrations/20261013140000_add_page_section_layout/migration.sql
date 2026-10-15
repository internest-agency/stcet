-- Add a selectable presentation layout for institutional content sections.
-- Existing sections keep their content and default to the "standard" layout.
ALTER TABLE `PageSection` ADD COLUMN `layout` VARCHAR(32) NOT NULL DEFAULT 'standard';
