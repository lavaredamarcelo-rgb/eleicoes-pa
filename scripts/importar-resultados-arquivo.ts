import "server-only";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";
import { importarResultados } from "@/lib/tse/importarResultados";

// Importa um arquivo JSON de votação (linhas no formato votacao_candidato_
// munzona, já agregadas por candidato+município) para a eleição do ano dado.
// Uso: npx tsx -r dotenv/config scripts/importar-resultados-arquivo.ts <ano> <arquivo.json>
const ano = Number(process.argv[2]);
const arquivo = process.argv[3];

async function main() {
  if (!Number.isFinite(ano) || !arquivo) throw new Error("Uso: <ano> <arquivo.json>");
  const eleicao = await prisma.eleicao.findFirst({ where: { ano } });
  if (!eleicao) throw new Error(`Eleição de ${ano} não cadastrada.`);
  const rows = JSON.parse(fs.readFileSync(arquivo, "utf-8"));
  const resumo = await importarResultados(rows, eleicao.id);
  console.log(
    `${ano} (${arquivo}): criados=${resumo.criados} atualizados=${resumo.atualizados} avisos=${resumo.avisos.length}`
  );
  for (const aviso of resumo.avisos.slice(0, 6)) console.log(`  aviso: ${aviso}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
