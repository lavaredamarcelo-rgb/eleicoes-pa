-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'COORDENADOR',
    "regiaoId" TEXT,
    "candidatoId" TEXT,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" DATETIME,
    "criadoPorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_regiaoId_fkey" FOREIGN KEY ("regiaoId") REFERENCES "Regiao" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_candidatoId_fkey" FOREIGN KEY ("candidatoId") REFERENCES "Candidato" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "User_criadoPorId_fkey" FOREIGN KEY ("criadoPorId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("candidatoId", "createdAt", "email", "id", "nome", "passwordHash", "regiaoId", "role") SELECT "candidatoId", "createdAt", "email", "id", "nome", "passwordHash", "regiaoId", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

