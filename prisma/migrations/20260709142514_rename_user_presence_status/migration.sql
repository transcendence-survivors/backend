/*
  Warnings:

  - You are about to drop the column `presenceStatus` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "presenceStatus",
ADD COLUMN     "preferedPresenceStatus" "PresencePreferedStatus" NOT NULL DEFAULT 'ONLINE';
