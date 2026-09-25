-- CreateEnum
CREATE TYPE "GameWeaponKind" AS ENUM ('AURA', 'STAFF', 'BOW', 'SWORD', 'AXE');

-- CreateTable
CREATE TABLE "GameStats" (
    "id" TEXT NOT NULL,
    "survivalTime" INTEGER NOT NULL,
    "totalKills" INTEGER NOT NULL,

    CONSTRAINT "GameStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayerStats" (
    "id" TEXT NOT NULL,
    "maxHealth" INTEGER NOT NULL,
    "attackSpeed" DOUBLE PRECISION NOT NULL,
    "moveSpeed" DOUBLE PRECISION NOT NULL,
    "attackDamage" INTEGER NOT NULL,
    "armor" DOUBLE PRECISION NOT NULL,
    "luck" INTEGER NOT NULL,
    "killAmount" INTEGER NOT NULL,
    "lifesteal" INTEGER NOT NULL,
    "range" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "penetration" DOUBLE PRECISION NOT NULL,
    "gameStatsId" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "GamePlayerStats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GamePlayerWeaponStats" (
    "id" TEXT NOT NULL,
    "kind" "GameWeaponKind" NOT NULL,
    "level" INTEGER NOT NULL,
    "gamePlayerStatsId" TEXT,

    CONSTRAINT "GamePlayerWeaponStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GamePlayerStats" ADD CONSTRAINT "GamePlayerStats_gameStatsId_fkey" FOREIGN KEY ("gameStatsId") REFERENCES "GameStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerStats" ADD CONSTRAINT "GamePlayerStats_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GamePlayerWeaponStats" ADD CONSTRAINT "GamePlayerWeaponStats_gamePlayerStatsId_fkey" FOREIGN KEY ("gamePlayerStatsId") REFERENCES "GamePlayerStats"("id") ON DELETE SET NULL ON UPDATE CASCADE;
