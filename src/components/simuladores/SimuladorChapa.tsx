"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";
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

// Cenário de chapa: ajuste os votos de VÁRIOS candidatos ao mesmo tempo
// (crescimento % ou valor absoluto); quociente, cadeiras por partido e
// situação de cada candidato são recalculados ao vivo.
export function SimuladorChapa({
  candidatos,
  partidos,
  vagas,
}: {
  candidatos: Candidato[];
  partidos: Partido[];
  vagas: number;
}) {
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const [ajustes, setAjustes] = useState<Record<string, number>>({});
  const [busca, setBusca] = useState("");

  const sugestoes = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return [];
    return candidatos
      .filter(
        (c) =>
          !selecionados.includes(c.id) &&
          (c.nome.toLowerCase().includes(termo) || String(c.numero).startsWith(termo))
      )
      .slice(0, 8);
  }, [busca, candidatos, selecionados]);

  const resultado = useMemo(() => {
    if (selecionados.length === 0) return null;

    const votosAjustados = new Map<string, number>();
    for (const id of selecionados) {
      const c = candidatos.find((x) => x.id === id)!;
      votosAjustados.set(id, Math.max(0, Math.round(c.votos * (1 + (ajustes[id] ?? 0) / 100))));
    }

    // Totais por partido: base real + deltas dos ajustados.
    const porPartido = new Map(partidos.map((p) => [p.partidoId, p.votos]));
    let votosValidos = partidos.reduce((s, p) => s + p.votos, 0);
    for (const id of selecionados) {
      const c = candidatos.find((x) => x.id === id)!;
      const delta = (votosAjustados.get(id) ?? c.votos) - c.votos;
      porPartido.set(c.partidoId, (porPartido.get(c.partidoId) ?? 0) + delta);
      votosValidos += delta;
    }

    const qe = vagas > 0 ? Math.floor(votosValidos / vagas) : 0;
    const cadeiras = distribuirVagas(
      Array.from(porPartido.entries()).map(([partidoId, votos]) => ({ partidoId, votos })),
      vagas,
      qe
    );

    // Situação de cada candidato ajustado dentro do próprio partido.
    const situacoes = selecionados.map((id) => {
      const c = candidatos.find((x) => x.id === id)!;
      const votosNovos = votosAjustados.get(id)!;
      const doPartido = candidatos
        .filter((x) => x.partidoId === c.partidoId)
        .map((x) => ({ id: x.id, votos: selecionados.includes(x.id) ? votosAjustados.get(x.id)! : x.votos }))
        .sort((a, b) => b.votos - a.votos);
      const posicao = doPartido.findIndex((x) => x.id === id) + 1;
      const vagasPartido = cadeiras.get(c.partidoId) ?? 0;
      return { c, votosNovos, posicao, vagasPartido, eleito: posicao <= vagasPartido };
    });

    return { qe, votosValidos, cadeiras, situacoes };
  }, [selecionados, ajustes, candidatos, partidos, vagas]);

  function adicionar(id: string) {
    setSelecionados((s) => [...s, id]);
    setBusca("");
  }
  function remover(id: string) {
    setSelecionados((s) => s.filter((x) => x !== id));
    setAjustes((a) => {
      const { [id]: _, ...resto } = a;
      return resto;
    });
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <label className="mb-1 block text-xs text-neutral-500">
          Adicionar candidato ao cenário (busque por nome ou número)
        </label>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Ex.: Maria, 15123…"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
        />
        {sugestoes.length > 0 && (
          <div className="mt-2 flex flex-col gap-1">
            {sugestoes.map((s) => (
              <button
                key={s.id}
                onClick={() => adicionar(s.id)}
                className="flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left text-sm transition-colors hover:border-neutral-600"
              >
                <span>
                  {s.nome} <span className="text-xs text-neutral-500">({s.numero} · {s.partidoSigla})</span>
                </span>
                <span className="text-xs text-amber-400">{s.votos.toLocaleString("pt-BR")}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {resultado && (
        <>
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="text-sm font-medium text-neutral-300">Ajustes do cenário</p>
            {resultado.situacoes.map(({ c, votosNovos, posicao, vagasPartido, eleito }) => (
              <div key={c.id} className="rounded-lg border border-neutral-800 bg-neutral-950 p-3">
                <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                  <span className="flex items-center gap-2">
                    <button
                      onClick={() => remover(c.id)}
                      className="rounded-full p-0.5 text-neutral-600 hover:text-red-400"
                      title="Remover do cenário"
                    >
                      <X size={13} />
                    </button>
                    <span className="font-medium">{c.nome}</span>
                    <span className="text-xs text-neutral-500">
                      {c.numero} · {c.partidoSigla}
                    </span>
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      eleito ? "bg-emerald-950 text-emerald-300" : "bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {eleito ? "Eleito" : `${posicao}º do partido (${vagasPartido} vaga${vagasPartido !== 1 ? "s" : ""})`}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={-50}
                    max={200}
                    value={ajustes[c.id] ?? 0}
                    onChange={(e) => setAjustes((a) => ({ ...a, [c.id]: Number(e.target.value) }))}
                    className="flex-1"
                    style={{ accentColor: "#fbbf24" }}
                  />
                  <span className="w-32 text-right text-xs">
                    <span className={ajustes[c.id] ? "text-amber-400" : "text-neutral-500"}>
                      {(ajustes[c.id] ?? 0) > 0 ? "+" : ""}
                      {ajustes[c.id] ?? 0}%
                    </span>{" "}
                    <span className="font-medium text-neutral-200">
                      {votosNovos.toLocaleString("pt-BR")}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-amber-900 bg-amber-950/40 px-3 py-3 text-center">
              <p className="text-lg font-bold text-amber-300">{resultado.qe.toLocaleString("pt-BR")}</p>
              <p className="text-[11px] text-neutral-400">QE do cenário</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
              <p className="text-lg font-semibold">{resultado.votosValidos.toLocaleString("pt-BR")}</p>
              <p className="text-[11px] text-neutral-500">Votos válidos projetados</p>
            </div>
          </div>

          <div className="flex flex-col gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <p className="mb-1 text-sm font-medium text-neutral-300">Cadeiras por partido no cenário</p>
            {partidos
              .map((p) => ({ ...p, depois: resultado.cadeiras.get(p.partidoId) ?? 0 }))
              .filter((p) => p.depois > 0)
              .sort((a, b) => b.depois - a.depois)
              .map((p) => (
                <div key={p.partidoId} className="flex items-center justify-between text-xs">
                  <span className="text-neutral-300">{p.sigla}</span>
                  <span className="text-neutral-400">{p.depois} cadeira{p.depois !== 1 ? "s" : ""}</span>
                </div>
              ))}
          </div>
        </>
      )}

      <p className="text-xs text-neutral-600">
        Projeção hipotética com os votos reais da disputa — nada é alterado no sistema.
      </p>
    </div>
  );
}
