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

  const partidos = Array.from(porPartido.values())
    .map((p) => ({
      ...p,
      quocientePartidario: quocienteEleitoral > 0 ? Math.floor(p.votos / quocienteEleitoral) : 0,
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
