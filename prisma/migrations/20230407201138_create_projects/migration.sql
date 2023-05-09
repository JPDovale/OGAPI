-- CreateTable
CREATE TABLE `project_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `project_users_project_id_key`(`project_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `projects` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `private` BOOLEAN NOT NULL DEFAULT false,
    `password` VARCHAR(191) NULL,
    `type` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `image_url` VARCHAR(255) NULL,
    `image_filename` VARCHAR(191) NULL,
    `one_phrase` VARCHAR(300) NULL,
    `premise` VARCHAR(600) NULL,
    `storyteller` VARCHAR(191) NULL,
    `literary_genre` VARCHAR(191) NULL,
    `subgenre` VARCHAR(191) NULL,
    `ambient` TEXT NULL,
    `count_time` VARCHAR(1000) NULL,
    `historical_fact` TEXT NULL,
    `details` TEXT NULL,
    `sumary` MEDIUMTEXT NULL,
    `url_text` VARCHAR(300) NULL,
    `structure_act_1` MEDIUMTEXT NULL,
    `structure_act_2` MEDIUMTEXT NULL,
    `structure_act_3` MEDIUMTEXT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ProjectUsersToUser` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ProjectUsersToUser_AB_unique`(`A`, `B`),
    INDEX `_ProjectUsersToUser_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_users` ADD CONSTRAINT `project_users_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `projects` ADD CONSTRAINT `projects_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersToUser` ADD CONSTRAINT `_ProjectUsersToUser_A_fkey` FOREIGN KEY (`A`) REFERENCES `project_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ProjectUsersToUser` ADD CONSTRAINT `_ProjectUsersToUser_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
