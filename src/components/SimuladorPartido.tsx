"use client";

import { useEffect, useMemo, useState } from "react";
import { PdfDownloadLink } from "./PdfDownloadLink";
import { CandidatoCombobox } from "./CandidatoCombobox";
import {
  calcularSimulacao,
  votosProjetados,
  type CandidatoSimulacao,
  type OverridePartido,
} from "@/lib/simulacaoPartido";

type Partido = { id: string; sigla: string; nome: string };

export function SimuladorPartido({
  cargoId,
  candidatos,
  partidos,
  vagas,
  quocienteEleitoral,
  candidatoInicialId,
}: {
  cargoId: string;
  candidatos: (CandidatoSimulacao & { situacaoOriginal: "eleito" | "suplente" })[];
  partidos: Partido[];
  vagas: number;
  quocienteEleitoral: number;
  candidatoInicialId?: string;
}) {
  const [overrides, setOverrides] = useState<Map<string, OverridePartido>>(new Map());
  const [candidatoSelecionado, setCandidatoSelecionado] = useState(
    candidatoInicialId && candidatos.some((c) => c.id === candidatoInicialId)
      ? candidatoInicialId
      : ""
  );
  const [novoPartido, setNovoPartido] = useState("");
  const [percentual, setPercentual] = useState(0);

  const partidoById = useMemo(() => new Map(partidos.map((p) => [p.id, p])), [partidos]);
  const candidatoById = useMemo(() => new Map(candidatos.map((c) => [c.id, c])), [candidatos]);
  const candidatoOptions = useMemo(
    () =>
      candidatos.map((c) => ({
        id: c.id,
        label: `${c.nome} (${partidoById.get(overrides.get(c.id)?.partidoId ?? c.partidoId)?.sigla ?? c.partidoSigla})`,
      })),
    [candidatos, partidoById, overrides]
  );

  useEffect(() => {
    if (candidatoSelecionado) {
      document.getElementById("simulador")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resultado = useMemo(
    () => calcularSimulacao(candidatos, vagas, overrides, partidoById),
    [candidatos, vagas, overrides, partidoById]
  );

  const simulacaoAtiva = overrides.size > 0;

  const candidatoAtual = candidatoById.get(candidatoSelecionado);
  const previaVotos = candidatoAtual ? votosProjetados(candidatoAtual.votos, percentual) : 0;

  function aplicar() {
    if (!candidatoSelecionado || (!novoPartido && percentual === 0)) return;
    setOverrides((prev) => {
      const next = new Map(prev);
      next.set(candidatoSelecionado, {
        partidoId: novoPartido || undefined,
        percentual: percentual !== 0 ? percentual : undefined,
      });
      return next;
    });
    setCandidatoSelecionado("");
    setNovoPartido("");
    setPercentual(0);
  }

  function remover(candidatoId: string) {
    setOverrides((prev) => {
      const next = new Map(prev);
      next.delete(candidatoId);
      return next;
    });
  }

  const primeiroOverrideId = Array.from(overrides.keys())[0];
  const primeiroOverride = primeiroOverrideId ? overrides.get(primeiroOverrideId) : undefined;
  const pdfHref = primeiroOverrideId
    ? `/api/pdf/simulacao/${cargoId}?candidato=${primeiroOverrideId}${
        primeiroOverride?.partidoId ? `&partido=${primeiroOverride.partidoId}` : ""
      }${primeiroOverride?.percentual ? `&percentual=${primeiroOverride.percentual}` : ""}`
    : null;

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-amber-900/50 bg-amber-950/10 p-4">
      <div>
        <h2 className="text-sm font-medium text-amber-300">Simulador de cenários</h2>
        <p className="text-xs text-neutral-500">
          Teste hipóteses sem alterar os dados reais — troca de partido, crescimento de votos ou
          os dois combinados, para avaliar se um candidato se elegeria em um cenário futuro.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <CandidatoCombobox
          candidatos={candidatoOptions}
          value={candidatoSelecionado}
          onChange={setCandidatoSelecionado}
        />

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={novoPartido}
            onChange={(e) => setNovoPartido(e.target.value)}
            className="flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Manter partido atual</option>
            {partidos.map((p) => (
              <option key={p.id} value={p.id}>
                {p.sigla}
              </option>
            ))}
          </select>
          <button
            onClick={aplicar}
            disabled={!candidatoSelecionado || (!novoPartido && percentual === 0)}
            className="rounded-lg bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-600 disabled:opacity-40"
          >
            Simular
          </button>
        </div>

        <div>
          <label className="mb-1 flex items-center justify-between text-xs text-neutral-500">
            <span>Crescimento de votos projetado</span>
            {candidatoAtual && (
              <span className="text-neutral-400">
                {candidatoAtual.votos.toLocaleString("pt-BR")} →{" "}
                <span className="font-medium text-blue-400">
                  {previaVotos.toLocaleString("pt-BR")}
                </span>
              </span>
            )}
          </label>
          <div className="flex items-center gap-3">
            <input
              type="range"
              min={-50}
              max={100}
              value={percentual}
              onChange={(e) => setPercentual(Number(e.target.value))}
              className="flex-1"
            />
            <span className="w-14 text-right text-sm font-semibold text-blue-400">
              {percentual > 0 ? "+" : ""}
              {percentual}%
            </span>
          </div>
        </div>
      </div>

      {simulacaoAtiva && (
        <>
          <div className="flex flex-col gap-1.5">
            {Array.from(overrides.entries()).map(([candidatoId, o]) => {
              const c = candidatoById.get(candidatoId);
              if (!c) return null;
              return (
                <div
                  key={candidatoId}
                  className="flex flex-col gap-0.5 rounded-lg bg-neutral-900 px-3 py-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.nome}</span>
                    <button
                      onClick={() => remover(candidatoId)}
                      className="text-neutral-500 hover:text-red-400"
                    >
                      remover
                    </button>
                  </div>
                  <span className="text-neutral-400">
                    {o.partidoId && (
                      <>
                        {c.partidoSigla} → {partidoById.get(o.partidoId)?.sigla}
                        {o.percentual ? " · " : ""}
                      </>
                    )}
                    {o.percentual
                      ? `${c.votos.toLocaleString("pt-BR")} → ${votosProjetados(
                          c.votos,
                          o.percentual
                        ).toLocaleString("pt-BR")} votos (${o.percentual > 0 ? "+" : ""}${o.percentual}%)`
                      : ""}
                  </span>
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

          {resultado.quocienteEleitoral !== quocienteEleitoral && (
            <div className="rounded-lg bg-neutral-900 px-3 py-2 text-xs">
              <span className="text-neutral-500">Quociente eleitoral: </span>
              {quocienteEleitoral.toLocaleString("pt-BR")}
              {" → "}
              <span className="font-medium text-blue-400">
                {resultado.quocienteEleitoral.toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-neutral-500">
              Vagas por partido (simulado)
            </p>
            {resultado.partidos.map((p) => (
              <div
                key={p.partidoId}
                className="flex items-center justify-between rounded-lg bg-neutral-900 px-3 py-2 text-sm"
              >
                <span>{p.sigla}</span>
                <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs">
                  {p.quocientePartidario} {p.quocientePartidario === 1 ? "vaga" : "vagas"}
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

          {pdfHref && <PdfDownloadLink href={pdfHref} label="Baixar PDF desta simulação" />}
        </>
      )}
    </section>
  );
}
