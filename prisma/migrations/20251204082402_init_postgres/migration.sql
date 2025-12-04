-- CreateTable
CREATE TABLE "TabSet" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "htmlCode" TEXT NOT NULL,
    "jsCode" TEXT NOT NULL,

    CONSTRAINT "TabSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscapeRoom" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "backgroundImage" TEXT NOT NULL,
    "timerSeconds" INTEGER NOT NULL DEFAULT 300,
    "puzzles" JSONB NOT NULL,

    CONSTRAINT "EscapeRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameProgress" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "roomId" TEXT,
    "currentStage" INTEGER NOT NULL DEFAULT 0,
    "timeLeft" INTEGER NOT NULL DEFAULT 300,

    CONSTRAINT "GameProgress_pkey" PRIMARY KEY ("id")
);
