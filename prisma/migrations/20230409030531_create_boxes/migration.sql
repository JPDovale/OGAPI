-- CreateTable
CREATE TABLE `boxes` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `box_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archives` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `description` MEDIUMTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `box_id` VARCHAR(191) NULL,
    `project_id` VARCHAR(191) NULL,
    `person_id` VARCHAR(191) NULL,
    `book_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `images` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `image_filename` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `archive_id` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `boxes` ADD CONSTRAINT `boxes_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tags` ADD CONSTRAINT `tags_box_id_fkey` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archives` ADD CONSTRAINT `archives_box_id_fkey` FOREIGN KEY (`box_id`) REFERENCES `boxes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archives` ADD CONSTRAINT `archives_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archives` ADD CONSTRAINT `archives_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `archives` ADD CONSTRAINT `archives_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `images` ADD CONSTRAINT `images_archive_id_fkey` FOREIGN KEY (`archive_id`) REFERENCES `archives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
