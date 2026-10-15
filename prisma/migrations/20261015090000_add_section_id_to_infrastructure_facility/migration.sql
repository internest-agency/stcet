-- Add sectionId field to InfrastructureFacility model for section mapping
ALTER TABLE InfrastructureFacility ADD COLUMN sectionId VARCHAR(50) NULL;