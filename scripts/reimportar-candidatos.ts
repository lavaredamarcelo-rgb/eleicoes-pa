import "server-only";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";
import { importarCandidatos } from "@/lib/tse/importarCandidatos";

// Reimporta os candidatos do TSE (arquivos consulta_cand já filtrados para
// o PA, em JSON) para preencher flag de eleito, vices/suplentes e o cargo
// de Senador. Uso: npx tsx -r dotenv/config scripts/reimportar-candidatos.ts <dir>
const dir = process.argv[2] ?? ".";
const ANOS = [2018, 2020, 2022, 2024];

async function main() {
  for (const ano of ANOS) {
    const eleicao = await prisma.eleicao.findFirst({ where: { ano } });
    if (!eleicao) {
      console.log(`${ano}: eleição não cadastrada, pulando.`);
      continue;
    }
    const path = `${dir}/candidatos_pa_${ano}.json`;
    if (!fs.existsSync(path)) {
      console.log(`${ano}: arquivo ${path} não encontrado, pulando.`);
      continue;
    }
    const rows = JSON.parse(fs.readFileSync(path, "utf-8"));
    const resumo = await importarCandidatos(rows, eleicao.id);
    console.log(
      `${ano}: criados=${resumo.criados} atualizados=${resumo.atualizados} avisos=${resumo.avisos.length}`
    );
    const relevantes = resumo.avisos.filter((a) => !a.includes("não suportado"));
    for (const aviso of relevantes.slice(0, 8)) console.log(`  aviso: ${aviso}`);
  }

  console.log("\nVerificação:");
  console.log("eleitos:", await prisma.candidato.count({ where: { eleito: true } }));
  console.log(
    "senadores:",
    await prisma.candidato.count({ where: { cargo: { nome: "Senador" } } })
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
