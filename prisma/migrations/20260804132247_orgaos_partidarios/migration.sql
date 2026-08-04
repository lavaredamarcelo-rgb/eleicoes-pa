-- AlterTable
ALTER TABLE "Partido" ADD COLUMN "emailEstadualPA" TEXT;
ALTER TABLE "Partido" ADD COLUMN "executivaEstadualPA" TEXT;
ALTER TABLE "Partido" ADD COLUMN "telefoneEstadualPA" TEXT;

-- CreateTable
CREATE TABLE "DirecaoMunicipalPartido" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "partidoId" TEXT NOT NULL,
    "municipioId" TEXT NOT NULL,
    "presidente" TEXT NOT NULL,
    "inicio" TEXT,
    CONSTRAINT "DirecaoMunicipalPartido_partidoId_fkey" FOREIGN KEY ("partidoId") REFERENCES "Partido" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "DirecaoMunicipalPartido_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "DirecaoMunicipalPartido_partidoId_municipioId_key" ON "DirecaoMunicipalPartido"("partidoId", "municipioId");
