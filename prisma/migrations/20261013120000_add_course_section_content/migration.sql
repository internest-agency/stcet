-- AlterTable
ALTER TABLE `Course`
    ADD COLUMN `overviewHeading` VARCHAR(255) NULL,
    ADD COLUMN `overviewKeyStatement` TEXT NULL,
    ADD COLUMN `curriculumTitle` VARCHAR(255) NULL,
    ADD COLUMN `curriculumIntro` TEXT NULL,
    ADD COLUMN `opportunityTitle` VARCHAR(255) NULL,
    ADD COLUMN `whyStudyLabel` VARCHAR(191) NULL,
    ADD COLUMN `whyStudyHeading` VARCHAR(255) NULL,
    ADD COLUMN `whyStudyIntro` TEXT NULL,
    ADD COLUMN `careerTitle` VARCHAR(255) NULL,
    ADD COLUMN `careerIntro` TEXT NULL;
