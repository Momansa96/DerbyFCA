-- CreateTable
CREATE TABLE "Player" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "alias" TEXT,
    "bureauRole" TEXT,
    "profilePhoto" TEXT,
    "preferredPosition" TEXT,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIF',
    "joinDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "phone" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
