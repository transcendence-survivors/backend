/*
  Warnings:

  - You are about to drop the `Repost` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PostType" AS ENUM ('POST', 'REPLY', 'QUOTE', 'REPOST');

-- DropForeignKey
ALTER TABLE "Repost" DROP CONSTRAINT "Repost_postId_fkey";

-- DropForeignKey
ALTER TABLE "Repost" DROP CONSTRAINT "Repost_userId_fkey";

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "type" "PostType" NOT NULL DEFAULT 'POST';

-- DropTable
DROP TABLE "Repost";

-- CreateIndex
CREATE UNIQUE INDEX "Post_authorId_quotedPostId_repost_unique"
ON "Post" ("authorId", "quotedPostId")
WHERE "type" = 'REPOST';
