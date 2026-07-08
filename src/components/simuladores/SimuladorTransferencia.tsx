"use client";

import { useMemo, useState } from "react";
import { distribuirVagas } from "@/lib/simulacaoPartido";

type Candidato = {
  id: string;
  nome: string;
  numero: number;
  partidoId: string;
  partidoSigla: string;
  votos: number;
};
type Partido = { partidoId: string; sigla: string; votos: number };

// "E se o candidato X desistir e apoiar Y?" — parte dos votos de X migra
// para Y (o restante se perde em abstenção), o quociente é recalculado e a
// distribuição de cadeiras é refeita.
export function SimuladorTransferencia({
  candidatos,
  partidos,
  vagas,
}: {
  candidatos: Candidato[];
  partidos: Partido[];
  vagas: number;
}) {
  const [origemId, setOrigemId] = useState("");
  const [destinoId, setDestinoId] = useState("");
  const [pct, setPct] = useState(70);

  const origem = candidatos.find((c) => c.id === origemId);
  const destino = candidatos.find((c) => c.id === destinoId);

  const resultado = useMemo(() => {
    if (!origem || !destino || origem.id === destino.id) return null;

    const transferidos = Math.round(origem.votos * (pct / 100));
    const votosValidosAntes = partidos.reduce((s, p) => s + p.votos, 0);
    const votosValidosDepois = votosValidosAntes - origem.votos + transferidos;
    const qeAntes = vagas > 0 ? Math.floor(votosValidosAntes / vagas) : 0;
    const qeDepois = vagas > 0 ? Math.floor(votosValidosDepois / vagas) : 0;

    const partidosDepois = partidos.map((p) => {
      let votos = p.votos;
      if (p.partidoId === origem.partidoId) votos -= origem.votos;
      if (p.partidoId === destino.partidoId) votos += transferidos;
      return { partidoId: p.partidoId, votos };
    });

    const antes = distribuirVagas(partidos, vagas, qeAntes);
    const depois = distribuirVagas(partidosDepois, vagas, qeDepois);

    // Posição do destino dentro do partido, com os novos votos.
    const doPartido = candidatos
      .filter((c) => c.partidoId === destino.partidoId && c.id !== origem.id)
      .map((c) => ({ ...c, votos: c.id === destino.id ? c.votos + transferidos : c.votos }))
      .sort((a, b) => b.votos - a.votos);
    const posicao = doPartido.findIndex((c) => c.id === destino.id) + 1;
    const vagasDestino = depois.get(destino.partidoId) ?? 0;

    return {
      transferidos,
      qeAntes,
      qeDepois,
      antes,
      depois,
      votosDestino: destino.votos + transferidos,
      destinoEleito: posicao > 0 && posicao <= vagasDestino,
      posicao,
      vagasDestino,
    };
  }, [origem, destino, pct, candidatos, partidos, vagas]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Quem desiste (origem)</label>
          <select
            value={origemId}
            onChange={(e) => setOrigemId(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Escolha…</option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} ({c.partidoSigla} · {c.votos.toLocaleString("pt-BR")})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Quem recebe (destino)</label>
          <select
            value={destinoId}
            onChange={(e) => setDestinoId(e.target.value)}
            className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Escolha…</option>
            {candidatos
              .filter((c) => c.id !== origemId)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nome} ({c.partidoSigla} · {c.votos.toLocaleString("pt-BR")})
                </option>
              ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs text-neutral-500">
            Fidelidade da transferência: {pct}% (o restante vira abstenção)
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => setPct(Number(e.target.value))}
            className="w-full accent-amber-400"
          />
        </div>
      </div>

      {resultado && origem && destino && (
        <>
          <div
            className={`rounded-xl border px-4 py-3 ${
              resultado.destinoEleito
                ? "border-emerald-900 bg-emerald-950/40"
                : "border-neutral-800 bg-neutral-900"
            }`}
          >
            <p className="text-sm text-neutral-300">
              {destino.nome} ficaria com{" "}
              <span className="font-semibold text-amber-400">
                {resultado.votosDestino.toLocaleString("pt-BR")} votos
              </span>{" "}
              (+{resultado.transferidos.toLocaleString("pt-BR")})
            </p>
            <p className="mt-1 text-sm font-medium text-neutral-200">
              {resultado.destinoEleito
                ? `✓ Seria eleito — ${resultado.posicao}º do ${destino.partidoSigla}, que ficaria com ${resultado.vagasDestino} vaga${resultado.vagasDestino !== 1 ? "s" : ""}.`
                : `Ainda não se elegeria — ${resultado.posicao}º do ${destino.partidoSigla}, que ficaria com ${resultado.vagasDestino} vaga${resultado.vagasDestino !== 1 ? "s" : ""}.`}
            </p>
            <p className="mt-1 text-xs text-neutral-500">
              QE: {resultado.qeAntes.toLocaleString("pt-BR")} → {resultado.qeDepois.toLocaleString("pt-BR")}
            </p>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-300">Cadeiras por partido</p>
            {partidos.map((p) => {
              const va = resultado.antes.get(p.partidoId) ?? 0;
              const vd = resultado.depois.get(p.partidoId) ?? 0;
              if (va === 0 && vd === 0) return null;
              const d = vd - va;
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
        Projeção hipotética — nada é alterado no sistema.
      </p>
    </div>
  );
}
