/*
  Warnings:

  - You are about to drop the column `last_payment_date` on the `users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[time_line_id]` on the table `parsons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id_customer]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `parsons` ADD COLUMN `born_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `born_date_timestamp` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `born_day` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `born_hour` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `born_minute` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `born_month` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `born_second` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `born_year` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `born_year_time_christ` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `time_line_id` VARCHAR(191) NULL,
    MODIFY `age` INTEGER NULL;

-- AlterTable
ALTER TABLE `projects` ADD COLUMN `features_using` VARCHAR(191) NOT NULL DEFAULT 'book|plot|planet|nation|person|city|race|religion|power|family|inst|time-lines|language',
    ADD COLUMN `initial_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `initial_date_time_christ` VARCHAR(191) NOT NULL DEFAULT 'D.C.',
    ADD COLUMN `initial_date_timestamp` VARCHAR(191) NOT NULL DEFAULT '0';

-- AlterTable
ALTER TABLE `scenes` ADD COLUMN `happened_date` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_date_timestamp` VARCHAR(191) NOT NULL DEFAULT '0',
    ADD COLUMN `happened_day` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_hour` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_minute` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_month` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_second` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `happened_year` VARCHAR(191) NOT NULL DEFAULT 'non-set',
    ADD COLUMN `happened_year_time_christ` VARCHAR(191) NOT NULL DEFAULT 'non-set';

-- AlterTable
ALTER TABLE `users` DROP COLUMN `last_payment_date`,
    ADD COLUMN `id_customer` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `subscription_stripe_id` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL DEFAULT 'subscription',
    `payment_status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `price_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `subscriptions_id_key`(`id`),
    UNIQUE INDEX `subscriptions_subscription_stripe_id_key`(`subscription_stripe_id`),
    UNIQUE INDEX `subscriptions_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_lines` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `description` VARCHAR(600) NULL,
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
    `description` VARCHAR(191) NOT NULL,
    `happened_date_timestamp` VARCHAR(191) NOT NULL,
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
    `scene_id` VARCHAR(191) NULL,

    UNIQUE INDEX `time_events_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `time_events_born` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time_event_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `time_events_born_time_event_id_key`(`time_event_id`),
    UNIQUE INDEX `time_events_born_person_id_key`(`person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToTimeEvent` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToTimeEvent_AB_unique`(`A`, `B`),
    INDEX `_PersonToTimeEvent_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `parsons_time_line_id_key` ON `parsons`(`time_line_id`);

-- CreateIndex
CREATE UNIQUE INDEX `users_id_customer_key` ON `users`(`id_customer`);

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parsons` ADD CONSTRAINT `parsons_time_line_id_fkey` FOREIGN KEY (`time_line_id`) REFERENCES `time_lines`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_lines` ADD CONSTRAINT `time_lines_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_lines` ADD CONSTRAINT `time_lines_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events` ADD CONSTRAINT `time_events_time_line_id_fkey` FOREIGN KEY (`time_line_id`) REFERENCES `time_lines`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events` ADD CONSTRAINT `time_events_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events_born` ADD CONSTRAINT `time_events_born_time_event_id_fkey` FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events_born` ADD CONSTRAINT `time_events_born_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTimeEvent` ADD CONSTRAINT `_PersonToTimeEvent_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTimeEvent` ADD CONSTRAINT `_PersonToTimeEvent_B_fkey` FOREIGN KEY (`B`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
