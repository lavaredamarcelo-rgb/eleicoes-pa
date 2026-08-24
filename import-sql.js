const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

async function importarDados() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Conectando ao banco...');
    await pool.connect();
    console.log('✅ Conectado!');

    const sqlFile = path.join(__dirname, 'import-candidatos.sql');
    const sql = fs.readFileSync(sqlFile, 'utf-8');

    console.log('Executando SQL...');
    const result = await pool.query(sql);
    console.log('✅ Importação concluída!');
    console.log(`Registros afetados: ${result.rowCount}`);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

importarDados();
