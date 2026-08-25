// Restaura o banco de producao a partir do backup embarcado no repo.
// Roda uma unica vez (marker em /data). Nunca falha o start.
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

try {
  const dataDir = '/data';
  if (!fs.existsSync(dataDir)) {
    console.log('[restore] /data nao existe (ambiente local) - pulando.');
    process.exit(0);
  }
  const marker = path.join(dataDir, '.restore-20260825-done');
  if (fs.existsSync(marker)) {
    console.log('[restore] ja restaurado anteriormente - pulando.');
    process.exit(0);
  }
  const gzPath = path.join(__dirname, '..', 'prisma', 'prod-restore.db.gz');
  if (!fs.existsSync(gzPath)) {
    console.log('[restore] arquivo de backup nao encontrado - pulando.');
    process.exit(0);
  }
  const target = path.join(dataDir, 'prod.db');
  if (fs.existsSync(target)) {
    fs.copyFileSync(target, target + '.pre-restore');
    console.log('[restore] banco atual salvo como prod.db.pre-restore');
  }
  console.log('[restore] descompactando backup...');
  const buf = zlib.gunzipSync(fs.readFileSync(gzPath));
  fs.writeFileSync(target, buf);
  fs.writeFileSync(marker, new Date().toISOString());
  console.log('[restore] OK! Banco restaurado (' + Math.round(buf.length / 1e6) + ' MB).');
} catch (e) {
  console.error('[restore] erro (start continua):', e.message);
}
process.exit(0);
