-- AlterTable
ALTER TABLE `comments` ADD COLUMN `book_id` VARCHAR(191) NULL,
    ADD COLUMN `capitule_id` VARCHAR(191) NULL,
    ADD COLUMN `scene_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NULL,
    `literary_genre` VARCHAR(191) NOT NULL,
    `isbn` VARCHAR(191) NULL,
    `front_cover_filename` VARCHAR(191) NULL,
    `front_cover_user` VARCHAR(500) NULL,
    `words` INTEGER NOT NULL DEFAULT 0,
    `written_words` INTEGER NOT NULL DEFAULT 0,
    `one_phrase` VARCHAR(300) NULL,
    `premise` TEXT NULL,
    `storyteller` VARCHAR(191) NULL,
    `ambient` TEXT NULL,
    `count_time` VARCHAR(1000) NULL,
    `historical_fact` TEXT NULL,
    `details` TEXT NULL,
    `summary` MEDIUMTEXT NULL,
    `url_text` VARCHAR(600) NULL,
    `structure_act_1` MEDIUMTEXT NULL,
    `structure_act_2` MEDIUMTEXT NULL,
    `structure_act_3` MEDIUMTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `genres` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` VARCHAR(191) NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `capitules` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `sequence` INTEGER NOT NULL,
    `objective` VARCHAR(600) NOT NULL,
    `complete` BOOLEAN NOT NULL DEFAULT false,
    `words` INTEGER NOT NULL DEFAULT 0,
    `structure_act_1` MEDIUMTEXT NULL,
    `structure_act_2` MEDIUMTEXT NULL,
    `structure_act_3` MEDIUMTEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `book_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scenes` (
    `id` VARCHAR(191) NOT NULL,
    `sequence` INTEGER NOT NULL,
    `complete` BOOLEAN NOT NULL DEFAULT false,
    `objective` VARCHAR(600) NOT NULL,
    `written_words` INTEGER NOT NULL DEFAULT 0,
    `structure_act_1` MEDIUMTEXT NOT NULL,
    `structure_act_2` MEDIUMTEXT NOT NULL,
    `structure_act_3` MEDIUMTEXT NOT NULL,
    `capitule_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToScene` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToScene_AB_unique`(`A`, `B`),
    INDEX `_PersonToScene_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_BookToGenre` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_BookToGenre_AB_unique`(`A`, `B`),
    INDEX `_BookToGenre_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_capitule_id_fkey` FOREIGN KEY (`capitule_id`) REFERENCES `capitules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_scene_id_fkey` FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `authors` ADD CONSTRAINT `authors_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `authors` ADD CONSTRAINT `authors_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `capitules` ADD CONSTRAINT `capitules_book_id_fkey` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scenes` ADD CONSTRAINT `scenes_capitule_id_fkey` FOREIGN KEY (`capitule_id`) REFERENCES `capitules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToScene` ADD CONSTRAINT `_PersonToScene_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToScene` ADD CONSTRAINT `_PersonToScene_B_fkey` FOREIGN KEY (`B`) REFERENCES `scenes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_A_fkey` FOREIGN KEY (`A`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_BookToGenre` ADD CONSTRAINT `_BookToGenre_B_fkey` FOREIGN KEY (`B`) REFERENCES `genres`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
