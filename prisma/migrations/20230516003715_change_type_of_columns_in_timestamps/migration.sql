-- AlterTable
ALTER TABLE `persons` MODIFY `born_date_timestamp` BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `projects` MODIFY `initial_date_timestamp` BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `scenes` MODIFY `happened_date_timestamp` BIGINT NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `time_events` MODIFY `happened_date_timestamp` BIGINT NOT NULL;
