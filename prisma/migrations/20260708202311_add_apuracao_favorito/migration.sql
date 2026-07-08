-- CreateTable
CREATE TABLE "ApuracaoFavorito" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "rotulo" TEXT NOT NULL,
    "ano" TEXT NOT NULL,
    "eleicaoCd" TEXT NOT NULL,
    "cargoCd" TEXT NOT NULL,
    "municipioTse" TEXT,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ApuracaoFavorito_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ApuracaoFavorito_userId_eleicaoCd_cargoCd_municipioTse_key" ON "ApuracaoFavorito"("userId", "eleicaoCd", "cargoCd", "municipioTse");
