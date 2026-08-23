-- CreateTable
CREATE TABLE "PoliticoFavorito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PoliticoFavorito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PoliticoFavorito_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PoliticoFavorito_userId_candidatoId_key" ON "PoliticoFavorito"("userId", "candidatoId");
