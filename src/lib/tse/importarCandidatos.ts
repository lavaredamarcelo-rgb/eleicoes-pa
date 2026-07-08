import "server-only";
import { prisma } from "@/lib/prisma";
import {
  resolverCargo,
  resolverCargoDoVice,
  encontrarMunicipio,
  situacaoIndicaEleito,
  novoResumo,
  type ResumoImportacao,
} from "./util";

// Espera o formato "consulta_cand" do TSE (dadosabertos.tse.jus.br),
// filtrado para o estado/eleição desejada. Colunas relevantes: DS_CARGO,
// CD_MUNICIPIO, NM_MUNICIPIO (ou NM_UE), NR_CANDIDATO, NM_CANDIDATO,
// NM_URNA_CANDIDATO, NR_PARTIDO, SG_PARTIDO, NM_PARTIDO, DS_SIT_TOT_TURNO,
// SQ_COLIGACAO (usado para ligar vice-prefeito/vice-governador ao titular
// da mesma chapa).
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
    sqColigacao: string;
  };

  type LinhaVice = {
    cargoNome: string;
    municipioId: string | null;
    nome: string;
    numero: number;
    sqColigacao: string;
    rotulo: string;
  };

  const linhas: Linha[] = [];
  const vices: LinhaVice[] = [];

  for (const [i, row] of rows.entries()) {
    const numeroLinha = i + 2; // +1 cabeçalho, +1 índice 0-based

    const dsCargo = row["DS_CARGO"];
    const cargoInfo = dsCargo ? resolverCargo(dsCargo) : undefined;
    const cargoDoVice = !cargoInfo && dsCargo ? resolverCargoDoVice(dsCargo) : undefined;

    if (!cargoInfo && !cargoDoVice) {
      resumo.avisos.push(`Linha ${numeroLinha}: cargo "${dsCargo ?? "?"}" não suportado, ignorada.`);
      continue;
    }

    const codigoTse = (row["CD_MUNICIPIO"] || row["SG_UE"])?.trim();
    const nomeMunicipioArquivo = row["NM_MUNICIPIO"] ?? row["NM_UE"];
    const cargoMunicipal = cargoInfo ? cargoInfo.municipal : cargoDoVice === "Prefeito";

    let municipioId: string | null = null;
    if (cargoMunicipal) {
      const municipio = await encontrarMunicipio(codigoTse, nomeMunicipioArquivo);
      if (!municipio) {
        resumo.avisos.push(
          `Linha ${numeroLinha}: município "${nomeMunicipioArquivo ?? "?"}" não encontrado, ignorada.`
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
    const sqColigacao = (row["SQ_COLIGACAO"] || "").trim();

    if (cargoDoVice) {
      if (!Number.isFinite(numero) || !nome) {
        resumo.avisos.push(`Linha ${numeroLinha}: dados de vice incompletos, ignorada.`);
        continue;
      }
      // Candidaturas substituídas/indeferidas geram vices duplicados na
      // mesma chapa — só a candidatura apta interessa.
      const situacao = (row["DS_SITUACAO_CANDIDATURA"] || "").trim().toLowerCase();
      if (situacao && situacao !== "apto" && situacao !== "deferido") continue;
      vices.push({
        cargoNome: cargoDoVice,
        municipioId,
        nome,
        numero,
        sqColigacao,
        rotulo: dsCargo!.trim().toLowerCase(),
      });
      continue;
    }

    const partidoSigla = (row["SG_PARTIDO"] || "").trim().toUpperCase();
    if (!Number.isFinite(numero) || !nome || !partidoSigla) {
      resumo.avisos.push(`Linha ${numeroLinha}: dados incompletos (número/nome/partido), ignorada.`);
      continue;
    }

    linhas.push({
      cargoNome: cargoInfo!.nome,
      municipal: cargoInfo!.municipal,
      tipoApuracao: cargoInfo!.tipoApuracao,
      municipioId,
      numero,
      nome,
      partidoSigla,
      partidoNumero: Number(row["NR_PARTIDO"]) || 0,
      partidoNome: (row["NM_PARTIDO"] || partidoSigla).trim(),
      eleito: situacaoIndicaEleito(row["DS_SIT_TOT_TURNO"]),
      sqColigacao,
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
    // Majoritário normalmente tem 1 vaga, mas Senador pode renovar 2
    // cadeiras na mesma eleição (ex.: 2018) — o arquivo diz quantos foram
    // eleitos.
    const vagasInferidas = Math.max(eleitos, 1);

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
    } else if (tipoApuracao === "MAJORITARIO" && cargo.vagas !== vagasInferidas && eleitos > 0) {
      await prisma.cargo.update({ where: { id: cargo.id }, data: { vagas: vagasInferidas } });
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

  // Candidatos (titulares), guardando a chapa (SQ_COLIGACAO) de cada um
  // para depois anexar o vice correspondente.
  const chapaPorCandidato = new Map<
    string,
    { cargoId: string; cargoNome: string; numero: number; sqColigacao: string }
  >();

  for (const linha of linhas) {
    const chave = `${linha.cargoNome}::${linha.municipioId ?? "ESTADUAL"}`;
    const cargoId = cargoIdPorChave.get(chave)!;
    const partidoId = partidosPorSigla.get(linha.partidoSigla)!;

    const existente = await prisma.candidato.findFirst({
      where: { cargoId, numero: linha.numero },
    });

    let candidatoId: string;
    if (!existente) {
      const criado = await prisma.candidato.create({
        data: { nome: linha.nome, numero: linha.numero, cargoId, partidoId, eleito: linha.eleito },
      });
      candidatoId = criado.id;
      resumo.criados++;
    } else {
      if (existente.partidoId !== partidoId) {
        resumo.avisos.push(
          `Candidato "${linha.nome}" (nº ${linha.numero}): partido no arquivo (${linha.partidoSigla}) difere do cadastrado. Atualizado — se for uma troca real, registre em "Histórico partidário" para manter o histórico.`
        );
      }
      await prisma.candidato.update({
        where: { id: existente.id },
        data: { nome: linha.nome, partidoId, eleito: linha.eleito },
      });
      candidatoId = existente.id;
      resumo.atualizados++;
    }

    if (linha.tipoApuracao === "MAJORITARIO" && linha.sqColigacao) {
      chapaPorCandidato.set(candidatoId, {
        cargoId,
        cargoNome: linha.cargoNome,
        numero: linha.numero,
        sqColigacao: linha.sqColigacao,
      });
    }
  }

  // Anexa cada vice/suplente ao titular da mesma chapa. Para Senador a
  // coligação pode lançar mais de um titular (ex.: 2018, duas vagas), então
  // o vínculo é o número do candidato — o suplente herda o número do
  // titular. Senador pode ter dois suplentes; os nomes vão juntos.
  let vicesAnexados = 0;
  for (const [candidatoId, { cargoId, cargoNome, numero, sqColigacao }] of chapaPorCandidato) {
    const daChapa = vices
      .filter((v) => {
        const chave = `${v.cargoNome}::${v.municipioId ?? "ESTADUAL"}`;
        if (cargoIdPorChave.get(chave) !== cargoId) return false;
        if (cargoNome === "Senador") return v.numero === numero;
        return v.sqColigacao === sqColigacao;
      })
      .sort((a, b) => a.rotulo.localeCompare(b.rotulo, "pt-BR"));

    // Uma entrada por rótulo (vice, 1º suplente, 2º suplente) — descarta
    // duplicatas remanescentes de substituições.
    const porRotulo = new Map<string, (typeof daChapa)[number]>();
    for (const v of daChapa) if (!porRotulo.has(v.rotulo)) porRotulo.set(v.rotulo, v);
    const finais = Array.from(porRotulo.values());

    if (finais.length === 1) {
      await prisma.candidato.update({
        where: { id: candidatoId },
        data: { viceNome: finais[0].nome, viceNumero: finais[0].numero },
      });
      vicesAnexados++;
    } else if (finais.length > 1) {
      const nomes = finais.map((v) => `${v.nome} (${v.rotulo})`).join(", ");
      await prisma.candidato.update({
        where: { id: candidatoId },
        data: { viceNome: nomes, viceNumero: null },
      });
      vicesAnexados += finais.length;
    }
  }
  if (vices.length > 0 && vicesAnexados < vices.length) {
    resumo.avisos.push(
      `${vices.length - vicesAnexados} de ${vices.length} vice(s) não puderam ser associados a um titular (chapa não encontrada).`
    );
  }

  return resumo;
}
