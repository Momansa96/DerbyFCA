-- AlterTable
ALTER TABLE "Goal" ADD COLUMN     "assistPlayerId" TEXT;

-- CreateTable
CREATE TABLE "YellowCard" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "minute" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YellowCard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RedCard" (
    "id" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "minute" INTEGER,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RedCard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "YellowCard_matchId_idx" ON "YellowCard"("matchId");

-- CreateIndex
CREATE INDEX "YellowCard_playerId_idx" ON "YellowCard"("playerId");

-- CreateIndex
CREATE INDEX "RedCard_matchId_idx" ON "RedCard"("matchId");

-- CreateIndex
CREATE INDEX "RedCard_playerId_idx" ON "RedCard"("playerId");

-- CreateIndex
CREATE INDEX "Goal_assistPlayerId_idx" ON "Goal"("assistPlayerId");

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_assistPlayerId_fkey" FOREIGN KEY ("assistPlayerId") REFERENCES "Player"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YellowCard" ADD CONSTRAINT "YellowCard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YellowCard" ADD CONSTRAINT "YellowCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedCard" ADD CONSTRAINT "RedCard_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RedCard" ADD CONSTRAINT "RedCard_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
