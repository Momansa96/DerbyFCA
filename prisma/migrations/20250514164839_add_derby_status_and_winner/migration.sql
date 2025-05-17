-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Derby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "team1Id" TEXT NOT NULL,
    "team2Id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "winnerId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Derby_team1Id_fkey" FOREIGN KEY ("team1Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Derby_team2Id_fkey" FOREIGN KEY ("team2Id") REFERENCES "Team" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Derby" ("createdAt", "id", "team1Id", "team2Id", "updatedAt") SELECT "createdAt", "id", "team1Id", "team2Id", "updatedAt" FROM "Derby";
DROP TABLE "Derby";
ALTER TABLE "new_Derby" RENAME TO "Derby";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
