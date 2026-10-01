/*
  Warnings:

  - Changed the type of `kind` on the `GamePlayerTomeStats` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `kind` on the `UserGameTomeSummary` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GameTomeKind" AS ENUM ('DAMAGE', 'COOLDOWN', 'AGILITY', 'VITALITY', 'ARMOR', 'BLOOD', 'RANGE', 'SIZE', 'DURATION', 'QUANTITY', 'FORTUNE');

-- AlterTable
ALTER TABLE "GamePlayerTomeStats" DROP COLUMN "kind",
ADD COLUMN     "kind" "GameTomeKind" NOT NULL;

-- AlterTable
ALTER TABLE "UserGameTomeSummary" DROP COLUMN "kind",
ADD COLUMN     "kind" "GameTomeKind" NOT NULL;

-- DropEnum
DROP TYPE "TomeKind";

-- CreateIndex
CREATE UNIQUE INDEX "UserGameTomeSummary_userGameSummaryId_kind_key" ON "UserGameTomeSummary"("userGameSummaryId", "kind");
