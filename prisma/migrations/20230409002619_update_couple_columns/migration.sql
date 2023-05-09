-- DropForeignKey
ALTER TABLE `couples` DROP FOREIGN KEY `couples_couple_with_person_id_fkey`;

-- AlterTable
ALTER TABLE `couples` MODIFY `couple_with_person_id` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_couple_with_person_id_fkey` FOREIGN KEY (`couple_with_person_id`) REFERENCES `couples_withs_persons`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
