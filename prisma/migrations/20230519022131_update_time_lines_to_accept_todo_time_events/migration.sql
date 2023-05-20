-- AlterTable
ALTER TABLE `time_lines` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'plan',
    MODIFY `project_id` VARCHAR(191) NULL;
