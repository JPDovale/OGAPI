/*
  Warnings:

  - You are about to drop the `_ProjectUsersToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_ProjectUsersToUser` DROP FOREIGN KEY `_ProjectUsersToUser_A_fkey`;

-- DropForeignKey
ALTER TABLE `_ProjectUsersToUser` DROP FOREIGN KEY `_ProjectUsersToUser_B_fkey`;

-- DropForeignKey
ALTER TABLE `project_users` DROP FOREIGN KEY `project_users_project_id_fkey`;

-- DropTable
DROP TABLE `_ProjectUsersToUser`;

-- DropTable
DROP TABLE `project_users`;

-- CreateTable
CREATE TABLE `project_users_view` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `project_users_view_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_users_edit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `project_users_edit_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `project_users_comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `project_users_comment_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectUsersViewToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectUsersViewToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectUsersViewToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectUsersEditToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectUsersEditToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectUsersEditToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectUsersCommentToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectUsersCommentToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectUsersCommentToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_users_view` ADD CONSTRAINT `project_users_view_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_users_edit` ADD CONSTRAINT `project_users_edit_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_users_comment` ADD CONSTRAINT `project_users_comment_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersViewToUser` ADD CONSTRAINT `_ProjectUsersViewToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `project_users_view`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersViewToUser` ADD CONSTRAINT `_ProjectUsersViewToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersEditToUser` ADD CONSTRAINT `_ProjectUsersEditToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `project_users_edit`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersEditToUser` ADD CONSTRAINT `_ProjectUsersEditToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersCommentToUser` ADD CONSTRAINT `_ProjectUsersCommentToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `project_users_comment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersCommentToUser` ADD CONSTRAINT `_ProjectUsersCommentToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
