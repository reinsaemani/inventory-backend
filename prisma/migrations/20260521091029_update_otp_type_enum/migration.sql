/*
  Warnings:

  - The values [LOGIN,RESET_PASSWORD] on the enum `otps_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `otps` MODIFY `type` ENUM('EMAIL_VERIFICATION', 'LOGIN_VERIFICATION', 'PASSWORD_SETUP') NOT NULL;
