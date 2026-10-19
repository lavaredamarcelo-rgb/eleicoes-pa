-- Recursos publicos dos partidos (FEFC e Fundo Partidario), por ano.
CREATE TABLE "PartidoFundo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partidoId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "fonte" TEXT,
    CONSTRAINT "PartidoFundo_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "PartidoFundo_partidoId_ano_tipo_key" ON "PartidoFundo"("partidoId", "ano", "tipo");
