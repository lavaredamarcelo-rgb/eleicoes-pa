"use client";

import { useMemo, useState } from "react";
import { distribuirVagas } from "@/lib/simulacaoPartido";

type Partido = { partidoId: string; sigla: string; votos: number };

// Simula uma federação partidária: os partidos escolhidos passam a disputar
// o quociente como uma legenda única (soma dos votos), e as cadeiras são
// redistribuídas pela mesma regra das sobras.
export function SimuladorFederacao({
  partidos,
  vagas,
  quocienteEleitoral,
}: {
  partidos: Partido[];
  vagas: number;
  quocienteEleitoral: number;
}) {
  const [selecionados, setSelecionados] = useState<Set<string>>(new Set());

  const antes = useMemo(
    () => distribuirVagas(partidos, vagas, quocienteEleitoral),
    [partidos, vagas, quocienteEleitoral]
  );

  const depois = useMemo(() => {
    if (selecionados.size < 2) return null;
    const membros = partidos.filter((p) => selecionados.has(p.partidoId));
    const outros = partidos.filter((p) => !selecionados.has(p.partidoId));
    const federacao = {
      partidoId: "__federacao__",
      votos: membros.reduce((s, p) => s + p.votos, 0),
    };
    return distribuirVagas(
      [...outros.map((p) => ({ partidoId: p.partidoId, votos: p.votos })), federacao],
      vagas,
      quocienteEleitoral
    );
  }, [partidos, selecionados, vagas, quocienteEleitoral]);

  const cadeirasAntesMembros = partidos
    .filter((p) => selecionados.has(p.partidoId))
    .reduce((s, p) => s + (antes.get(p.partidoId) ?? 0), 0);
  const cadeirasFederacao = depois?.get("__federacao__") ?? 0;
  const delta = cadeirasFederacao - cadeirasAntesMembros;

  function alternar(id: string) {
    setSelecionados((s) => {
      const novo = new Set(s);
      if (novo.has(id)) novo.delete(id);
      else novo.add(id);
      return novo;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="mb-2 text-sm font-medium text-neutral-300">
          Escolha 2 ou mais partidos para federar
        </p>
        <div className="flex flex-wrap gap-2">
          {partidos.map((p) => (
            <button
              key={p.partidoId}
              onClick={() => alternar(p.partidoId)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
                selecionados.has(p.partidoId)
                  ? "bg-orange-600 text-white"
                  : "border border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
              }`}
            >
              {p.sigla} · {(antes.get(p.partidoId) ?? 0)} vaga{(antes.get(p.partidoId) ?? 0) !== 1 ? "s" : ""}
            </button>
          ))}
        </div>
      </div>

      {depois && (
        <>
          <div
            className={`rounded-xl border px-4 py-3 ${
              delta > 0
                ? "border-emerald-900 bg-emerald-950/40"
                : delta < 0
                  ? "border-red-900 bg-red-950/30"
                  : "border-neutral-800 bg-neutral-900"
            }`}
          >
            <p className="text-sm font-medium text-neutral-200">
              Federação ({partidos.filter((p) => selecionados.has(p.partidoId)).map((p) => p.sigla).join(" + ")})
            </p>
            <p className="mt-1 text-2xl font-bold text-amber-400">
              {cadeirasFederacao} cadeira{cadeirasFederacao !== 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-xs text-neutral-400">
              Separados, os partidos somavam {cadeirasAntesMembros} —{" "}
              {delta > 0
                ? `a federação ganha ${delta} cadeira${delta !== 1 ? "s" : ""}.`
                : delta < 0
                  ? `a federação perde ${Math.abs(delta)} cadeira${Math.abs(delta) !== 1 ? "s" : ""}.`
                  : "sem mudança no total."}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-300">Efeito nos demais partidos</p>
            {partidos
              .filter((p) => !selecionados.has(p.partidoId))
              .map((p) => {
                const va = antes.get(p.partidoId) ?? 0;
                const vd = depois.get(p.partidoId) ?? 0;
                const d = vd - va;
                if (va === 0 && vd === 0) return null;
                return (
                  <div key={p.partidoId} className="flex items-center justify-between text-xs">
                    <span className="text-neutral-300">{p.sigla}</span>
                    <span className={d < 0 ? "text-red-400" : d > 0 ? "text-emerald-400" : "text-neutral-500"}>
                      {va} → {vd} {d !== 0 ? `(${d > 0 ? "+" : ""}${d})` : ""}
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      )}

      <p className="text-xs text-neutral-600">
        Projeção hipotética com os votos reais dessa disputa — nada é alterado no sistema.
      </p>
    </div>
  );
}
