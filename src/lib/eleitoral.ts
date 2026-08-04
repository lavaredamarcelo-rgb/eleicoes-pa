import "server-only";
import { prisma } from "@/lib/prisma";
import { distribuirVagas } from "@/lib/simulacaoPartido";
import { votosTurno } from "@/lib/turnos";

// Referências: Código Eleitoral (Lei 4.737/65), art. 106 (quociente eleitoral),
// art. 107 (quociente partidário) e art. 109 (distribuição das sobras pela
// maior média). Aplicável apenas a cargos proporcionais (vereador, deputado
// estadual/municipal) — cargos majoritários (prefeito, governador) não usam
// quociente eleitoral. Os votos válidos somam NOMINAIS + LEGENDA do 1º turno
// (proporcionais só têm um turno), como no cálculo oficial.

export async function calcularQuocienteEleitoral(cargoId: string) {
  const cargo = await prisma.cargo.findUnique({
    where: { id: cargoId },
    include: {
      eleicao: true,
      municipio: true,
      candidatos: {
        include: {
          partido: true,
          resultados: { include: { municipio: { include: { regiao: true } } } },
        },
      },
      votosLegenda: { where: { turno: 1 }, include: { partido: true } },
    },
  });

  if (!cargo) return null;
  if (cargo.tipoApuracao !== "PROPORCIONAL") {
    throw new Error("Quociente eleitoral só se aplica a cargos proporcionais.");
  }

  const candidatosComVotos = cargo.candidatos.map((c) => ({
    id: c.id,
    nome: c.nome,
    numero: c.numero,
    eleito: c.eleito,
    partido: c.partido,
    votos: votosTurno(c.resultados, 1),
  }));

  const votosNominais = candidatosComVotos.reduce((sum, c) => sum + c.votos, 0);

  // Votos de legenda por partido (entram nos válidos e no quociente
  // partidário, mas não pertencem a nenhum candidato).
  const legendaPorPartido = new Map<string, number>();
  let votosLegendaTotal = 0;
  for (const vl of cargo.votosLegenda) {
    legendaPorPartido.set(vl.partidoId, (legendaPorPartido.get(vl.partidoId) ?? 0) + vl.votos);
    votosLegendaTotal += vl.votos;
  }

  const votosValidos = votosNominais + votosLegendaTotal;
  const quocienteEleitoral = cargo.vagas > 0 ? Math.floor(votosValidos / cargo.vagas) : 0;

  const votosPorPartido = new Map<
    string,
    { partidoId: string; sigla: string; nome: string; votos: number; votosLegenda: number }
  >();
  for (const c of candidatosComVotos) {
    const atual = votosPorPartido.get(c.partido.id);
    if (atual) {
      atual.votos += c.votos;
    } else {
      votosPorPartido.set(c.partido.id, {
        partidoId: c.partido.id,
        sigla: c.partido.sigla,
        nome: c.partido.nome,
        votos: c.votos,
        votosLegenda: 0,
      });
    }
  }
  for (const [partidoId, votos] of legendaPorPartido) {
    const atual = votosPorPartido.get(partidoId);
    if (atual) {
      atual.votos += votos;
      atual.votosLegenda = votos;
    } else {
      const vl = cargo.votosLegenda.find((v) => v.partidoId === partidoId)!;
      votosPorPartido.set(partidoId, {
        partidoId,
        sigla: vl.partido.sigla,
        nome: vl.partido.nome,
        votos,
        votosLegenda: votos,
      });
    }
  }

  const vagasFinais = distribuirVagas(
    Array.from(votosPorPartido.values()).map((p) => ({ partidoId: p.partidoId, votos: p.votos })),
    cargo.vagas,
    quocienteEleitoral
  );

  const partidos = Array.from(votosPorPartido.values())
    .map((p) => ({
      ...p,
      quocientePartidario: vagasFinais.get(p.partidoId) ?? 0,
      percentual: votosValidos > 0 ? (p.votos / votosValidos) * 100 : 0,
      votosFaltantesProximaVaga:
        quocienteEleitoral > 0 ? quocienteEleitoral - (p.votos % quocienteEleitoral) : 0,
    }))
    .sort((a, b) => b.votos - a.votos);

  const vagasPorPartido = new Map(partidos.map((p) => [p.partidoId, p.quocientePartidario]));

  const candidatosPorPartido = new Map<string, typeof candidatosComVotos>();
  for (const c of candidatosComVotos) {
    const lista = candidatosPorPartido.get(c.partido.id);
    if (lista) lista.push(c);
    else candidatosPorPartido.set(c.partido.id, [c]);
  }

  // A situação eleito/suplente segue a FLAG OFICIAL do TSE quando ela
  // existe (cassações e decisões judiciais fazem a distribuição real
  // divergir da matemática pura — ex.: candidato inapto não assume mesmo
  // com votos). O cálculo pelo quociente fica para os simuladores.
  const temFlagOficial = candidatosComVotos.some((c) => c.eleito);
  const candidatosComSituacao = Array.from(candidatosPorPartido.entries()).flatMap(
    ([partidoId, lista]) => {
      const vagas = vagasPorPartido.get(partidoId) ?? 0;
      const ordenado = [...lista].sort((a, b) => b.votos - a.votos);
      if (temFlagOficial) {
        let suplente = 0;
        return ordenado.map((c, i) => ({
          ...c,
          situacao: c.eleito ? ("eleito" as const) : ("suplente" as const),
          posicaoNoPartido: i + 1,
          ordemSuplencia: c.eleito ? null : ++suplente,
        }));
      }
      return ordenado.map((c, i) => ({
        ...c,
        situacao: i < vagas ? ("eleito" as const) : ("suplente" as const),
        posicaoNoPartido: i + 1,
        ordemSuplencia: i < vagas ? null : i + 1 - vagas,
      }));
    }
  );

  // Cadeiras reais por partido (contagem oficial), para a composição da
  // casa; quocientePartidario permanece como o valor calculado (didático).
  const cadeirasOficiaisPorPartido = new Map<string, number>();
  for (const c of candidatosComVotos) {
    if (c.eleito) {
      cadeirasOficiaisPorPartido.set(
        c.partido.id,
        (cadeirasOficiaisPorPartido.get(c.partido.id) ?? 0) + 1
      );
    }
  }

  const votosPorMunicipio = new Map<
    string,
    { municipioId: string; municipioNome: string; regiaoNome: string; total: number; partidos: Map<string, number> }
  >();
  for (const c of cargo.candidatos) {
    for (const r of c.resultados) {
      if (r.turno !== 1) continue;
      let entry = votosPorMunicipio.get(r.municipioId);
      if (!entry) {
        entry = {
          municipioId: r.municipioId,
          municipioNome: r.municipio.nome,
          regiaoNome: r.municipio.regiao.nome,
          total: 0,
          partidos: new Map(),
        };
        votosPorMunicipio.set(r.municipioId, entry);
      }
      entry.total += r.votos;
      entry.partidos.set(c.partido.sigla, (entry.partidos.get(c.partido.sigla) ?? 0) + r.votos);
    }
  }
  const municipiosComVotos = Array.from(votosPorMunicipio.values())
    .map((m) => ({
      ...m,
      partidos: Array.from(m.partidos.entries())
        .map(([sigla, votos]) => ({ sigla, votos }))
        .sort((a, b) => b.votos - a.votos),
    }))
    .sort((a, b) => b.total - a.total);

  // Cadeiras "reais" por partido: contagem oficial quando disponível;
  // senão, o valor calculado pelo quociente.
  const partidosComCadeiras = partidos.map((p) => ({
    ...p,
    cadeirasOficiais: temFlagOficial
      ? cadeirasOficiaisPorPartido.get(p.partidoId) ?? 0
      : p.quocientePartidario,
  }));

  return {
    cargo,
    votosValidos,
    votosNominais,
    votosLegendaTotal,
    quocienteEleitoral,
    temFlagOficial,
    candidatos: candidatosComVotos.sort((a, b) => b.votos - a.votos),
    candidatosComSituacao: candidatosComSituacao.sort((a, b) => b.votos - a.votos),
    partidos: partidosComCadeiras,
    municipiosComVotos,
  };
}

