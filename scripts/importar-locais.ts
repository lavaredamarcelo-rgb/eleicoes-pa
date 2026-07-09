import "server-only";
import fs from "node:fs";
import { prisma } from "@/lib/prisma";

// Importa votação por LOCAL DE VOTAÇÃO (arquivo gerado pelo
// extrair_locais.py): cria os ColegioEleitoral e grava Resultado com
// grava VotoLocal em lotes (createMany) — tabela separada de Resultado
// para não interferir nas agregações municipais existentes.
// Uso: npx tsx scripts/importar-locais.ts <ano> <arquivo.json>

const ano = Number(process.argv[2]);
const arquivo = process.argv[3];

const CARGO_NOME: Record<string, { nome: string; municipal: boolean }> = {
  PREFEITO: { nome: "Prefeito", municipal: true },
  VEREADOR: { nome: "Vereador", municipal: true },
  GOVERNADOR: { nome: "Governador", municipal: false },
  SENADOR: { nome: "Senador", municipal: false },
  "DEPUTADO ESTADUAL": { nome: "Deputado Estadual", municipal: false },
  "DEPUTADO FEDERAL": { nome: "Deputado Federal", municipal: false },
};

async function main() {
  if (!Number.isFinite(ano) || !arquivo) throw new Error("Uso: <ano> <arquivo.json>");
  const eleicao = await prisma.eleicao.findFirst({ where: { ano } });
  if (!eleicao) throw new Error(`Eleição de ${ano} não cadastrada.`);

  const { locais, votos } = JSON.parse(fs.readFileSync(arquivo, "utf-8")) as {
    locais: { codigo: string; cd_mun: string; nome: string; endereco: string; bairro: string }[];
    votos: { DS_CARGO: string; CD_MUNICIPIO: string; CD_LOCAL: string; NR_CANDIDATO: string; NR_TURNO: string; QT_VOTOS: number }[];
  };

  // Caches em memória (poucos milhares de linhas cada).
  const municipios = await prisma.municipio.findMany({ select: { id: true, codigoTse: true } });
  // Chave numérica: os arquivos ora trazem zeros à esquerda, ora não.
  const munPorTse = new Map(
    municipios.filter((m) => m.codigoTse).map((m) => [String(Number(m.codigoTse)), m.id])
  );

  // 1) Locais -> ColegioEleitoral
  const existentes = new Set(
    (await prisma.colegioEleitoral.findMany({ select: { codigoTse: true } })).map((c) => c.codigoTse)
  );
  const novos = locais
    .filter((l) => !existentes.has(l.codigo) && munPorTse.has(String(Number(l.cd_mun))))
    .map((l) => ({
      codigoTse: l.codigo,
      nome: l.bairro ? `${l.nome} — ${l.bairro}` : l.nome,
      municipioId: munPorTse.get(String(Number(l.cd_mun)))!,
    }));
  for (let i = 0; i < novos.length; i += 500) {
    await prisma.colegioEleitoral.createMany({ data: novos.slice(i, i + 500) });
  }
  console.log(`Locais: ${novos.length} criados (${existentes.size} já existiam).`);

  const colegios = await prisma.colegioEleitoral.findMany({ select: { id: true, codigoTse: true } });
  const colegioPorCodigo = new Map(colegios.map((c) => [c.codigoTse, c.id]));

  // 2) Candidatos por (cargoNome, municipioIdOuNull, numero)
  const cargos = await prisma.cargo.findMany({
    where: { eleicaoId: eleicao.id },
    select: { id: true, nome: true, municipioId: true },
  });
  const cargoPorChave = new Map(cargos.map((c) => [`${c.nome}::${c.municipioId ?? "PA"}`, c.id]));
  const candidatos = await prisma.candidato.findMany({
    where: { cargo: { eleicaoId: eleicao.id } },
    select: { id: true, numero: true, cargoId: true },
  });
  const candPorChave = new Map(candidatos.map((c) => [`${c.cargoId}::${c.numero}`, c.id]));

  // 3) Reimport idempotente: limpa os votos por local desta eleição
  await prisma.votoLocal.deleteMany({
    where: { candidato: { cargo: { eleicaoId: eleicao.id } } },
  });

  // 4) Monta e grava em lotes
  let gravados = 0;
  let ignorados = 0;
  let lote: { candidatoId: string; colegioEleitoralId: string; turno: number; votos: number }[] = [];

  for (const v of votos) {
    const info = CARGO_NOME[v.DS_CARGO];
    const municipioId = munPorTse.get(String(Number(v.CD_MUNICIPIO)));
    const colegioId = colegioPorCodigo.get(v.CD_LOCAL);
    if (!info || !municipioId || !colegioId) {
      ignorados++;
      continue;
    }
    const cargoId = cargoPorChave.get(`${info.nome}::${info.municipal ? municipioId : "PA"}`);
    const candidatoId = cargoId ? candPorChave.get(`${cargoId}::${Number(v.NR_CANDIDATO)}`) : undefined;
    if (!candidatoId) {
      ignorados++;
      continue;
    }
    lote.push({
      candidatoId,
      colegioEleitoralId: colegioId,
      turno: Number(v.NR_TURNO) || 1,
      votos: v.QT_VOTOS,
    });
    if (lote.length >= 2000) {
      await prisma.votoLocal.createMany({ data: lote });
      gravados += lote.length;
      lote = [];
    }
  }
  if (lote.length > 0) {
    await prisma.votoLocal.createMany({ data: lote });
    gravados += lote.length;
  }

  console.log(`${ano} locais: gravados=${gravados} ignorados=${ignorados}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
