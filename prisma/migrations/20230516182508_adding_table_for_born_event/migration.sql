/*
  Warnings:

  - You are about to drop the `_SceneToTimeEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_SceneToTimeEvent` DROP FOREIGN KEY `_SceneToTimeEvent_A_fkey`;

-- DropForeignKey
ALTER TABLE `_SceneToTimeEvent` DROP FOREIGN KEY `_SceneToTimeEvent_B_fkey`;

-- AlterTable
ALTER TABLE `time_events` ADD COLUMN `scene_id` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_SceneToTimeEvent`;

-- CreateTable
CREATE TABLE `time_events_born` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `time_event_id` VARCHAR(191) NOT NULL,
    `person_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `time_events_born_time_event_id_key`(`time_event_id`),
    UNIQUE INDEX `time_events_born_person_id_key`(`person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `time_events` ADD CONSTRAINT `time_events_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events_born` ADD CONSTRAINT `time_events_born_time_event_id_fkey` FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events_born` ADD CONSTRAINT `time_events_born_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
