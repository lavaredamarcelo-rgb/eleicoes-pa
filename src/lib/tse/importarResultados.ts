import "server-only";
import { prisma } from "@/lib/prisma";
import { resolverCargo, encontrarMunicipio, novoResumo, type ResumoImportacao } from "./util";

// Espera o formato "votacao_candidato_munzona" do TSE: uma linha por
// candidato/zona/município. Como o sistema guarda o resultado agregado
// por município (Resultado.votos), somamos as zonas antes de gravar.
// Importante: mesmo em cargos estaduais (Governador, Deputados), o voto
// é sempre contado por município — só o Cargo em si é que não pertence
// a um município específico (Cargo.municipioId fica nulo nesses casos).
// Colunas relevantes: DS_CARGO, CD_MUNICIPIO, NM_MUNICIPIO, NR_CANDIDATO,
// QT_VOTOS_NOMINAIS.
export async function importarResultados(
  rows: Record<string, string>[],
  eleicaoId: string
): Promise<ResumoImportacao> {
  const resumo = novoResumo();

  const votosPorChave = new Map<
    string,
    { cargoNome: string; cargoMunicipioId: string | null; votoMunicipioId: string; numero: number; votos: number }
  >();

  for (const [i, row] of rows.entries()) {
    const numeroLinha = i + 2;

    const dsCargo = row["DS_CARGO"];
    const cargoInfo = dsCargo ? resolverCargo(dsCargo) : undefined;
    if (!cargoInfo) {
      resumo.avisos.push(`Linha ${numeroLinha}: cargo "${dsCargo ?? "?"}" não suportado, ignorada.`);
      continue;
    }

    // O voto é sempre localizado num município, independente do cargo
    // ser de escopo municipal ou estadual.
    const municipio = await encontrarMunicipio(row["CD_MUNICIPIO"]?.trim(), row["NM_MUNICIPIO"]);
    if (!municipio) {
      resumo.avisos.push(
        `Linha ${numeroLinha}: município "${row["NM_MUNICIPIO"] ?? "?"}" não encontrado, ignorada.`
      );
      continue;
    }

    const numero = Number(row["NR_CANDIDATO"]);
    const votos = Number(row["QT_VOTOS_NOMINAIS"]);
    if (!Number.isFinite(numero) || !Number.isFinite(votos)) {
      resumo.avisos.push(`Linha ${numeroLinha}: número de candidato ou votos inválido, ignorada.`);
      continue;
    }

    const cargoMunicipioId = cargoInfo.municipal ? municipio.id : null;
    const chave = `${cargoInfo.nome}::${cargoMunicipioId ?? "ESTADUAL"}::${municipio.id}::${numero}`;
    const atual = votosPorChave.get(chave);
    if (atual) {
      atual.votos += votos;
    } else {
      votosPorChave.set(chave, {
        cargoNome: cargoInfo.nome,
        cargoMunicipioId,
        votoMunicipioId: municipio.id,
        numero,
        votos,
      });
    }
  }

  const cargoCache = new Map<string, string | null>();

  for (const item of votosPorChave.values()) {
    const cargoChave = `${item.cargoNome}::${item.cargoMunicipioId ?? "ESTADUAL"}`;
    let cargoId = cargoCache.get(cargoChave);
    if (cargoId === undefined) {
      const cargo = await prisma.cargo.findFirst({
        where: { eleicaoId, nome: item.cargoNome, municipioId: item.cargoMunicipioId },
      });
      cargoId = cargo?.id ?? null;
      cargoCache.set(cargoChave, cargoId);
    }

    if (!cargoId) {
      resumo.avisos.push(
        `Cargo "${item.cargoNome}"${item.cargoMunicipioId ? "" : " (estadual)"}: não encontrado — importe os candidatos antes dos resultados.`
      );
      continue;
    }

    const candidato = await prisma.candidato.findFirst({
      where: { cargoId, numero: item.numero },
    });
    if (!candidato) {
      resumo.avisos.push(
        `Candidato nº ${item.numero} (cargo "${item.cargoNome}"): não encontrado — importe os candidatos antes dos resultados.`
      );
      continue;
    }

    const existente = await prisma.resultado.findFirst({
      where: {
        candidatoId: candidato.id,
        municipioId: item.votoMunicipioId,
        colegioEleitoralId: null,
      },
    });

    if (existente) {
      await prisma.resultado.update({ where: { id: existente.id }, data: { votos: item.votos } });
      resumo.atualizados++;
    } else {
      await prisma.resultado.create({
        data: {
          candidatoId: candidato.id,
          municipioId: item.votoMunicipioId,
          votos: item.votos,
        },
      });
      resumo.criados++;
    }
  }

  return resumo;
}
