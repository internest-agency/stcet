-- AlterTable
ALTER TABLE `TNEACounselling`
    ADD COLUMN `instructions` JSON NULL,
    ADD COLUMN `imagePath` VARCHAR(2048) NULL,
    ADD COLUMN `imageLabel` VARCHAR(191) NULL;

-- Existing rows previously stored the instruction checklist inside `description`
-- as blank-line separated text. That data is separated (without loss) by the
-- one-off backfill in `scripts/backfill-tnea-instructions.ts`, which moves the
-- intro line back into `description` and the remaining lines into `instructions`.
