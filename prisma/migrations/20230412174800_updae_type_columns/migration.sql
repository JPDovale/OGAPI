/*
  Warnings:

  - You are about to alter the column `expires_date` on the `refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `expires_date` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `sex` VARCHAR(191) NOT NULL DEFAULT 'not-receipted',
    MODIFY `age` VARCHAR(191) NOT NULL DEFAULT 'not-receipted';
