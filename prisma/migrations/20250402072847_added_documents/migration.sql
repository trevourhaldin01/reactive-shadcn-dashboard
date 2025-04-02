-- CreateTable
CREATE TABLE "Documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "header" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "limit" TEXT NOT NULL,
    "reviewer" TEXT NOT NULL
);
