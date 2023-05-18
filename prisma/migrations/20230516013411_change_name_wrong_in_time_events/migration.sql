/*
  Warnings:

  - You are about to drop the column `discription` on the `time_events` table. All the data in the column will be lost.
  - Added the required column `description` to the `time_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `time_events` DROP COLUMN `discription`,
    ADD COLUMN `description` VARCHAR(191) NOT NULL;
