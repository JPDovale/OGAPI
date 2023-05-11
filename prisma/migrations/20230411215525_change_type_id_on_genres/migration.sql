/*
  Warnings:

  - The primary key for the `genres` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `_BookToGenre` DROP FOREIGN KEY `_BookToGenre_B_fkey`;

-- AlterTable
ALTER TABLE `_BookToGenre` MODIFY `B` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `genres` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
