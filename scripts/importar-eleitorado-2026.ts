// Importa o eleitorado apto oficial de 2026 (TSE, eleitorado_local_votacao
// de 17/07/2026, agregado por município em src/data/eleitorado-2026-pa.json).
// Uso: DATABASE_URL="file:./dev.db" npx tsx scripts/importar-eleitorado-2026.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { importarEleitorado } from "../src/lib/tse/importarEleitorado";

async function main() {
  const arquivo = join(__dirname, "..", "src", "data", "eleitorado-2026-pa.json");
  const rows = JSON.parse(readFileSync(arquivo, "utf-8"));
  const resumo = await importarEleitorado(rows, 2026);
  console.log(
    `Eleitorado 2026: criados=${resumo.criados} atualizados=${resumo.atualizados} avisos=${resumo.avisos.length}`
  );
  for (const aviso of resumo.avisos.slice(0, 8)) console.log(`  aviso: ${aviso}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
