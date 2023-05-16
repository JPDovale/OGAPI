/*
  Warnings:

  - You are about to drop the column `born_date_timestemp` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the column `initial_date_timestemp` on the `projects` table. All the data in the column will be lost.
  - You are about to drop the column `happened_date_timestemp` on the `scenes` table. All the data in the column will be lost.
  - You are about to drop the column `happened_date_timestemp` on the `time_events` table. All the data in the column will be lost.
  - Added the required column `initial_date_time_christ` to the `projects` table without a default value. This is not possible if the table is not empty.
  - Added the required column `happened_date_timestamp` to the `time_events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `persons` DROP COLUMN `born_date_timestemp`,
    ADD COLUMN `born_date_timestamp` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `projects` DROP COLUMN `initial_date_timestemp`,
    ADD COLUMN `initial_date_time_christ` VARCHAR(191) NOT NULL,
    ADD COLUMN `initial_date_timestamp` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `scenes` DROP COLUMN `happened_date_timestemp`,
    ADD COLUMN `happened_date_timestamp` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `time_events` DROP COLUMN `happened_date_timestemp`,
    ADD COLUMN `happened_date_timestamp` INTEGER NOT NULL;
