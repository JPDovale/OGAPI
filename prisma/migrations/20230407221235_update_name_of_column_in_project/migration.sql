/*
  Warnings:

  - You are about to drop the column `sumary` on the `projects` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `projects` DROP COLUMN `sumary`,
    ADD COLUMN `summary` MEDIUMTEXT NULL;
