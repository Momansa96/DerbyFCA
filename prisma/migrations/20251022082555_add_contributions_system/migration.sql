-- AlterTable
ALTER TABLE "User" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "ContributionWeek" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "weekStartDate" TIMESTAMP(3) NOT NULL,
    "weekEndDate" TIMESTAMP(3) NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 200,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContributionWeek_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contribution" (
    "id" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "weekId" TEXT NOT NULL,
    "amountPaid" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "recordedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contribution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContributionWeek_year_idx" ON "ContributionWeek"("year");

-- CreateIndex
CREATE INDEX "ContributionWeek_weekStartDate_idx" ON "ContributionWeek"("weekStartDate");

-- CreateIndex
CREATE UNIQUE INDEX "ContributionWeek_year_weekNumber_key" ON "ContributionWeek"("year", "weekNumber");

-- CreateIndex
CREATE INDEX "Contribution_playerId_idx" ON "Contribution"("playerId");

-- CreateIndex
CREATE INDEX "Contribution_weekId_idx" ON "Contribution"("weekId");

-- CreateIndex
CREATE INDEX "Contribution_paymentDate_idx" ON "Contribution"("paymentDate");

-- CreateIndex
CREATE UNIQUE INDEX "Contribution_playerId_weekId_key" ON "Contribution"("playerId", "weekId");

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contribution" ADD CONSTRAINT "Contribution_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "ContributionWeek"("id") ON DELETE CASCADE ON UPDATE CASCADE;
