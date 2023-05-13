/*
  Warnings:

  - A unique constraint covering the columns `[id_customer]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `id_customer` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_id_customer_key` ON `users`(`id_customer`);
