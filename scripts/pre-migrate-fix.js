// Limpa estado sujo deixado por migracao falhada (24/08) antes do migrate deploy.
// Idempotente e nunca falha o start.
const fs = require('fs');

try {
  const dbPath = '/data/prod.db';
  if (!fs.existsSync(dbPath)) {
    console.log('[fix-migration] sem banco de producao - pulando.');
    process.exit(0);
  }
  const Database = require('better-sqlite3');
  const db = new Database(dbPath);
  db.exec('DROP TABLE IF EXISTS new_PreCandidato');
  const r = db
    .prepare(
      "DELETE FROM _prisma_migrations WHERE migration_name = ? AND finished_at IS NULL"
    )
    .run('20260824153656_add_registro_tre_to_pre_candidato');
  db.close();
  console.log('[fix-migration] OK - registros de falha removidos:', r.changes);
} catch (e) {
  console.error('[fix-migration] erro (start continua):', e.message);
}
process.exit(0);
