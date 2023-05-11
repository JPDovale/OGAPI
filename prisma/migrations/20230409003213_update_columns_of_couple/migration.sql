/*
  Warnings:

  - Made the column `couple_with_person_id` on table `couples` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `couples` DROP FOREIGN KEY `couples_couple_with_person_id_fkey`;

-- AlterTable
ALTER TABLE `couples` MODIFY `couple_with_person_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_couple_with_person_id_fkey` FOREIGN KEY (`couple_with_person_id`) REFERENCES `couples_withs_persons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
