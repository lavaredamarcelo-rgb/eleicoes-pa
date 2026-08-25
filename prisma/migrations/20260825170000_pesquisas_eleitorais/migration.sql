-- CreateTable
CREATE TABLE "PesquisaEleitoral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "disputa" TEXT NOT NULL,
    "turno" INTEGER NOT NULL DEFAULT 1,
    "tipo" TEXT NOT NULL DEFAULT 'estimulada',
    "cenario" TEXT,
    "instituto" TEXT NOT NULL,
    "contratante" TEXT,
    "registroTSE" TEXT,
    "linkRegistro" TEXT,
    "linkMateria" TEXT,
    "dataCampoInicio" DATETIME,
    "dataCampoFim" DATETIME,
    "dataDivulgacao" DATETIME NOT NULL,
    "amostra" INTEGER,
    "margemErro" REAL,
    "confianca" REAL,
    "observacoes" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PesquisaResultado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pesquisaId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "partido" TEXT,
    "percentual" REAL NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "PesquisaResultado_pesquisaId_fkey" FOREIGN KEY ("pesquisaId") REFERENCES "PesquisaEleitoral" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