export async function calcularMajoritario(cargoId: string) {
  const cargo = await prisma.cargo.findUnique({
    where: { id: cargoId },
    include: {
      eleicao: true,
      municipio: true,
      candidatos: {
        include: {
          partido: true,
          resultados: true,
        },
      },
    },
  });

  if (!cargo) return null;
  if (cargo.tipoApuracao !== "MAJORITARIO") {
    throw new Error("Esta apuração é para cargos majoritários.");
  }

  const turnosPresentes = Array.from(
    new Set(cargo.candidatos.flatMap((c) => c.resultados.map((r) => r.turno)))
  ).sort();
  if (turnosPresentes.length === 0) turnosPresentes.push(1);

  const turnos = turnosPresentes.map((turno) => {
    const candidatos = cargo.candidatos
      .map((c) => ({
        id: c.id,
        nome: c.nome,
        numero: c.numero,
        partido: c.partido,
        eleito: c.eleito,
        viceNome: c.viceNome,
        viceNumero: c.viceNumero,
        votos: votosTurno(c.resultados, turno),
      }))
      .filter((c) => c.votos > 0)
      .sort((a, b) => b.votos - a.votos);

    const votosValidos = candidatos.reduce((sum, c) => sum + c.votos, 0);
    const lider = candidatos[0];
    const percentualLider = votosValidos > 0 && lider ? (lider.votos / votosValidos) * 100 : 0;

    return { turno, candidatos, votosValidos, percentualLider };
  });

  const decisivo = turnos[turnos.length - 1];

  return {
    cargo,
    turnos,
    turnoDecisivo: decisivo,
    // Compatibilidade com telas que mostram uma única lista: o turno que
    // decidiu a eleição.
    candidatos: decisivo.candidatos,
    votosValidos: decisivo.votosValidos,
    percentualLider: decisivo.percentualLider,
    segundoTurnoProvavel:
      turnos.length === 1 && decisivo.percentualLider > 0 && decisivo.percentualLider <= 50,
  };
}

