-- AlterTable
ALTER TABLE `notifications` MODIFY `title` LONGTEXT NOT NULL,
    MODIFY `content` VARCHAR(5000) NOT NULL;
