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
