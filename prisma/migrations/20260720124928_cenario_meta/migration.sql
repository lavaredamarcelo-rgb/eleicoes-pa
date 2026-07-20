-- CreateTable
CREATE TABLE "CenarioMeta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "cargoId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "candidatoNome" TEXT NOT NULL,
    "partidoId" TEXT,
    "votos" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CenarioMeta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CenarioMeta_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
