-- CreateEnum
CREATE TYPE "LocalePreference" AS ENUM ('EN', 'FR', 'DE', 'ES', 'IT');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "localePreference" "LocalePreference" NOT NULL DEFAULT 'EN';
