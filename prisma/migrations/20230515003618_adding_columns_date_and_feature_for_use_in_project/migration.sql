-- AlterTable
ALTER TABLE `projects` ADD COLUMN `features_using` VARCHAR(191) NOT NULL DEFAULT 'book|plot|planet|nation|person|city|race|religion|power|family|inst|time-lines|language',
    ADD COLUMN `initial_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `initial_date_timestemp` INTEGER NOT NULL DEFAULT 0;
