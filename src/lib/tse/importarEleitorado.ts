import "server-only";
import { prisma } from "@/lib/prisma";
import { encontrarMunicipio, novoResumo, type ResumoImportacao } from "./util";

// Espera o arquivo já agregado por município (CD_MUNICIPIO, NM_MUNICIPIO,
// QT_ELEITORES) — o arquivo oficial do TSE ("perfil_eleitor_secao") vem
// por seção eleitoral e é processado à parte antes de chegar aqui.
export async function importarEleitorado(
  rows: Record<string, string>[],
  ano: number
): Promise<ResumoImportacao> {
  const resumo = novoResumo();

  for (const [i, row] of rows.entries()) {
    const numeroLinha = i + 2;
    const codigoTse = row["CD_MUNICIPIO"]?.trim();
    const nomeMunicipio = row["NM_MUNICIPIO"]?.trim();
    const total = Number(row["QT_ELEITORES"]);

    if (!Number.isFinite(total)) {
      resumo.avisos.push(`Linha ${numeroLinha}: total de eleitores inválido, ignorada.`);
      continue;
    }

    const municipio = await encontrarMunicipio(codigoTse, nomeMunicipio);
    if (!municipio) {
      resumo.avisos.push(`Linha ${numeroLinha}: município "${nomeMunicipio ?? "?"}" não encontrado, ignorada.`);
      continue;
    }

    if (codigoTse && !municipio.codigoTse) {
      await prisma.municipio.update({ where: { id: municipio.id }, data: { codigoTse } });
    }

    const existente = await prisma.eleitorado.findUnique({
      where: { municipioId_ano: { municipioId: municipio.id, ano } },
    });

    if (existente) {
      await prisma.eleitorado.update({ where: { id: existente.id }, data: { total } });
      resumo.atualizados++;
    } else {
      await prisma.eleitorado.create({ data: { municipioId: municipio.id, ano, total } });
      resumo.criados++;
    }
  }

  return resumo;
}
