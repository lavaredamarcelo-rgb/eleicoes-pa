import "server-only";
import { prisma } from "@/lib/prisma";
import {
  resolverCargo,
  encontrarMunicipio,
  situacaoIndicaEleito,
  novoResumo,
  type ResumoImportacao,
} from "./util";

// Espera o formato "consulta_cand" do TSE (dadosabertos.tse.jus.br),
// filtrado para o estado/eleição desejada. Colunas relevantes: DS_CARGO,
// CD_MUNICIPIO, NM_MUNICIPIO (ou NM_UE), NR_CANDIDATO, NM_CANDIDATO,
// NM_URNA_CANDIDATO, NR_PARTIDO, SG_PARTIDO, NM_PARTIDO, DS_SIT_TOT_TURNO.
export async function importarCandidatos(
  rows: Record<string, string>[],
  eleicaoId: string
): Promise<ResumoImportacao> {
  const resumo = novoResumo();

  type Linha = {
    cargoNome: string;
    municipal: boolean;
    tipoApuracao: "MAJORITARIO" | "PROPORCIONAL";
    municipioId: string | null;
    numero: number;
    nome: string;
    partidoSigla: string;
    partidoNumero: number;
    partidoNome: string;
    eleito: boolean;
  };

  const linhas: Linha[] = [];

  for (const [i, row] of rows.entries()) {
    const numeroLinha = i + 2; // +1 cabeçalho, +1 índice 0-based

    const dsCargo = row["DS_CARGO"];
    const cargoInfo = dsCargo ? resolverCargo(dsCargo) : undefined;
    if (!cargoInfo) {
      resumo.avisos.push(`Linha ${numeroLinha}: cargo "${dsCargo ?? "?"}" não suportado, ignorada.`);
      continue;
    }

    let municipioId: string | null = null;
    if (cargoInfo.municipal) {
      // O arquivo "consulta_cand" não traz CD_MUNICIPIO (esse campo só
      // existe em "votacao_candidato_munzona"); para cargos municipais,
      // SG_UE já é o código do município nesse arquivo.
      const codigoTse = (row["CD_MUNICIPIO"] || row["SG_UE"])?.trim();
      const municipio = await encontrarMunicipio(codigoTse, row["NM_MUNICIPIO"] ?? row["NM_UE"]);
      if (!municipio) {
        resumo.avisos.push(
          `Linha ${numeroLinha}: município "${row["NM_MUNICIPIO"] ?? row["NM_UE"] ?? "?"}" não encontrado, ignorada.`
        );
        continue;
      }
      if (codigoTse && !municipio.codigoTse) {
        await prisma.municipio.update({ where: { id: municipio.id }, data: { codigoTse } });
      }
      municipioId = municipio.id;
    }

    const numero = Number(row["NR_CANDIDATO"]);
    const nome = (row["NM_URNA_CANDIDATO"] || row["NM_CANDIDATO"] || "").trim();
    const partidoSigla = (row["SG_PARTIDO"] || "").trim().toUpperCase();
    if (!Number.isFinite(numero) || !nome || !partidoSigla) {
      resumo.avisos.push(`Linha ${numeroLinha}: dados incompletos (número/nome/partido), ignorada.`);
      continue;
    }

    linhas.push({
      cargoNome: cargoInfo.nome,
      municipal: cargoInfo.municipal,
      tipoApuracao: cargoInfo.tipoApuracao,
      municipioId,
      numero,
      nome,
      partidoSigla,
      partidoNumero: Number(row["NR_PARTIDO"]) || 0,
      partidoNome: (row["NM_PARTIDO"] || partidoSigla).trim(),
      eleito: situacaoIndicaEleito(row["DS_SIT_TOT_TURNO"]),
    });
  }

  // Agrupa por (cargo, município) para inferir o número de vagas a partir
  // da quantidade de candidatos marcados como eleitos no arquivo.
  const grupos = new Map<string, Linha[]>();
  for (const linha of linhas) {
    const chave = `${linha.cargoNome}::${linha.municipioId ?? "ESTADUAL"}`;
    const lista = grupos.get(chave);
    if (lista) lista.push(linha);
    else grupos.set(chave, [linha]);
  }

  const cargoIdPorChave = new Map<string, string>();

  for (const [chave, lista] of grupos) {
    const { cargoNome, municipioId, tipoApuracao } = lista[0];
    const eleitos = lista.filter((l) => l.eleito).length;
    const vagasInferidas = tipoApuracao === "MAJORITARIO" ? 1 : Math.max(eleitos, 1);

    let cargo = await prisma.cargo.findFirst({
      where: { eleicaoId, nome: cargoNome, municipioId },
    });

    if (!cargo) {
      cargo = await prisma.cargo.create({
        data: {
          nome: cargoNome,
          tipoApuracao,
          vagas: vagasInferidas,
          eleicaoId,
          municipioId,
        },
      });
      resumo.criados++;
    } else if (tipoApuracao === "PROPORCIONAL" && eleitos > 0 && cargo.vagas !== vagasInferidas) {
      resumo.avisos.push(
        `Cargo "${cargoNome}"${municipioId ? "" : " (estadual)"}: número de vagas cadastrado (${cargo.vagas}) diverge do inferido pelo arquivo (${vagasInferidas}). Mantido o valor já cadastrado — ajuste manualmente se necessário.`
      );
    }

    cargoIdPorChave.set(chave, cargo.id);
  }

  // Partidos
  const partidosPorSigla = new Map<string, string>();
  for (const linha of linhas) {
    if (partidosPorSigla.has(linha.partidoSigla)) continue;
    const partido = await prisma.partido.upsert({
      where: { sigla: linha.partidoSigla },
      update: {},
      create: {
        sigla: linha.partidoSigla,
        nome: linha.partidoNome,
        numero: linha.partidoNumero,
      },
    });
    partidosPorSigla.set(linha.partidoSigla, partido.id);
  }

  // Candidatos
  for (const linha of linhas) {
    const chave = `${linha.cargoNome}::${linha.municipioId ?? "ESTADUAL"}`;
    const cargoId = cargoIdPorChave.get(chave)!;
    const partidoId = partidosPorSigla.get(linha.partidoSigla)!;

    const existente = await prisma.candidato.findFirst({
      where: { cargoId, numero: linha.numero },
    });

    if (!existente) {
      await prisma.candidato.create({
        data: { nome: linha.nome, numero: linha.numero, cargoId, partidoId },
      });
      resumo.criados++;
    } else {
      if (existente.partidoId !== partidoId) {
        resumo.avisos.push(
          `Candidato "${linha.nome}" (nº ${linha.numero}): partido no arquivo (${linha.partidoSigla}) difere do cadastrado. Atualizado — se for uma troca real, registre em "Histórico partidário" para manter o histórico.`
        );
      }
      await prisma.candidato.update({
        where: { id: existente.id },
        data: { nome: linha.nome, partidoId },
      });
      resumo.atualizados++;
    }
  }

  return resumo;
}
