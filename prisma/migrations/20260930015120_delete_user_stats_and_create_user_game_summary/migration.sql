/*
  Warnings:

  - You are about to drop the `UserStats` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerCount` to the `GameStats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GamePlayerStats" DROP CONSTRAINT "GamePlayerStats_gameStatsId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayerStats" DROP CONSTRAINT "GamePlayerStats_userId_fkey";

-- DropForeignKey
ALTER TABLE "GamePlayerWeaponStats" DROP CONSTRAINT "GamePlayerWeaponStats_gamePlayerStatsId_fkey";

-- DropForeignKey
ALTER TABLE "UserStats" DROP CONSTRAINT "UserStats_userId_fkey";

-- AlterTable
ALTER TABLE "GamePlayerStats" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "GameStats" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "playerCount" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserStats";

-- CreateTable
CREATE TABLE "UserGameSummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalGamesPlayed" INTEGER NOT NULL DEFAULT 0,
    "lastPlayedAt" TIMESTAMP(3),
    "totalKills" INTEGER NOT NULL DEFAULT 0,
    "totalSurvivalTime" INTEGER NOT NULL DEFAULT 0,
    "highestSurvivalTime" INTEGER NOT NULL DEFAULT 0,
    "highestKills" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserGameSummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGameWeaponSummary" (
    "id" TEXT NOT NULL,
    "userGameSummaryId" TEXT NOT NULL,
    "kind" "GameWeaponKind" NOT NULL,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "highestLevel" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserGameWeaponSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameSummary_userId_key" ON "UserGameSummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserGameWeaponSummary_userGameSummaryId_kind_key" ON "UserGameWeaponSummary"("userGameSummaryId", "kind");

-- AddForeignKey
ALTER TABLE "GamePlayerStats" ADD CONSTRAINT "GamePlayerStats_gameStatsId_fkey" FOREIGN KEY ("gameStatsId") REFERENCES "GameStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerStats" ADD CONSTRAINT "GamePlayerStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerWeaponStats" ADD CONSTRAINT "GamePlayerWeaponStats_gamePlayerStatsId_fkey" FOREIGN KEY ("gamePlayerStatsId") REFERENCES "GamePlayerStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameSummary" ADD CONSTRAINT "UserGameSummary_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameWeaponSummary" ADD CONSTRAINT "UserGameWeaponSummary_userGameSummaryId_fkey" FOREIGN KEY ("userGameSummaryId") REFERENCES "UserGameSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
