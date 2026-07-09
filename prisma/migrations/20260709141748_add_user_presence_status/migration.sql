-- CreateEnum
CREATE TYPE "PresencePreferedStatus" AS ENUM ('ONLINE', 'INVISIBLE', 'DO_NOT_DISTURB');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "presenceStatus" "PresencePreferedStatus" NOT NULL DEFAULT 'ONLINE';
