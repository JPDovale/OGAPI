/*
  Warnings:

  - You are about to drop the column `front_cover_user` on the `books` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `front_cover_user`,
    ADD COLUMN `front_cover_url` VARCHAR(500) NULL;
