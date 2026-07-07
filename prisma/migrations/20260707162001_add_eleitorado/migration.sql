-- CreateTable
CREATE TABLE "Eleitorado" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "municipioId" TEXT NOT NULL,
    "ano" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    CONSTRAINT "Eleitorado_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Eleitorado_municipioId_ano_key" ON "Eleitorado"("municipioId", "ano");
