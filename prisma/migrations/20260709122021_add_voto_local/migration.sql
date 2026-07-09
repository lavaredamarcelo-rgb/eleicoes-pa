-- CreateTable
CREATE TABLE "VotoLocal" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidatoId" TEXT NOT NULL,
    "colegioEleitoralId" TEXT NOT NULL,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "votos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VotoLocal_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VotoLocal_colegioEleitoralId_fkey" FOREIGN KEY ("colegioEleitoralId") REFERENCES "ColegioEleitoral" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "VotoLocal_colegioEleitoralId_idx" ON "VotoLocal"("colegioEleitoralId");

-- CreateIndex
CREATE UNIQUE INDEX "VotoLocal_candidatoId_colegioEleitoralId_turno_key" ON "VotoLocal"("candidatoId", "colegioEleitoralId", "turno");
