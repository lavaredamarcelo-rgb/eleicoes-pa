-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Candidato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "cargoId" TEXT NOT NULL,
    "partidoId" TEXT NOT NULL,
    "viceNome" TEXT,
    "viceNumero" INTEGER,
    "eleito" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Candidato_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Candidato_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Candidato" ("cargoId", "id", "nome", "numero", "partidoId", "viceNome", "viceNumero") SELECT "cargoId", "id", "nome", "numero", "partidoId", "viceNome", "viceNumero" FROM "Candidato";
DROP TABLE "Candidato";
ALTER TABLE "new_Candidato" RENAME TO "Candidato";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
