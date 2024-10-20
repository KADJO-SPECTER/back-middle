-- AlterTable
ALTER TABLE `transaction` ADD COLUMN `status` ENUM('succes', 'echoue', 'en_cours') NOT NULL DEFAULT 'en_cours';
