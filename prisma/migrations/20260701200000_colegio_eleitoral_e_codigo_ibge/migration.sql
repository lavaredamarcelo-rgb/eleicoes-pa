-- AlterTable
ALTER TABLE "Municipio" ADD COLUMN "codigoIbge" TEXT;

-- CreateTable
CREATE TABLE "ColegioEleitoral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "codigoTse" TEXT,
    "municipioId" TEXT NOT NULL,
    CONSTRAINT "ColegioEleitoral_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Resultado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidatoId" TEXT NOT NULL,
    "municipioId" TEXT NOT NULL,
    "colegioEleitoralId" TEXT,
    "votos" INTEGER NOT NULL DEFAULT 0,
    "atualizadoEm" DATETIME NOT NULL,
    CONSTRAINT "Resultado_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resultado_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Resultado_colegioEleitoralId_fkey" FOREIGN KEY ("colegioEleitoralId") REFERENCES "ColegioEleitoral" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Resultado" ("atualizadoEm", "candidatoId", "id", "municipioId", "votos") SELECT "atualizadoEm", "candidatoId", "id", "municipioId", "votos" FROM "Resultado";
DROP TABLE "Resultado";
ALTER TABLE "new_Resultado" RENAME TO "Resultado";
CREATE UNIQUE INDEX "Resultado_candidatoId_municipioId_colegioEleitoralId_key" ON "Resultado"("candidatoId", "municipioId", "colegioEleitoralId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ColegioEleitoral_codigoTse_key" ON "ColegioEleitoral"("codigoTse");

-- CreateIndex
CREATE UNIQUE INDEX "Municipio_codigoIbge_key" ON "Municipio"("codigoIbge");

