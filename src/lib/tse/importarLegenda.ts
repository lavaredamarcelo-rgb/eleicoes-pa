import "server-only";
import { prisma } from "@/lib/prisma";
import { resolverCargo, encontrarMunicipio, novoResumo, type ResumoImportacao } from "./util";

// Espera o formato "votacao_partido_munzona" do TSE (agregado por partido/
// município): DS_CARGO, CD_MUNICIPIO, NM_MUNICIPIO, NR_PARTIDO, SG_PARTIDO,
// QT_VOTOS_LEGENDA, NR_TURNO. Votos de legenda só existem em cargos
// proporcionais; entram na soma de votos válidos do quociente.
export async function importarLegenda(
  rows: Record<string, string>[],
  eleicaoId: string
): Promise<ResumoImportacao> {
  const resumo = novoResumo();

  const partidosPorSigla = new Map(
    (await prisma.partido.findMany()).map((p) => [p.sigla.toUpperCase(), p.id])
  );
  const cargoCache = new Map<string, string | null>();

  for (const [i, row] of rows.entries()) {
    const numeroLinha = i + 2;
    const dsCargo = row["DS_CARGO"];
    const cargoInfo = dsCargo ? resolverCargo(dsCargo) : undefined;
    if (!cargoInfo || cargoInfo.tipoApuracao !== "PROPORCIONAL") continue;

    const municipio = await encontrarMunicipio(row["CD_MUNICIPIO"]?.trim(), row["NM_MUNICIPIO"]);
    if (!municipio) {
      resumo.avisos.push(`Linha ${numeroLinha}: município "${row["NM_MUNICIPIO"] ?? "?"}" não encontrado.`);
      continue;
    }

    const sigla = (row["SG_PARTIDO"] || "").trim().toUpperCase();
    let partidoId = partidosPorSigla.get(sigla);
    if (!partidoId) {
      const criado = await prisma.partido.upsert({
        where: { sigla },
        update: {},
        create: { sigla, nome: sigla, numero: Number(row["NR_PARTIDO"]) || 0 },
      });
      partidoId = criado.id;
      partidosPorSigla.set(sigla, partidoId);
    }

    const votos = Number(row["QT_VOTOS_LEGENDA"]) || 0;
    const turno = Number(row["NR_TURNO"]) || 1;
    const cargoMunicipioId = cargoInfo.municipal ? municipio.id : null;
    const cargoChave = `${cargoInfo.nome}::${cargoMunicipioId ?? "ESTADUAL"}`;
    let cargoId = cargoCache.get(cargoChave);
    if (cargoId === undefined) {
      const cargo = await prisma.cargo.findFirst({
        where: { eleicaoId, nome: cargoInfo.nome, municipioId: cargoMunicipioId },
      });
      cargoId = cargo?.id ?? null;
      cargoCache.set(cargoChave, cargoId);
    }
    if (!cargoId) {
      resumo.avisos.push(`Cargo "${cargoInfo.nome}" não encontrado — importe os candidatos antes.`);
      continue;
    }

    const existente = await prisma.votoLegenda.findFirst({
      where: { cargoId, municipioId: municipio.id, partidoId, turno },
    });
    if (existente) {
      await prisma.votoLegenda.update({ where: { id: existente.id }, data: { votos } });
      resumo.atualizados++;
    } else {
      await prisma.votoLegenda.create({
        data: { cargoId, municipioId: municipio.id, partidoId, turno, votos },
      });
      resumo.criados++;
    }
  }

  return resumo;
}
