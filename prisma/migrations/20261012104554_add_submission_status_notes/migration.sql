-- AlterTable
ALTER TABLE `contactmessage` ADD COLUMN `adminNotes` TEXT NULL,
    ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'New';

-- AlterTable
ALTER TABLE `enquiry` ADD COLUMN `adminNotes` TEXT NULL,
    ADD COLUMN `status` VARCHAR(50) NOT NULL DEFAULT 'New';

-- CreateIndex
CREATE INDEX `ContactMessage_status_idx` ON `ContactMessage`(`status`);

-- CreateIndex
CREATE INDEX `Enquiry_status_idx` ON `Enquiry`(`status`);

-- CreateIndex
CREATE INDEX `Enquiry_studentEmail_idx` ON `Enquiry`(`studentEmail`);
