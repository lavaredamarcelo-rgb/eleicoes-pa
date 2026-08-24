import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  try {
    const count = await prisma.candidato.count();
    if (count > 100) {
      console.log(`✅ Banco já tem ${count} candidatos. Pulando seed.`);
      return;
    }

    const sqlFile = path.join(__dirname, '../import-candidatos.sql');
    if (!fs.existsSync(sqlFile)) {
      console.log('⚠️  Arquivo não encontrado.');
      return;
    }

    console.log('📝 Lendo SQL...');
    const sql = fs.readFileSync(sqlFile, 'utf-8');
    const statements = sql.split(';').filter(s => s.trim());

    console.log(`📦 Importando ${statements.length} statements...`);

    for (const stmt of statements) {
      if (stmt.trim()) {
        await prisma.$executeRawUnsafe(stmt);
      }
    }

    const finalCount = await prisma.candidato.count();
    console.log(`✅ ${finalCount} candidatos importados.`);
  } catch (e) {
    console.error('❌ Erro:', e);
    process.exit(1);
  }
}

main().then(async () => {
  await prisma.$disconnect();
}).catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
