// Preenche Partido.presidenteEstadualPA com os presidentes dos órgãos
// estaduais do Pará extraídos do SGIP/TSE (dados abertos "órgãos
// partidários", gerados em 01/08/2026 e agregados em
// src/data/presidentes-estaduais-pa.json). Órgãos sem vigência atual
// entram com a marcação "(registro SGIP encerrado)". Idempotente.
// Uso: DATABASE_URL="file:./dev.db" npx tsx scripts/atualizar-presidentes-estaduais.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

type Registro = {
  sigla: string;
  numero: number | null;
  presidente: string;
  vigente: boolean;
  inicio: string;
  orgao: string;
};

async function main() {
  const arquivo = join(__dirname, "..", "src", "data", "presidentes-estaduais-pa.json");
  const registros: Registro[] = JSON.parse(readFileSync(arquivo, "utf-8"));

  const partidos = await prisma.partido.findMany();
  // A sigla decide primeiro: siglas antigas (PMDB, PR, PRP…) convivem no
  // banco com o MESMO número das atuais, então o número só serve de
  // reserva quando a sigla do SGIP não existe aqui.
  const normalizar = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const porSigla = new Map(partidos.map((p) => [normalizar(p.sigla), p]));
  const porNumero = new Map(partidos.map((p) => [p.numero, p]));

  // Recomeça do zero para apagar qualquer resquício de casamento errado.
  await prisma.partido.updateMany({ data: { presidenteEstadualPA: null } });

  let atualizados = 0;
  const semCorrespondencia: string[] = [];
  const jaAtualizados = new Set<string>();

  // Duas passadas: sigla exata primeiro; número só depois, e nunca por
  // cima de um partido que já casou por sigla (partidos novos herdam o
  // número de siglas históricas — ex.: MISSÃO usa o 14 do antigo PTB).
  const pendentes: Registro[] = [];
  for (const r of registros) {
    const partido = porSigla.get(normalizar(r.sigla));
    if (!partido) {
      pendentes.push(r);
      continue;
    }
    const valor = r.vigente ? r.presidente : `${r.presidente} (registro SGIP encerrado)`;
    await prisma.partido.update({ where: { id: partido.id }, data: { presidenteEstadualPA: valor } });
    jaAtualizados.add(partido.id);
    atualizados++;
  }
  for (const r of pendentes) {
    const partido = r.numero != null ? porNumero.get(r.numero) : undefined;
    if (!partido || jaAtualizados.has(partido.id)) {
      semCorrespondencia.push(`${r.sigla} (${r.numero ?? "s/nº"})`);
      continue;
    }
    const valor = r.vigente ? r.presidente : `${r.presidente} (registro SGIP encerrado)`;
    await prisma.partido.update({ where: { id: partido.id }, data: { presidenteEstadualPA: valor } });
    jaAtualizados.add(partido.id);
    atualizados++;
  }

  console.log(
    `Presidentes estaduais (PA): ${atualizados} partido(s) atualizado(s) de ${registros.length} registros SGIP.`
  );
  if (semCorrespondencia.length > 0) {
    console.log(`Sem correspondência no banco: ${semCorrespondencia.join(", ")}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
