-- CreateTable
CREATE TABLE "TrocaPartido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "candidatoId" TEXT NOT NULL,
    "partidoOrigemId" TEXT NOT NULL,
    "partidoDestinoId" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "motivo" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrocaPartido_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrocaPartido_partidoOrigemId_fkey" FOREIGN KEY ("partidoOrigemId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "TrocaPartido_partidoDestinoId_fkey" FOREIGN KEY ("partidoDestinoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

