-- CreateTable
CREATE TABLE "Convencao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partidoId" TEXT NOT NULL,
    "dataPrevista" TEXT,
    "dataRealizada" TEXT,
    "local" TEXT,
    "observacoes" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Convencao_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PreCandidato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partidoId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cargo" TEXT NOT NULL,
    "situacao" TEXT NOT NULL DEFAULT 'PRE_CANDIDATO',
    "origem" TEXT NOT NULL DEFAULT 'manual',
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PreCandidato_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Convencao_partidoId_key" ON "Convencao"("partidoId");

-- CreateIndex
CREATE UNIQUE INDEX "PreCandidato_partidoId_nome_cargo_key" ON "PreCandidato"("partidoId", "nome", "cargo");
