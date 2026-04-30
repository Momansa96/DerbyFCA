-- AlterTable
ALTER TABLE "FriendlyMatch" ADD COLUMN     "isInternal" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "FriendlyMatchGoal" ADD COLUMN     "side" TEXT NOT NULL DEFAULT 'HOME';

-- AlterTable
ALTER TABLE "FriendlyMatchPlayer" ADD COLUMN     "side" TEXT NOT NULL DEFAULT 'HOME';
