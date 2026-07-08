import "server-only";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";
import { importarResultados } from "@/lib/tse/importarResultados";

// Importa os votos de Senador (2018/2022) agregados por candidato+município
// a partir do votacao_candidato_munzona do TSE, já filtrados para o PA.
// Uso: npx tsx -r dotenv/config scripts/importar-senador-resultados.ts <dir>
const dir = process.argv[2] ?? ".";
const ANOS = [2018, 2022];

async function main() {
  for (const ano of ANOS) {
    const eleicao = await prisma.eleicao.findFirst({ where: { ano } });
    if (!eleicao) {
      console.log(`${ano}: eleição não cadastrada, pulando.`);
      continue;
    }
    const path = `${dir}/senador_pa_${ano}.json`;
    if (!fs.existsSync(path)) {
      console.log(`${ano}: arquivo ${path} não encontrado, pulando.`);
      continue;
    }
    const rows = JSON.parse(fs.readFileSync(path, "utf-8"));
    const resumo = await importarResultados(rows, eleicao.id);
    console.log(
      `${ano}: criados=${resumo.criados} atualizados=${resumo.atualizados} avisos=${resumo.avisos.length}`
    );
    for (const aviso of resumo.avisos.slice(0, 8)) console.log(`  aviso: ${aviso}`);
  }

  console.log("\nVerificação (votos de senador por ano):");
  const senadores = await prisma.candidato.findMany({
    where: { cargo: { nome: "Senador" }, eleito: true },
    include: { cargo: { include: { eleicao: true } }, resultados: true, partido: true },
  });
  for (const s of senadores) {
    const votos = s.resultados.reduce((sum, r) => sum + r.votos, 0);
    console.log(
      `  ${s.cargo.eleicao.ano} · ${s.nome} (${s.partido.sigla}): ${votos.toLocaleString("pt-BR")} votos · suplentes: ${s.viceNome ?? "—"}`
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
