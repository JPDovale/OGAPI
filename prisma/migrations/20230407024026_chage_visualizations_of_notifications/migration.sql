/*
  Warnings:

  - You are about to drop the column `visualized_at` on the `notifications` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `visualized_at`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `new_notifications` INTEGER NOT NULL DEFAULT 0;
