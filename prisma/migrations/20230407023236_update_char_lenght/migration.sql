-- AlterTable
ALTER TABLE `refresh_tokens` MODIFY `refresh_token` VARCHAR(1000) NOT NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar_url` VARCHAR(255) NULL;
