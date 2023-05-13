-- CreateTable
CREATE TABLE `subscriptions` (
    `id` VARCHAR(191) NOT NULL,
    `subscription_stripe_id` VARCHAR(191) NOT NULL,
    `mode` VARCHAR(191) NOT NULL DEFAULT 'subscription',
    `payment_status` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,
    `expires_at` DATETIME(3) NULL,
    `price_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `subscriptions_id_key`(`id`),
    UNIQUE INDEX `subscriptions_subscription_stripe_id_key`(`subscription_stripe_id`),
    UNIQUE INDEX `subscriptions_user_id_key`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `subscriptions` ADD CONSTRAINT `subscriptions_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
