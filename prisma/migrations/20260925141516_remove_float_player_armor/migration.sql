/*
  Warnings:

  - You are about to alter the column `armor` on the `GamePlayerStats` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "GamePlayerStats" ALTER COLUMN "armor" SET DATA TYPE INTEGER;
