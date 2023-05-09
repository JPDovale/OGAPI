-- DropForeignKey
ALTER TABLE `couples` DROP FOREIGN KEY `couples_couple_with_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `objectives_avoiders_id_fkey`;

-- DropForeignKey
ALTER TABLE `objectives` DROP FOREIGN KEY `objectives_supporters_id_fkey`;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_avoiders_id_fkey` FOREIGN KEY (`avoiders_id`) REFERENCES `objective_avoiders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_supporters_id_fkey` FOREIGN KEY (`supporters_id`) REFERENCES `objective_supporters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_couple_with_person_id_fkey` FOREIGN KEY (`couple_with_person_id`) REFERENCES `couples_withs_persons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
