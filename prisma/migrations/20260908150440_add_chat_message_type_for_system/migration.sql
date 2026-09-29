-- CreateEnum
CREATE TYPE "ChatMessageType" AS ENUM ('TEXT', 'JOINED', 'LEFT', 'KICKED', 'ROLE_UPDATED', 'OWNERSHIP_TRANSFERRED', 'ROOM_CREATED', 'ROOM_RENAMED', 'ROOM_AVATAR_CHANGED');

-- DropForeignKey
ALTER TABLE "ChatMessage" DROP CONSTRAINT "ChatMessage_senderId_fkey";

-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "type" "ChatMessageType" NOT NULL DEFAULT 'TEXT',
ALTER COLUMN "senderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ChatMessageMetadata" (
    "id" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "targetUserId" TEXT,
    "oldRole" "ChatMemberRole",
    "newRole" "ChatMemberRole",
    "oldValue" TEXT,
    "newValue" TEXT,

    CONSTRAINT "ChatMessageMetadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatMessageMetadata_messageId_key" ON "ChatMessageMetadata"("messageId");

-- CreateIndex
CREATE INDEX "ChatMessageMetadata_targetUserId_idx" ON "ChatMessageMetadata"("targetUserId");

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageMetadata" ADD CONSTRAINT "ChatMessageMetadata_targetUserId_fkey" FOREIGN KEY ("targetUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatMessageMetadata" ADD CONSTRAINT "ChatMessageMetadata_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;
