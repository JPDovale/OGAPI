-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `objectives_avoiders_id_fkey`;

-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `objectives_supporters_id_fkey`;

-- AlterTable
ALTER TABLE `objectives` MODIFY `avoiders_id` INTEGER NULL,
    MODIFY `supporters_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_avoiders_id_fkey` FOREIGN KEY (`avoiders_id`) REFERENCES `objective_avoiders`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_supporters_id_fkey` FOREIGN KEY (`supporters_id`) REFERENCES `objective_supporters`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
