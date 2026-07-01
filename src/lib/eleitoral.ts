import "server-only";
import { prisma } from "@/lib/prisma";

// Referências: Código Eleitoral (Lei 4.737/65), art. 106 (quociente eleitoral)
// e art. 107 (quociente partidário). Aplicável apenas a cargos proporcionais
// (vereador, deputado estadual/federal) — cargos majoritários (prefeito,
// governador) não usam quociente eleitoral.

export async function calcularQuocienteEleitoral(cargoId: string) {
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

  const partidos = Array.from(votosPorPartido.values())
    .map((p) => ({
      ...p,
      quocientePartidario: quocienteEleitoral > 0 ? Math.floor(p.votos / quocienteEleitoral) : 0,
      percentual: votosValidos > 0 ? (p.votos / votosValidos) * 100 : 0,
    }))
    .sort((a, b) => b.votos - a.votos);

  const vagasPorPartido = new Map(partidos.map((p) => [p.partidoId, p.quocientePartidario]));

  // Dentro de cada partido, os candidatos mais votados até o número de
  // vagas do partido são eleitos (titulares); os demais viram suplentes,
  // na ordem de votação. Simplificação: não trata "sobras" por médias.
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

  return {
    cargo,
    votosValidos,
    quocienteEleitoral,
    candidatos: candidatosComVotos.sort((a, b) => b.votos - a.votos),
    candidatosComSituacao: candidatosComSituacao.sort((a, b) => b.votos - a.votos),
    partidos,
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

