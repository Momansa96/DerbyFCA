-- AlterTable
ALTER TABLE "FriendlyMatch" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "opponentScore" INTEGER,
ADD COLUMN     "ourScore" INTEGER,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'SCHEDULED',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "FriendlyMatchPlayer" (
    "id" TEXT NOT NULL,
    "friendlyMatchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendlyMatchPlayer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FriendlyMatchGoal" (
    "id" TEXT NOT NULL,
    "friendlyMatchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "assistPlayerId" TEXT,
    "minute" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FriendlyMatchGoal_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "FriendlyMatchPlayer_friendlyMatchId_idx" ON "FriendlyMatchPlayer"("friendlyMatchId");

-- CreateIndex
CREATE INDEX "FriendlyMatchPlayer_playerId_idx" ON "FriendlyMatchPlayer"("playerId");

-- CreateIndex
CREATE UNIQUE INDEX "FriendlyMatchPlayer_friendlyMatchId_playerId_key" ON "FriendlyMatchPlayer"("friendlyMatchId", "playerId");

-- CreateIndex
CREATE INDEX "FriendlyMatchGoal_friendlyMatchId_idx" ON "FriendlyMatchGoal"("friendlyMatchId");

-- CreateIndex
CREATE INDEX "FriendlyMatchGoal_playerId_idx" ON "FriendlyMatchGoal"("playerId");

-- CreateIndex
CREATE INDEX "FriendlyMatchGoal_assistPlayerId_idx" ON "FriendlyMatchGoal"("assistPlayerId");

-- AddForeignKey
ALTER TABLE "FriendlyMatchPlayer" ADD CONSTRAINT "FriendlyMatchPlayer_friendlyMatchId_fkey" FOREIGN KEY ("friendlyMatchId") REFERENCES "FriendlyMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendlyMatchPlayer" ADD CONSTRAINT "FriendlyMatchPlayer_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendlyMatchGoal" ADD CONSTRAINT "FriendlyMatchGoal_friendlyMatchId_fkey" FOREIGN KEY ("friendlyMatchId") REFERENCES "FriendlyMatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendlyMatchGoal" ADD CONSTRAINT "FriendlyMatchGoal_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendlyMatchGoal" ADD CONSTRAINT "FriendlyMatchGoal_assistPlayerId_fkey" FOREIGN KEY ("assistPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;
