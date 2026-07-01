-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Cargo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "tipoApuracao" TEXT NOT NULL,
    "vagas" INTEGER NOT NULL DEFAULT 1,
    "eleicaoId" TEXT NOT NULL,
    "municipioId" TEXT,
    CONSTRAINT "Cargo_eleicaoId_fkey" FOREIGN KEY ("eleicaoId") REFERENCES "Eleicao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Cargo_municipioId_fkey" FOREIGN KEY ("municipioId") REFERENCES "Municipio" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Cargo" ("eleicaoId", "id", "nome", "tipoApuracao", "vagas") SELECT "eleicaoId", "id", "nome", "tipoApuracao", "vagas" FROM "Cargo";
DROP TABLE "Cargo";
ALTER TABLE "new_Cargo" RENAME TO "Cargo";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
