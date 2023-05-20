-- AlterTable
ALTER TABLE `comments` ADD COLUMN `time_event_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `time_events_to_do` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `completed_at` DATETIME(3) NULL,
    `time_event_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `time_events_to_do_time_event_id_key`(`time_event_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_time_event_id_fkey` FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `time_events_to_do` ADD CONSTRAINT `time_events_to_do_time_event_id_fkey` FOREIGN KEY (`time_event_id`) REFERENCES `time_events`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
