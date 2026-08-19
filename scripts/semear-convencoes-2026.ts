// Semeia a aba Convenções com o que a imprensa e a Wikipédia registraram
// das convenções de 2026 no Pará (src/data/convencoes-2026-pa.json).
// Idempotente: atualiza o que já existe e NÃO mexe em registros manuais.
// Uso: DATABASE_URL="file:./dev.db" npx tsx scripts/semear-convencoes-2026.ts
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../src/lib/prisma";

type Entrada = {
  sigla: string;
  numero?: number;
  dataRealizada?: string;
  dataPrevista?: string;
  local?: string;
  preCandidatos: { nome: string; cargo: string; situacao: string; observacoes?: string }[];
};

async function main() {
  const arquivo = join(__dirname, "..", "src", "data", "convencoes-2026-pa.json");
  const { fonte, convencoes } = JSON.parse(readFileSync(arquivo, "utf-8")) as {
    fonte: string;
    convencoes: Entrada[];
  };

  const partidos = await prisma.partido.findMany();
  const normalizar = (s: string) => s.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const porSigla = new Map(partidos.map((p) => [normalizar(p.sigla), p]));
  const porNumero = new Map(partidos.map((p) => [p.numero, p]));

  let convencoesGravadas = 0;
  let preCandidatosGravados = 0;

  for (const e of convencoes) {
    const partido =
      porSigla.get(normalizar(e.sigla)) ??
      (e.numero != null ? porNumero.get(e.numero) : undefined);
    if (!partido) {
      console.log(`  partido não encontrado: ${e.sigla}`);
      continue;
    }

    if (e.dataRealizada || e.dataPrevista || e.local) {
      await prisma.convencao.upsert({
        where: { partidoId: partido.id },
        create: {
          partidoId: partido.id,
          dataRealizada: e.dataRealizada ?? null,
          dataPrevista: e.dataPrevista ?? null,
          local: e.local ?? null,
          observacoes: fonte,
        },
        update: {
          dataRealizada: e.dataRealizada ?? undefined,
          dataPrevista: e.dataPrevista ?? undefined,
          local: e.local ?? undefined,
        },
      });
      convencoesGravadas++;
    }

    for (const pc of e.preCandidatos) {
      await prisma.preCandidato.upsert({
        where: {
          partidoId_nome_cargo: { partidoId: partido.id, nome: pc.nome, cargo: pc.cargo },
        },
        create: {
          partidoId: partido.id,
          nome: pc.nome,
          cargo: pc.cargo,
          situacao: pc.situacao,
          origem: "web",
          observacoes: pc.observacoes ?? null,
        },
        update: { situacao: pc.situacao, observacoes: pc.observacoes ?? undefined },
      });
      preCandidatosGravados++;
    }
  }

  // Poda: registros de origem "web" que saíram da fonte (trocas de chapa,
  // registros indeferidos) são removidos — os manuais ficam intactos.
  const chavesFonte = new Set<string>();
  for (const e of convencoes) {
    const partido =
      porSigla.get(normalizar(e.sigla)) ??
      (e.numero != null ? porNumero.get(e.numero) : undefined);
    if (!partido) continue;
    for (const pc of e.preCandidatos) chavesFonte.add(`${partido.id}|${pc.nome}|${pc.cargo}`);
  }
  const daWeb = await prisma.preCandidato.findMany({ where: { origem: "web" } });
  let removidos = 0;
  for (const pc of daWeb) {
    if (!chavesFonte.has(`${pc.partidoId}|${pc.nome}|${pc.cargo}`)) {
      await prisma.preCandidato.delete({ where: { id: pc.id } });
      removidos++;
    }
  }

  console.log(
    `Convenções: ${convencoesGravadas} gravada(s) · pré-candidatos: ${preCandidatosGravados} gravado(s) · removidos da fonte: ${removidos}`
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
