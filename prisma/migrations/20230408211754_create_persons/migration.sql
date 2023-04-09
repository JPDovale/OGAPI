-- AlterTable
ALTER TABLE `comments` ADD COLUMN `appearance_id` VARCHAR(191) NULL,
    ADD COLUMN `couple_id` VARCHAR(191) NULL,
    ADD COLUMN `dream_id` VARCHAR(191) NULL,
    ADD COLUMN `fear_id` VARCHAR(191) NULL,
    ADD COLUMN `objective_id` VARCHAR(191) NULL,
    ADD COLUMN `personality_id` VARCHAR(191) NULL,
    ADD COLUMN `power_id` VARCHAR(191) NULL,
    ADD COLUMN `trauma_id` VARCHAR(191) NULL,
    ADD COLUMN `value_id` VARCHAR(191) NULL,
    ADD COLUMN `wishe_id` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `parsons` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `last_name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `history` MEDIUMTEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `image_filename` VARCHAR(191) NOT NULL,
    `image_url` VARCHAR(500) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `project_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objectives` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `it_be_realized` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `avoiders_id` INTEGER NOT NULL,
    `supporters_id` INTEGER NOT NULL,

    UNIQUE INDEX `objectives_avoiders_id_key`(`avoiders_id`),
    UNIQUE INDEX `objectives_supporters_id_key`(`supporters_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objective_avoiders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `objective_supporters` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personalities` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consequences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itle` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `personality_id` VARCHAR(191) NULL,
    `trauma_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `appearences` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dreams` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `fears` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `powers` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `couples` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `until_end` BOOLEAN NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `couple_with_person_id` INTEGER NOT NULL,

    UNIQUE INDEX `couples_couple_with_person_id_key`(`couple_with_person_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `couples_withs_persons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `person_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `values` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `exceptions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itle` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `value_id` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `wishes` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `traumas` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(500) NOT NULL,
    `description` TEXT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToPersonality` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToPersonality_AB_unique`(`A`, `B`),
    INDEX `_PersonToPersonality_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToPower` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToPower_AB_unique`(`A`, `B`),
    INDEX `_PersonToPower_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToValue` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToValue_AB_unique`(`A`, `B`),
    INDEX `_PersonToValue_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToWishe` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToWishe_AB_unique`(`A`, `B`),
    INDEX `_PersonToWishe_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PersonToTrauma` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_PersonToTrauma_AB_unique`(`A`, `B`),
    INDEX `_PersonToTrauma_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ObjectiveToPerson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ObjectiveToPerson_AB_unique`(`A`, `B`),
    INDEX `_ObjectiveToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ObjectiveAvoidersToPerson` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ObjectiveAvoidersToPerson_AB_unique`(`A`, `B`),
    INDEX `_ObjectiveAvoidersToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_ObjectiveSupportersToPerson` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_ObjectiveSupportersToPerson_AB_unique`(`A`, `B`),
    INDEX `_ObjectiveSupportersToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AppearanceToPerson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AppearanceToPerson_AB_unique`(`A`, `B`),
    INDEX `_AppearanceToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DreamToPerson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_DreamToPerson_AB_unique`(`A`, `B`),
    INDEX `_DreamToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_FearToPerson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_FearToPerson_AB_unique`(`A`, `B`),
    INDEX `_FearToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CoupleToPerson` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CoupleToPerson_AB_unique`(`A`, `B`),
    INDEX `_CoupleToPerson_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_objective_id_fkey` FOREIGN KEY (`objective_id`) REFERENCES `objectives`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_personality_id_fkey` FOREIGN KEY (`personality_id`) REFERENCES `personalities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_appearance_id_fkey` FOREIGN KEY (`appearance_id`) REFERENCES `appearences`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_dream_id_fkey` FOREIGN KEY (`dream_id`) REFERENCES `dreams`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_fear_id_fkey` FOREIGN KEY (`fear_id`) REFERENCES `fears`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_power_id_fkey` FOREIGN KEY (`power_id`) REFERENCES `powers`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_couple_id_fkey` FOREIGN KEY (`couple_id`) REFERENCES `couples`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `values`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_wishe_id_fkey` FOREIGN KEY (`wishe_id`) REFERENCES `wishes`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `comments` ADD CONSTRAINT `comments_trauma_id_fkey` FOREIGN KEY (`trauma_id`) REFERENCES `traumas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parsons` ADD CONSTRAINT `parsons_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `parsons` ADD CONSTRAINT `parsons_project_id_fkey` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_avoiders_id_fkey` FOREIGN KEY (`avoiders_id`) REFERENCES `objective_avoiders`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `objectives` ADD CONSTRAINT `objectives_supporters_id_fkey` FOREIGN KEY (`supporters_id`) REFERENCES `objective_supporters`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consequences` ADD CONSTRAINT `consequences_personality_id_fkey` FOREIGN KEY (`personality_id`) REFERENCES `personalities`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `consequences` ADD CONSTRAINT `consequences_trauma_id_fkey` FOREIGN KEY (`trauma_id`) REFERENCES `traumas`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples` ADD CONSTRAINT `couples_couple_with_person_id_fkey` FOREIGN KEY (`couple_with_person_id`) REFERENCES `couples_withs_persons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `couples_withs_persons` ADD CONSTRAINT `couples_withs_persons_person_id_fkey` FOREIGN KEY (`person_id`) REFERENCES `parsons`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `exceptions` ADD CONSTRAINT `exceptions_value_id_fkey` FOREIGN KEY (`value_id`) REFERENCES `values`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPersonality` ADD CONSTRAINT `_PersonToPersonality_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPersonality` ADD CONSTRAINT `_PersonToPersonality_B_fkey` FOREIGN KEY (`B`) REFERENCES `personalities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPower` ADD CONSTRAINT `_PersonToPower_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToPower` ADD CONSTRAINT `_PersonToPower_B_fkey` FOREIGN KEY (`B`) REFERENCES `powers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToValue` ADD CONSTRAINT `_PersonToValue_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToValue` ADD CONSTRAINT `_PersonToValue_B_fkey` FOREIGN KEY (`B`) REFERENCES `values`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToWishe` ADD CONSTRAINT `_PersonToWishe_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToWishe` ADD CONSTRAINT `_PersonToWishe_B_fkey` FOREIGN KEY (`B`) REFERENCES `wishes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTrauma` ADD CONSTRAINT `_PersonToTrauma_A_fkey` FOREIGN KEY (`A`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_PersonToTrauma` ADD CONSTRAINT `_PersonToTrauma_B_fkey` FOREIGN KEY (`B`) REFERENCES `traumas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveToPerson` ADD CONSTRAINT `_ObjectiveToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `objectives`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveToPerson` ADD CONSTRAINT `_ObjectiveToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveAvoidersToPerson` ADD CONSTRAINT `_ObjectiveAvoidersToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `objective_avoiders`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveAvoidersToPerson` ADD CONSTRAINT `_ObjectiveAvoidersToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveSupportersToPerson` ADD CONSTRAINT `_ObjectiveSupportersToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `objective_supporters`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_ObjectiveSupportersToPerson` ADD CONSTRAINT `_ObjectiveSupportersToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppearanceToPerson` ADD CONSTRAINT `_AppearanceToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `appearences`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AppearanceToPerson` ADD CONSTRAINT `_AppearanceToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DreamToPerson` ADD CONSTRAINT `_DreamToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `dreams`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DreamToPerson` ADD CONSTRAINT `_DreamToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FearToPerson` ADD CONSTRAINT `_FearToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `fears`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_FearToPerson` ADD CONSTRAINT `_FearToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoupleToPerson` ADD CONSTRAINT `_CoupleToPerson_A_fkey` FOREIGN KEY (`A`) REFERENCES `couples`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoupleToPerson` ADD CONSTRAINT `_CoupleToPerson_B_fkey` FOREIGN KEY (`B`) REFERENCES `parsons`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
