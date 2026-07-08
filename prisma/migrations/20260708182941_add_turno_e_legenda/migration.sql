-- CreateTable
CREATE TABLE "VotoLegenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cargoId" TEXT NOT NULL,
    "municipioId" TEXT NOT NULL,
    "partidoId" TEXT NOT NULL,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "votos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VotoLegenda_cargoId_fkey" FOREIGN KEY ("cargoId") REFERENCES "Cargo" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VotoLegenda_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VotoLegenda_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resultado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidatoId" TEXT NOT NULL,
    "municipioId" TEXT NOT NULL,
    "colegioEleitoralId" TEXT,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "votos" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Resultado_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resultado_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resultado_colegioEleitoralId_fkey" FOREIGN KEY ("colegioEleitoralId") REFERENCES "ColegioEleitoral" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Resultado" ("atualizadoEm", "candidatoId", "colegioEleitoralId", "id", "municipioId", "votos") SELECT "atualizadoEm", "candidatoId", "colegioEleitoralId", "id", "municipioId", "votos" FROM "Resultado";
DROP TABLE "Resultado";
ALTER TABLE "new_Resultado" RENAME TO "Resultado";
CREATE UNIQUE INDEX "Resultado_candidatoId_municipioId_colegioEleitoralId_turno_key" ON "Resultado"("candidatoId", "municipioId", "colegioEleitoralId", "turno");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "VotoLegenda_cargoId_municipioId_partidoId_turno_key" ON "VotoLegenda"("cargoId", "municipioId", "partidoId", "turno");