// ---------------------------------------------------------------------------
// Quociente PREVISTO para a próxima eleição de um cargo proporcional:
// duas estimativas de votos válidos (escala do eleitorado e comparecimento
// médio histórico) e a decomposição completa das vagas — diretas pelo
// quociente partidário e sobras rodada a rodada (art. 109).

import {
  getEleitoradoProjecao,
  getEleitoresCargo,
  getReferenciaisViabilidade,
} from "@/lib/data";

export async function calcularQuocienteProjetado(cargoBaseId: string) {
  const base = await calcularQuocienteEleitoral(cargoBaseId);
  if (!base) return null;
  const municipioId = base.cargo.municipioId ?? null;
  const anoBase = base.cargo.eleicao.ano;

  const [projecoes, aptosBase, referenciais] = await Promise.all([
    getEleitoradoProjecao(),
    getEleitoresCargo(municipioId, anoBase),
    getReferenciaisViabilidade(cargoBaseId),
  ]);
  const entradas = municipioId
    ? [projecoes.get(municipioId)].filter((e) => e !== undefined)
    : Array.from(projecoes.values());
  const aptosAlvo = entradas.reduce((s, e) => s + e.projecao, 0);
  const anoAlvo = entradas.reduce((max, e) => Math.max(max, e.anoProjecao), 0);
  const aptosOficiais = entradas.length > 0 && entradas.every((e) => e.oficial);
  if (!aptosBase || aptosBase.eleitores <= 0 || aptosAlvo <= 0 || anoAlvo <= anoBase) return null;

  const fator = aptosAlvo / aptosBase.eleitores;
  const vagas = base.cargo.vagas;

  // Estimativa A — votos válidos da base escalados pelo eleitorado.
  const validosEleitorado = Math.round(base.votosValidos * fator);
  const qeEleitorado = vagas > 0 ? Math.floor(validosEleitorado / vagas) : 0;

  // Estimativa B — comparecimento válido médio (válidos ÷ aptos) das
  // eleições anteriores do mesmo cargo, aplicado ao eleitorado alvo.
  const historico: { ano: number; validos: number; aptos: number; proporcao: number }[] = [];
  for (const r of referenciais?.referencias ?? []) {
    const aptosAno = await getEleitoresCargo(municipioId, r.ano);
    if (aptosAno && aptosAno.eleitores > 0 && r.validos > 0) {
      historico.push({
        ano: r.ano,
        validos: r.validos,
        aptos: aptosAno.eleitores,
        proporcao: r.validos / aptosAno.eleitores,
      });
    }
  }
  const mediaComparecimento =
    historico.length > 0
      ? historico.reduce((s, h) => s + h.proporcao, 0) / historico.length
      : 0;
  const validosComparecimento = Math.round(aptosAlvo * mediaComparecimento);
  const qeComparecimento =
    vagas > 0 && validosComparecimento > 0 ? Math.floor(validosComparecimento / vagas) : 0;

  // Vagas do cenário (estimativa A): diretas pelo QP e sobras rodada a
  // rodada pela maior média, registrando quem leva cada uma.
  const partidosProj = base.partidos
    .map((p) => ({ partidoId: p.partidoId, sigla: p.sigla, votos: Math.round(p.votos * fator) }))
    .filter((p) => p.votos > 0)
    .sort((a, b) => b.votos - a.votos);

  const qe = qeEleitorado;
  const vagasAtuais = new Map<string, number>();
  let somaDiretas = 0;
  for (const p of partidosProj) {
    const diretas = qe > 0 ? Math.floor(p.votos / qe) : 0;
    vagasAtuais.set(p.partidoId, diretas);
    somaDiretas += diretas;
  }
  const vagasSobras = Math.max(0, vagas - somaDiretas);

  let elegiveis = partidosProj.filter((p) => qe > 0 && p.votos >= qe);
  if (elegiveis.length === 0) elegiveis = partidosProj;
  const rodadasSobras: { rodada: number; sigla: string; media: number }[] = [];
  for (let rodada = 1; rodada <= vagasSobras; rodada++) {
    let melhor: (typeof partidosProj)[number] | null = null;
    let melhorMedia = -1;
    for (const p of elegiveis) {
      const media = p.votos / ((vagasAtuais.get(p.partidoId) ?? 0) + 1);
      if (media > melhorMedia || (media === melhorMedia && p.votos > (melhor?.votos ?? -1))) {
        melhorMedia = media;
        melhor = p;
      }
    }
    if (!melhor) break;
    rodadasSobras.push({ rodada, sigla: melhor.sigla, media: Math.round(melhorMedia) });
    vagasAtuais.set(melhor.partidoId, (vagasAtuais.get(melhor.partidoId) ?? 0) + 1);
  }

  const tabelaPartidos = partidosProj.map((p) => {
    const total = vagasAtuais.get(p.partidoId) ?? 0;
    const diretas = qe > 0 ? Math.floor(p.votos / qe) : 0;
    return {
      sigla: p.sigla,
      votos: p.votos,
      diretas,
      sobras: total - diretas,
      total,
      faltamProximaVaga: qe > 0 ? qe - (p.votos % qe) : 0,
    };
  });

  return {
    cargoNome: base.cargo.nome,
    municipioNome: base.cargo.municipio?.nome ?? null,
    anoBase,
    anoAlvo,
    vagas,
    aptosAlvo,
    aptosOficiais,
    fator,
    estimativaEleitorado: { validos: validosEleitorado, qe: qeEleitorado },
    estimativaComparecimento: {
      validos: validosComparecimento,
      qe: qeComparecimento,
      media: mediaComparecimento,
      historico,
    },
    partidos: tabelaPartidos,
    vagasSobras,
    rodadasSobras,
  };
}
