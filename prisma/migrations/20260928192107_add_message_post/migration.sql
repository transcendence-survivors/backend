-- AlterEnum
ALTER TYPE "ChatMessageType" ADD VALUE 'POST_SHARE';

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "sharedPostId" TEXT;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_sharedPostId_fkey" FOREIGN KEY ("sharedPostId") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
