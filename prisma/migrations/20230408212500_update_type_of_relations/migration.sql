/*
  Warnings:

  - You are about to drop the `_CoupleToPerson` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `person_id` to the `couples` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_CoupleToPerson` DROP FOREIGN KEY `_CoupleToPerson_A_fkey`;

-- DropForeignKey
ALTER TABLE `_CoupleToPerson` DROP FOREIGN KEY `_CoupleToPerson_B_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_appearance_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_couple_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_dream_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_fear_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_objective_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_personality_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_power_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_trauma_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_value_id_fkey`;

-- DropForeignKey
ALTER TABLE `comments` DROP FOREIGN KEY `comments_wishe_id_fkey`;

-- DropForeignKey
ALTER TABLE `consequences` DROP FOREIGN KEY `consequences_personality_id_fkey`;

-- DropForeignKey
ALTER TABLE `consequences` DROP FOREIGN KEY `consequences_trauma_id_fkey`;

-- DropForeignKey
ALTER TABLE `couples_withs_persons` DROP FOREIGN KEY `couples_withs_persons_person_id_fkey`;

-- DropForeignKey
ALTER TABLE `exceptions` DROP FOREIGN KEY `exceptions_value_id_fkey`;

-- DropForeignKey
ALTER TABLE `parsons` DROP FOREIGN KEY `parsons_project_id_fkey`;

-- AlterTable
ALTER TABLE `couples` ADD COLUMN `person_id` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `_CoupleToPerson`;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_objective_id_fkey` FOREIGN KEY (`objective_id`) REFERENCES `objectives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_personality_id_fkey` FOREIGN KEY (`personality_id`) REFERENCES `personalities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_appearance_id_fkey` FOREIGN KEY (`appearance_id`) REFERENCES `appearences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_dream_id_fkey` FOREIGN KEY (`dream_id`) REFERENCES `dreams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_fear_id_fkey` FOREIGN KEY (`fear_id`) REFERENCES `fears`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_power_id_fkey` FOREIGN KEY (`power_id`) REFERENCES `powers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_couple_id_fkey` FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `values`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_wishe_id_fkey` FOREIGN KEY (`wishe_id`) REFERENCES `wishes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_trauma_id_fkey` FOREIGN KEY (`trauma_id`) REFERENCES `traumas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parsons` ADD CONSTRAINT `parsons_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consequences` ADD CONSTRAINT `consequences_personality_id_fkey` FOREIGN KEY (`personality_id`) REFERENCES `personalities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consequences` ADD CONSTRAINT `consequences_trauma_id_fkey` FOREIGN KEY (`trauma_id`) REFERENCES `traumas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples_withs_persons` ADD CONSTRAINT `couples_withs_persons_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exceptions` ADD CONSTRAINT `exceptions_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `values`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
