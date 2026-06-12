/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider]` on the table `AuthProvider` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `gender` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `birthDate` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `displayName` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "UserGender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- DropIndex
DROP INDEX "AuthProvider_provider_providerId_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gender" "UserGender" NOT NULL,
ALTER COLUMN "birthDate" SET NOT NULL,
ALTER COLUMN "displayName" SET NOT NULL;

-- CreateIndex
CREATE INDEX "AuthProvider_provider_providerId_idx" ON "AuthProvider"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "AuthProvider_userId_provider_key" ON "AuthProvider"("userId", "provider");
