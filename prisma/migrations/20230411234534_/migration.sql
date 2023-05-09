/*
  Warnings:

  - The primary key for the `archives` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_archive_id_fkey`;

-- AlterTable
ALTER TABLE `archives` DROP PRIMARY KEY,
    MODIFY `id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`id`);

-- AlterTable
ALTER TABLE `images` MODIFY `archive_id` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_archive_id_fkey` FOREIGN KEY (`archive_id`) REFERENCES `archives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
