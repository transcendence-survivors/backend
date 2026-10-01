-- CreateEnum
CREATE TYPE "TomeKind" AS ENUM ('DAMAGE', 'COOLDOWN', 'AGILITY', 'VITALITY', 'ARMOR', 'BLOOD', 'RANGE', 'SIZE', 'DURATION', 'QUANTITY', 'FORTUNE');

-- CreateTable
CREATE TABLE "GamePlayerTomeStats" (
    "id" TEXT NOT NULL,
    "kind" "TomeKind" NOT NULL,
    "level" INTEGER NOT NULL,
    "gamePlayerStatsId" TEXT,

    CONSTRAINT "GamePlayerTomeStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserGameTomeSummary" (
    "id" TEXT NOT NULL,
    "userGameSummaryId" TEXT NOT NULL,
    "kind" "TomeKind" NOT NULL,
    "timesUsed" INTEGER NOT NULL DEFAULT 0,
    "highestLevel" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserGameTomeSummary_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserGameTomeSummary_userGameSummaryId_kind_key" ON "UserGameTomeSummary"("userGameSummaryId", "kind");

-- AddForeignKey
ALTER TABLE "GamePlayerTomeStats" ADD CONSTRAINT "GamePlayerTomeStats_gamePlayerStatsId_fkey" FOREIGN KEY ("gamePlayerStatsId") REFERENCES "GamePlayerStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGameTomeSummary" ADD CONSTRAINT "UserGameTomeSummary_userGameSummaryId_fkey" FOREIGN KEY ("userGameSummaryId") REFERENCES "UserGameSummary"("id") ON DELETE CASCADE ON UPDATE CASCADE;
