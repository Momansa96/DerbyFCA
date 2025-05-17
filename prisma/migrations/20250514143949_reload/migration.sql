/*
  Warnings:

  - Added the required column `updatedAt` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "alias" TEXT,
    "bureauRole" TEXT,
    "profilePhoto" TEXT,
    "preferredPosition" TEXT,
    "description" TEXT,
    "number" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIF',
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Player" ("alias", "bureauRole", "description", "email", "fullName", "id", "joinDate", "number", "phone", "preferredPosition", "profilePhoto", "status") SELECT "alias", "bureauRole", "description", "email", "fullName", "id", "joinDate", "number", "phone", "preferredPosition", "profilePhoto", "status" FROM "Player";
DROP TABLE "Player";
ALTER TABLE "new_Player" RENAME TO "Player";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
