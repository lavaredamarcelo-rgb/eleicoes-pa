export type CandidatoSimulacao = {
  id: string;
  nome: string;
  numero: number;
  votos: number;
  partidoId: string;
  partidoSigla: string;
};

export type OverridePartido = { partidoId?: string; percentual?: number };

export type PartidoRef = { id: string; sigla: string; nome: string };

export function votosProjetados(votosAtuais: number, percentual: number) {
  return Math.max(0, Math.round(votosAtuais * (1 + percentual / 100)));
}

export type PartidoParaSobras = { partidoId: string; votos: number };

// Distribuição das vagas restantes pela regra da maior média (Lei 4.737/65,
// art. 109): após a divisão inicial pelo quociente partidário (votos do
// partido ÷ QE), as vagas que sobrarem vão, uma a uma, para o partido cuja
// média (votos ÷ (vagas atuais + 1)) for a maior a cada rodada. Só disputam
// as sobras os partidos que atingiram o quociente eleitoral (art. 109, §2º);
// se nenhum atingiu, todos disputam.
export function distribuirVagas(
  partidosComVotos: PartidoParaSobras[],
  vagasTotais: number,
  quocienteEleitoral: number
): Map<string, number> {
  const vagasPorPartido = new Map<string, number>();
  for (const p of partidosComVotos) {
    vagasPorPartido.set(
      p.partidoId,
      quocienteEleitoral > 0 ? Math.floor(p.votos / quocienteEleitoral) : 0
    );
  }

  const vagasDistribuidas = Array.from(vagasPorPartido.values()).reduce((s, v) => s + v, 0);
  let restantes = vagasTotais - vagasDistribuidas;

  let elegiveis = partidosComVotos.filter((p) => quocienteEleitoral > 0 && p.votos >= quocienteEleitoral);
  if (elegiveis.length === 0) {
    elegiveis = partidosComVotos;
  }

  while (restantes > 0 && elegiveis.length > 0) {
    let melhor: PartidoParaSobras | null = null;
    let melhorMedia = -1;
    for (const p of elegiveis) {
      const vagasAtuais = vagasPorPartido.get(p.partidoId) ?? 0;
      const media = p.votos / (vagasAtuais + 1);
      // Em empate de média, prevalece o partido com mais votos.
      if (media > melhorMedia || (media === melhorMedia && p.votos > (melhor?.votos ?? -1))) {
        melhorMedia = media;
        melhor = p;
      }
    }
    if (!melhor) break;
    vagasPorPartido.set(melhor.partidoId, (vagasPorPartido.get(melhor.partidoId) ?? 0) + 1);
    restantes--;
  }

  return vagasPorPartido;
}

export function calcularSimulacao(
  candidatos: CandidatoSimulacao[],
  vagas: number,
  overrides: Map<string, OverridePartido>,
  partidoById: Map<string, PartidoRef>
) {
  const efetivos = candidatos.map((c) => {
    const o = overrides.get(c.id);
    const partidoId = o?.partidoId ?? c.partidoId;
    const partido = partidoById.get(partidoId);
    const votosEfetivos = o?.percentual ? votosProjetados(c.votos, o.percentual) : c.votos;
    return {
      ...c,
      partidoIdEfetivo: partidoId,
      partidoSiglaEfetivo: partido?.sigla ?? c.partidoSigla,
      votosEfetivos,
    };
  });

  const votosValidos = efetivos.reduce((s, c) => s + c.votosEfetivos, 0);
  const quocienteEleitoral = vagas > 0 ? Math.floor(votosValidos / vagas) : 0;

  const porPartido = new Map<
    string,
    { partidoId: string; sigla: string; votos: number; candidatos: typeof efetivos }
  >();
  for (const c of efetivos) {
    let entry = porPartido.get(c.partidoIdEfetivo);
    if (!entry) {
      entry = { partidoId: c.partidoIdEfetivo, sigla: c.partidoSiglaEfetivo, votos: 0, candidatos: [] };
      porPartido.set(c.partidoIdEfetivo, entry);
    }
    entry.votos += c.votosEfetivos;
    entry.candidatos.push(c);
  }

  const vagasFinais = distribuirVagas(
    Array.from(porPartido.values()).map((p) => ({ partidoId: p.partidoId, votos: p.votos })),
    vagas,
    quocienteEleitoral
  );

  const partidos = Array.from(porPartido.values())
    .map((p) => ({
      ...p,
      quocientePartidario: vagasFinais.get(p.partidoId) ?? 0,
      percentual: votosValidos > 0 ? (p.votos / votosValidos) * 100 : 0,
    }))
    .sort((a, b) => b.votos - a.votos);

  const situacao = new Map<string, { situacao: "eleito" | "suplente"; ordemSuplencia: number | null }>();
  for (const p of partidos) {
    const ordenado = [...p.candidatos].sort((a, b) => b.votosEfetivos - a.votosEfetivos);
    ordenado.forEach((c, i) => {
      situacao.set(c.id, {
        situacao: i < p.quocientePartidario ? "eleito" : "suplente",
        ordemSuplencia: i < p.quocientePartidario ? null : i + 1 - p.quocientePartidario,
      });
    });
  }

  return { votosValidos, quocienteEleitoral, partidos, situacao, efetivos };
}
