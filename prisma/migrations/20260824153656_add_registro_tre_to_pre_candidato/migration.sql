/*
  Warnings:

  - Added the required column `updatedAt` to the `PreCandidato` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PreCandidato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partidoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'PRE_CANDIDATO',
    "origem" TEXT NOT NULL DEFAULT 'manual',
    "observacoes" TEXT,
    "registroTRE" BOOLEAN,
    "dataRegistroTRE" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PreCandidato_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PreCandidato" ("cargo", "createdAt", "id", "nome", "observacoes", "origem", "partidoId", "situacao", "updatedAt") SELECT "cargo", "createdAt", "id", "nome", "observacoes", "origem", "partidoId", "situacao", CURRENT_TIMESTAMP FROM "PreCandidato";
DROP TABLE "PreCandidato";
ALTER TABLE "new_PreCandidato" RENAME TO "PreCandidato";
CREATE UNIQUE INDEX "PreCandidato_partidoId_nome_cargo_key" ON "PreCandidato"("partidoId", "nome", "cargo");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
