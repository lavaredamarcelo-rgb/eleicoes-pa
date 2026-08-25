"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import BotaoFavoritar from "@/components/BotaoFavoritar";

type Candidato = {
  id: string;
  nome: string;
  numero: number;
  votos: number;
  ordemSuplencia: number | null;
  partidoId: string;
  partidoSigla: string;
};

export function SuplentesPorPartido({
  candidatos,
  cadeirasPorPartido,
}: {
  candidatos: Candidato[];
  cadeirasPorPartido: Record<string, number>;
}) {
  const [abertos, setAbertos] = useState<Record<string, boolean>>({});
  const toggle = (id: string) =>
    setAbertos((prev) => ({ ...prev, [id]: !prev[id] }));

  const porPartido = new Map<string, { sigla: string; lista: Candidato[] }>();
  for (const c of candidatos) {
    let g = porPartido.get(c.partidoId);
    if (!g) {
      g = { sigla: c.partidoSigla, lista: [] };
      porPartido.set(c.partidoId, g);
    }
    g.lista.push(c);
  }
  const grupos = Array.from(porPartido.entries()).map(([partidoId, g]) => ({
    partidoId,
    sigla: g.sigla,
    cadeiras: cadeirasPorPartido[partidoId] ?? 0,
    lista: g.lista.sort(
      (a, b) => (a.ordemSuplencia ?? 0) - (b.ordemSuplencia ?? 0)
    ),
  }));

  const comCadeira = grupos
    .filter((g) => g.cadeiras > 0)
    .sort((a, b) => b.cadeiras - a.cadeiras || a.sigla.localeCompare(b.sigla));
  const semCadeira = grupos
    .filter((g) => g.cadeiras === 0)
    .sort((a, b) => a.sigla.localeCompare(b.sigla));

  const renderGrupo = (g: (typeof grupos)[number], rotulo: string) => (
    <div key={g.partidoId}>
      <button
        onClick={() => toggle(g.partidoId)}
        className="flex w-full items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 text-left transition hover:bg-neutral-800"
      >
        <span className="text-sm font-medium text-neutral-200">
          {g.sigla}{" "}
          <span className="text-xs text-neutral-500">
            · {rotulo} · {g.lista.length}{" "}
            {g.lista.length === 1 ? "nome" : "nomes"}
          </span>
        </span>
        {abertos[g.partidoId] ? (
          <ChevronUp size={15} className="text-neutral-500" />
        ) : (
          <ChevronDown size={15} className="text-neutral-500" />
        )}
      </button>
      {abertos[g.partidoId] && (
        <div className="mt-1 flex flex-col gap-1">
          {g.lista.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between rounded-xl border border-neutral-800/60 bg-neutral-950 px-4 py-2"
            >
              <div className="flex items-center gap-3">
                <span className="w-9 text-right text-xs text-neutral-600">
                  {g.cadeiras > 0 ? `${c.ordemSuplencia}º` : "—"}
                </span>
                <div>
                  <p className="text-sm">{c.nome}</p>
                  <p className="text-xs text-neutral-500">{c.numero}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-amber-400">
                  {c.votos.toLocaleString("pt-BR")}
                </span>
                <BotaoFavoritar candidatoId={c.id} tamanho="md" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Suplentes — por partido (clique para abrir)
        </h2>
        {comCadeira.length === 0 ? (
          <p className="text-xs text-neutral-500">Nenhum suplente</p>
        ) : (
          comCadeira.map((g) =>
            renderGrupo(g, `${g.cadeiras} cadeira${g.cadeiras > 1 ? "s" : ""}`)
          )
        )}
      </section>

      {semCadeira.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Não eleitos — partidos sem cadeira
          </h2>
          <p className="text-xs text-neutral-600">
            Partido não conquistou vaga nesta disputa, então a lista não gera
            suplência efetiva — os nomes ficam em ordem de votação.
          </p>
          {semCadeira.map((g) => renderGrupo(g, "sem cadeira"))}
        </section>
      )}
    </div>
  );
}
