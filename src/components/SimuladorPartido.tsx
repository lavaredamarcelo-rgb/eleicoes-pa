"use client";

import { useMemo, useState } from "react";

type Candidato = {
  id: string;
  nome: string;
  numero: number;
  votos: number;
  partidoId: string;
  partidoSigla: string;
  situacaoOriginal: "eleito" | "suplente";
};

type Partido = { id: string; sigla: string; nome: string };

export function SimuladorPartido({
  candidatos,
  partidos,
  quocienteEleitoral,
}: {
  candidatos: Candidato[];
  partidos: Partido[];
  quocienteEleitoral: number;
}) {
  const [overrides, setOverrides] = useState<Map<string, string>>(new Map());
  const [candidatoSelecionado, setCandidatoSelecionado] = useState("");
  const [novoPartido, setNovoPartido] = useState("");

  const partidoById = useMemo(() => new Map(partidos.map((p) => [p.id, p])), [partidos]);
  const candidatoById = useMemo(() => new Map(candidatos.map((c) => [c.id, c])), [candidatos]);

  const resultado = useMemo(() => {
    const porPartido = new Map<
      string,
      { partidoId: string; sigla: string; votos: number; candidatos: Candidato[] }
    >();
    for (const c of candidatos) {
      const partidoId = overrides.get(c.id) ?? c.partidoId;
      const partido = partidoById.get(partidoId);
      if (!partido) continue;
      let entry = porPartido.get(partidoId);
      if (!entry) {
        entry = { partidoId, sigla: partido.sigla, votos: 0, candidatos: [] };
        porPartido.set(partidoId, entry);
      }
      entry.votos += c.votos;
      entry.candidatos.push(c);
    }

    const partidosResumo = Array.from(porPartido.values())
      .map((p) => ({
        ...p,
        vagas: quocienteEleitoral > 0 ? Math.floor(p.votos / quocienteEleitoral) : 0,
      }))
      .sort((a, b) => b.votos - a.votos);

    const situacao = new Map<
      string,
      { situacao: "eleito" | "suplente"; ordemSuplencia: number | null }
    >();
    for (const p of partidosResumo) {
      const ordenado = [...p.candidatos].sort((a, b) => b.votos - a.votos);
      ordenado.forEach((c, i) => {
        situacao.set(c.id, {
          situacao: i < p.vagas ? "eleito" : "suplente",
          ordemSuplencia: i < p.vagas ? null : i + 1 - p.vagas,
        });
      });
    }

    return { partidosResumo, situacao };
  }, [candidatos, overrides, partidoById, quocienteEleitoral]);

  const simulacaoAtiva = overrides.size > 0;

  function aplicar() {
    if (!candidatoSelecionado || !novoPartido) return;
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(candidatoSelecionado, novoPartido);
      return next;
    });
    setCandidatoSelecionado("");
    setNovoPartido("");
  }

  function remover(candidatoId: string) {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.delete(candidatoId);
      return next;
    });
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-amber-900/50 bg-amber-950/10 p-4">
      <div>
        <h2 className="text-sm font-medium text-amber-300">Simulador de troca de partido</h2>
        <p className="text-xs text-neutral-500">
          Teste hipóteses sem alterar os dados reais — útil para projetar o efeito de uma
          possível troca de legenda no resultado.
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={candidatoSelecionado}
          onChange={(e) => setCandidatoSelecionado(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="">Candidato...</option>
          {candidatos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome} ({partidoById.get(overrides.get(c.id) ?? c.partidoId)?.sigla ?? c.partidoSigla})
            </option>
          ))}
        </select>
        <select
          value={novoPartido}
          onChange={(e) => setNovoPartido(e.target.value)}
          className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="">Novo partido...</option>
          {partidos.map((p) => (
            <option key={p.id} value={p.id}>
              {p.sigla}
            </option>
          ))}
        </select>
        <button
          onClick={aplicar}
          disabled={!candidatoSelecionado || !novoPartido}
          className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-40"
        >
          Simular
        </button>
      </div>

      {simulacaoAtiva && (
        <>
          <div className="flex flex-col gap-1.5">
            {Array.from(overrides.entries()).map(([candidatoId, partidoId]) => {
              const c = candidatoById.get(candidatoId);
              if (!c) return null;
              return (
                <div
                  key={candidatoId}
                  className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-1.5 text-xs"
                >
                  <span>
                    {c.nome}: {c.partidoSigla} → {partidoById.get(partidoId)?.sigla}
                  </span>
                  <button
                    onClick={() => remover(candidatoId)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    remover
                  </button>
                </div>
              );
            })}
            <button
              onClick={() => setOverrides(new Map())}
              className="self-start text-xs text-neutral-500 underline hover:text-neutral-300"
            >
              Limpar simulação
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">
              Vagas por partido (simulado)
            </p>
            {resultado.partidosResumo.map((p) => (
              <div
                key={p.partidoId}
                className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-sm"
              >
                <span>{p.sigla}</span>
                <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs">
                  {p.vagas} {p.vagas === 1 ? "vaga" : "vagas"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">Candidatos que mudam de situação</p>
            {candidatos
              .filter((c) => {
                const nova = resultado.situacao.get(c.id);
                return nova && nova.situacao !== c.situacaoOriginal;
              })
              .map((c) => {
                const nova = resultado.situacao.get(c.id)!;
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-sm"
                  >
                    <span>{c.nome}</span>
                    <span>
                      <span className="text-neutral-500">
                        {c.situacaoOriginal === "eleito" ? "Eleito" : "Suplente"}
                      </span>
                      {" → "}
                      <span
                        className={
                          nova.situacao === "eleito" ? "text-emerald-400" : "text-amber-400"
                        }
                      >
                        {nova.situacao === "eleito" ? "Eleito" : `${nova.ordemSuplencia}º suplente`}
                      </span>
                    </span>
                  </div>
                );
              })}
            {candidatos.every((c) => resultado.situacao.get(c.id)?.situacao === c.situacaoOriginal) && (
              <p className="text-xs text-neutral-600">
                Nenhuma mudança de situação com essa simulação.
              </p>
            )}
          </div>
        </>
      )}
    </section>
  );
}
