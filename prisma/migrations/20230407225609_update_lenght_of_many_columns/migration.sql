-- AlterTable
ALTER TABLE `projects` MODIFY `image_url` VARCHAR(500) NULL,
    MODIFY `url_text` VARCHAR(600) NULL;

-- AlterTable
ALTER TABLE `users` MODIFY `avatar_url` VARCHAR(500) NULL;
