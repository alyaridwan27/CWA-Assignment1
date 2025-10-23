-- CreateTable
CREATE TABLE "TabSet" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "htmlCode" TEXT NOT NULL,
    "jsCode" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "GameProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "currentStage" INTEGER NOT NULL DEFAULT 0,
    "timeLeft" INTEGER NOT NULL DEFAULT 300
);

-- CreateIndex
CREATE UNIQUE INDEX "GameProgress_userId_key" ON "GameProgress"("userId");
