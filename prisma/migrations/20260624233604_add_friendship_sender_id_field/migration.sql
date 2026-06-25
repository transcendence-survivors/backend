/*
  Warnings:

  - Added the required column `senderId` to the `Friendship` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Friendship" ADD COLUMN     "senderId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Friendship_senderId_idx" ON "Friendship"("senderId");
