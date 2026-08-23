/*
  Warnings:

  - Added the required column `updatedAt` to the `PoliticoFavorito` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PoliticoFavorito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "candidatoId" TEXT NOT NULL,
    "notas" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PoliticoFavorito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PoliticoFavorito_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PoliticoFavorito" ("candidatoId", "createdAt", "id", "userId") SELECT "candidatoId", "createdAt", "id", "userId" FROM "PoliticoFavorito";
DROP TABLE "PoliticoFavorito";
ALTER TABLE "new_PoliticoFavorito" RENAME TO "PoliticoFavorito";
CREATE UNIQUE INDEX "PoliticoFavorito_userId_candidatoId_key" ON "PoliticoFavorito"("userId", "candidatoId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
