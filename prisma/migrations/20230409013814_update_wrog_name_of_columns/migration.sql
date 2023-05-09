/*
  Warnings:

  - You are about to drop the column `itle` on the `consequences` table. All the data in the column will be lost.
  - You are about to drop the column `itle` on the `exceptions` table. All the data in the column will be lost.
  - Added the required column `title` to the `consequences` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `exceptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `consequences` DROP COLUMN `itle`,
    ADD COLUMN `title` VARCHAR(500) NOT NULL;

-- AlterTable
ALTER TABLE `exceptions` DROP COLUMN `itle`,
    ADD COLUMN `title` VARCHAR(500) NOT NULL;
