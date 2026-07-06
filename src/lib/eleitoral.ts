import "server-only";
import { prisma } from "@/lib/prisma";
import { distribuirVagas } from "@/lib/simulacaoPartido";

// Referências: Código Eleitoral (Lei 4.737/65), art. 106 (quociente eleitoral),
// art. 107 (quociente partidário) e art. 109 (distribuição das sobras pela
// maior média). Aplicável apenas a cargos proporcionais (vereador, deputado
// estadual/federal) — cargos majoritários (prefeito, governador) não usam
// quociente eleitoral.

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
    partido: c.partido,
    votos: c.resultados.reduce((sum, r) => sum + r.votos, 0),
  }));

  const votosValidos = candidatosComVotos.reduce((sum, c) => sum + c.votos, 0);
  const quocienteEleitoral = cargo.vagas > 0 ? Math.floor(votosValidos / cargo.vagas) : 0;

  const votosPorPartido = new Map<
    string,
    { partidoId: string; sigla: string; nome: string; votos: number }
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
      // Votos que faltam para completar mais um quociente partidário
      // "direto" (sem contar possíveis sobras adicionais pela maior média).
      votosFaltantesProximaVaga:
        quocienteEleitoral > 0 ? quocienteEleitoral - (p.votos % quocienteEleitoral) : 0,
    }))
    .sort((a, b) => b.votos - a.votos);

  const vagasPorPartido = new Map(partidos.map((p) => [p.partidoId, p.quocientePartidario]));

  // Dentro de cada partido, os candidatos mais votados até o número de
  // vagas do partido (já incluindo sobras) são eleitos (titulares); os
  // demais viram suplentes, na ordem de votação.
  const candidatosPorPartido = new Map<string, typeof candidatosComVotos>();
  for (const c of candidatosComVotos) {
    const lista = candidatosPorPartido.get(c.partido.id);
    if (lista) lista.push(c);
    else candidatosPorPartido.set(c.partido.id, [c]);
  }

  const candidatosComSituacao = Array.from(candidatosPorPartido.entries()).flatMap(
    ([partidoId, lista]) => {
      const vagas = vagasPorPartido.get(partidoId) ?? 0;
      return lista
        .sort((a, b) => b.votos - a.votos)
        .map((c, i) => ({
          ...c,
          situacao: i < vagas ? ("eleito" as const) : ("suplente" as const),
          posicaoNoPartido: i + 1,
          ordemSuplencia: i < vagas ? null : i + 1 - vagas,
        }));
    }
  );

  // Detalhamento por município (útil sobretudo em cargos estaduais, onde o
  // quociente é calculado pelo total do estado, mas cada partido quer saber
  // de onde vieram os votos).
  const votosPorMunicipio = new Map<
    string,
    { municipioId: string; municipioNome: string; regiaoNome: string; total: number; partidos: Map<string, number> }
  >();
  for (const c of cargo.candidatos) {
    for (const r of c.resultados) {
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

  return {
    cargo,
    votosValidos,
    quocienteEleitoral,
    candidatos: candidatosComVotos.sort((a, b) => b.votos - a.votos),
    candidatosComSituacao: candidatosComSituacao.sort((a, b) => b.votos - a.votos),
    partidos,
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

  const candidatos = cargo.candidatos
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partido: c.partido,
      votos: c.resultados.reduce((sum, r) => sum + r.votos, 0),
    }))
    .sort((a, b) => b.votos - a.votos);

  const votosValidos = candidatos.reduce((sum, c) => sum + c.votos, 0);
  const lider = candidatos[0];
  const percentualLider = votosValidos > 0 && lider ? (lider.votos / votosValidos) * 100 : 0;

  return {
    cargo,
    candidatos,
    votosValidos,
    percentualLider,
    segundoTurnoProvavel: percentualLider > 0 && percentualLider <= 50,
  };
}

