-- Compacta VotoLocal: id numérico (rowid) no lugar do cuid de 25 chars e
-- um único índice composto começando por colegioEleitoralId (atende as
-- consultas por local e a unicidade). Os dados existentes são preservados:
-- copiados sem o id antigo, que é reatribuído sequencialmente.
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_VotoLocal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "candidatoId" TEXT NOT NULL,
    "colegioEleitoralId" TEXT NOT NULL,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "votos" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "VotoLocal_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "VotoLocal_colegioEleitoralId_fkey" FOREIGN KEY ("colegioEleitoralId") REFERENCES "ColegioEleitoral" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

INSERT INTO "new_VotoLocal" ("candidatoId", "colegioEleitoralId", "turno", "votos")
SELECT "candidatoId", "colegioEleitoralId", "turno", "votos" FROM "VotoLocal";

DROP TABLE "VotoLocal";
ALTER TABLE "new_VotoLocal" RENAME TO "VotoLocal";

CREATE UNIQUE INDEX "VotoLocal_colegioEleitoralId_candidatoId_turno_key"
  ON "VotoLocal"("colegioEleitoralId", "candidatoId", "turno");

PRAGMA foreign_keys=ON;
