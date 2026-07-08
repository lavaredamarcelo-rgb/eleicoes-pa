"use client";

import { useMemo, useState } from "react";

type Candidato = { id: string; nome: string; partidoSigla: string; votos: number };

// Cenário hipotético de 2º turno: os dois mais votados seguem; para cada
// eliminado o usuário define quanto dos votos migra para o 1º colocado (o
// restante vai para o 2º), além de uma abstenção global sobre esses votos.
export function SimuladorSegundoTurno({ candidatos }: { candidatos: Candidato[] }) {
  const [a, b, ...eliminados] = candidatos;
  const [destinoA, setDestinoA] = useState<Record<string, number>>({});
  const [abstencao, setAbstencao] = useState(20);

  const resultado = useMemo(() => {
    if (!a || !b) return null;
    let totalA = a.votos;
    let totalB = b.votos;
    for (const e of eliminados) {
      const aproveitados = e.votos * (1 - abstencao / 100);
      const pctA = destinoA[e.id] ?? 50;
      totalA += (aproveitados * pctA) / 100;
      totalB += aproveitados * (1 - pctA / 100);
    }
    return { totalA: Math.round(totalA), totalB: Math.round(totalB) };
  }, [a, b, eliminados, destinoA, abstencao]);

  if (!a || !b) {
    return (
      <p className="text-sm text-neutral-500">
        Essa disputa não tem dois candidatos com votos para simular um 2º turno.
      </p>
    );
  }

  const total = (resultado?.totalA ?? 0) + (resultado?.totalB ?? 0);
  const pctA = total > 0 ? ((resultado?.totalA ?? 0) / total) * 100 : 50;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="mb-3 text-sm font-medium text-neutral-300">Resultado projetado</p>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium">
            {a.nome} <span className="text-xs text-neutral-500">({a.partidoSigla})</span>
          </span>
          <span className="font-medium">
            {b.nome} <span className="text-xs text-neutral-500">({b.partidoSigla})</span>
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-neutral-800">
          <div className="h-3 bg-amber-400 transition-all duration-300" style={{ width: `${pctA}%` }} />
          <div className="h-3 bg-neutral-600 transition-all duration-300" style={{ width: `${100 - pctA}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-amber-400">
            {resultado?.totalA.toLocaleString("pt-BR")} ({pctA.toFixed(1)}%)
          </span>
          <span className="font-semibold text-neutral-300">
            {resultado?.totalB.toLocaleString("pt-BR")} ({(100 - pctA).toFixed(1)}%)
          </span>
        </div>
        <p className="mt-2 text-xs text-neutral-500">
          Vencedor projetado:{" "}
          <span className="font-medium text-neutral-200">
            {pctA >= 50 ? a.nome : b.nome}
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <label className="mb-1 block text-xs text-neutral-500">
          Abstenção dos votos dos eliminados: {abstencao}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={abstencao}
          onChange={(e) => setAbstencao(Number(e.target.value))}
          className="w-full accent-amber-400"
        />
      </div>

      {eliminados.length > 0 && (
        <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <p className="text-sm font-medium text-neutral-300">
            Para onde vão os votos de cada eliminado?
          </p>
          {eliminados.map((e) => {
            const pct = destinoA[e.id] ?? 50;
            return (
              <div key={e.id}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-neutral-300">
                    {e.nome} <span className="text-neutral-600">({e.partidoSigla} · {e.votos.toLocaleString("pt-BR")} votos)</span>
                  </span>
                  <span className="text-neutral-500">
                    {pct}% → {a.nome.split(" ")[0]} · {100 - pct}% → {b.nome.split(" ")[0]}
                  </span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={pct}
                  onChange={(ev) => setDestinoA((s) => ({ ...s, [e.id]: Number(ev.target.value) }))}
                  className="w-full accent-amber-400"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
