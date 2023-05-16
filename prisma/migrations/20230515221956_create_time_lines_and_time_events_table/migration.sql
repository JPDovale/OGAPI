/*
  Warnings:

  - You are about to drop the `parsons` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_AppearanceToPerson` DROP FOREIGN KEY `_AppearanceToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_DreamToPerson` DROP FOREIGN KEY `_DreamToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_FearToPerson` DROP FOREIGN KEY `_FearToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_ObjectiveAvoidersToPerson` DROP FOREIGN KEY `_ObjectiveAvoidersToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_ObjectiveSupportersToPerson` DROP FOREIGN KEY `_ObjectiveSupportersToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_ObjectiveToPerson` DROP FOREIGN KEY `_ObjectiveToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToPersonality` DROP FOREIGN KEY `_PersonToPersonality_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToPower` DROP FOREIGN KEY `_PersonToPower_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToScene` DROP FOREIGN KEY `_PersonToScene_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToTrauma` DROP FOREIGN KEY `_PersonToTrauma_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToValue` DROP FOREIGN KEY `_PersonToValue_A_fkey`;

-- DropForeignKey
ALTER TABLE `_PersonToWishe` DROP FOREIGN KEY `_PersonToWishe_A_fkey`;

-- DropForeignKey
ALTER TABLE `archives` DROP FOREIGN KEY `archives_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `couples` DROP FOREIGN KEY `couples_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `couples_withs_persons` DROP FOREIGN KEY `couples_withs_persons_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `parsons` DROP FOREIGN KEY `parsons_project_id_fkey`;

-- DropForeignKey
ALTER TABLE `parsons` DROP FOREIGN KEY `parsons_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscriptions` DROP FOREIGN KEY `subscriptions_user_id_fkey`;

-- AlterTable
ALTER TABLE `scenes` ADD COLUMN `happened_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_date_timestemp` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_day` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_hour` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_minute` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_month` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_second` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_year` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_year_time_christ` VARCHAR(191) NOT NULL DEFAULT 'non-set';

-- DropTable
DROP TABLE `parsons`;

-- CreateTable
CREATE TABLE `persons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `history` MEDIUMTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `image_filename` VARCHAR(191) NULL,
    `image_url` VARCHAR(500) NULL,
    `born_date_timestemp` INTEGER NOT NULL DEFAULT 0,
    `born_year` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    `born_year_time_christ` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    `born_month` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    `born_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    `born_day` INTEGER NOT NULL DEFAULT 0,
    `born_hour` INTEGER NOT NULL DEFAULT 0,
    `born_minute` INTEGER NOT NULL DEFAULT 0,
    `born_second` INTEGER NOT NULL DEFAULT 0,
    `user_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,
    `time_line_id` VARCHAR(191) NULL,

    UNIQUE INDEX `persons_time_line_id_key`(`time_line_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_lines` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(600) NOT NULL,
    `is_alternative` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `project_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `time_lines_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_events` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `discription` VARCHAR(191) NOT NULL,
    `happened_date_timestemp` INTEGER NOT NULL,
    `happened_year` VARCHAR(191) NOT NULL,
    `happened_year_time_christ` VARCHAR(191) NOT NULL,
    `happened_month` VARCHAR(191) NOT NULL,
    `happened_date` VARCHAR(191) NOT NULL,
    `happened_day` INTEGER NOT NULL,
    `happened_hour` INTEGER NOT NULL,
    `happened_minute` INTEGER NOT NULL,
    `happened_second` INTEGER NOT NULL,
    `importance` INTEGER NOT NULL DEFAULT 5,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `time_line_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `time_events_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToTimeEvent` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToTimeEvent_AB_unique`(`A`, `B`),
    INDEX `_PersonToTimeEvent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SceneToTimeEvent` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_SceneToTimeEvent_AB_unique`(`A`, `B`),
    INDEX `_SceneToTimeEvent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persons` ADD CONSTRAINT `persons_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persons` ADD CONSTRAINT `persons_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `persons` ADD CONSTRAINT `persons_time_line_id_fkey` FOREIGN KEY (`time_line_id`) REFERENCES `time_lines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples_withs_persons` ADD CONSTRAINT `couples_withs_persons_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archives` ADD CONSTRAINT `archives_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_lines` ADD CONSTRAINT `time_lines_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_lines` ADD CONSTRAINT `time_lines_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events` ADD CONSTRAINT `time_events_time_line_id_fkey` FOREIGN KEY (`time_line_id`) REFERENCES `time_lines`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPersonality` ADD CONSTRAINT `_PersonToPersonality_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPower` ADD CONSTRAINT `_PersonToPower_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToValue` ADD CONSTRAINT `_PersonToValue_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToWishe` ADD CONSTRAINT `_PersonToWishe_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTrauma` ADD CONSTRAINT `_PersonToTrauma_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToScene` ADD CONSTRAINT `_PersonToScene_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTimeEvent` ADD CONSTRAINT `_PersonToTimeEvent_A_fkey` FOREIGN KEY (`A`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTimeEvent` ADD CONSTRAINT `_PersonToTimeEvent_B_fkey` FOREIGN KEY (`B`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveToPerson` ADD CONSTRAINT `_ObjectiveToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveAvoidersToPerson` ADD CONSTRAINT `_ObjectiveAvoidersToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveSupportersToPerson` ADD CONSTRAINT `_ObjectiveSupportersToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppearanceToPerson` ADD CONSTRAINT `_AppearanceToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DreamToPerson` ADD CONSTRAINT `_DreamToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FearToPerson` ADD CONSTRAINT `_FearToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SceneToTimeEvent` ADD CONSTRAINT `_SceneToTimeEvent_A_fkey` FOREIGN KEY (`A`) REFERENCES `scenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SceneToTimeEvent` ADD CONSTRAINT `_SceneToTimeEvent_B_fkey` FOREIGN KEY (`B`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
