"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Users } from "lucide-react";

const CARGOS_ORDEM = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

type CandidatoTSE = {
  cargo: string;
  nome: string;
  numero: number;
  partido: string;
  federacao: string;
  situacao: string;
};

export function CandidatosTSE({ candidatos }: { candidatos: CandidatoTSE[] }) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});
  const [busca, setBusca] = useState("");

  const filtrados = busca.trim()
    ? candidatos.filter((c) =>
        c.nome.toLowerCase().includes(busca.trim().toLowerCase())
      )
    : candidatos;

  const porCargo = CARGOS_ORDEM.map((cargo) => ({
    cargo,
    lista: filtrados.filter((c) => c.cargo === cargo),
  })).filter((g) => g.lista.length > 0);

  const toggle = (cargo: string) => {
    setExpandidos((prev) => ({ ...prev, [cargo]: !prev[cargo] }));
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-900/50 bg-emerald-950/10 p-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
          <Users size={16} />
          Candidaturas registradas no TSE · 2026 ({candidatos.length})
        </div>
      </div>

      <input
        type="text"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
        placeholder="Buscar candidato pelo nome..."
        className="w-full rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-200 placeholder-neutral-600 outline-none focus:border-emerald-800"
      />

      <div className="space-y-2">
        {porCargo.map((grupo) => {
          const aberto = expandidos[grupo.cargo] || busca.trim().length > 0;
          return (
            <div key={grupo.cargo}>
              <button
                onClick={() => toggle(grupo.cargo)}
                className="w-full flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left transition hover:bg-neutral-900"
              >
                <span className="text-xs font-medium text-neutral-300">
                  {grupo.cargo} ({grupo.lista.length})
                </span>
                {aberto ? (
                  <ChevronUp size={14} className="text-neutral-500" />
                ) : (
                  <ChevronDown size={14} className="text-neutral-500" />
                )}
              </button>

              {aberto && grupo.cargo.startsWith("Deputado") ? (
                <div className="mt-1 space-y-2.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2 max-h-96 overflow-y-auto">
                  {Object.entries(
                    grupo.lista.reduce<Record<string, CandidatoTSE[]>>(
                      (acc, c) => {
                        (acc[c.partido] = acc[c.partido] || []).push(c);
                        return acc;
                      },
                      {}
                    )
                  )
                    .sort(
                      (a, b) =>
                        b[1].length - a[1].length ||
                        a[0].localeCompare(b[0], "pt")
                    )
                    .map(([partido, lista]) => (
                      <div key={partido}>
                        <p className="mb-1 border-b border-neutral-800/70 pb-0.5 text-[11px] font-semibold text-amber-300/90">
                          {partido} ({lista.length})
                        </p>
                        <div className="space-y-1">
                          {lista.map((c, i) => (
                            <div
                              key={i}
                              className="flex items-baseline justify-between gap-2 text-xs text-neutral-400"
                            >
                              <div>
                                <span className="font-medium text-neutral-300">
                                  {c.nome}
                                </span>
                                {c.situacao !== "Concorrendo" && (
                                  <span className="ml-1.5 rounded bg-red-950/60 px-1.5 py-0.5 text-[10px] text-red-400">
                                    {c.situacao}
                                  </span>
                                )}
                              </div>
                              <span className="shrink-0 tabular-nums text-neutral-600">
                                {c.numero}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              ) : aberto ? (
                <div className="mt-1 space-y-1 rounded-lg border border-neutral-800 bg-neutral-950 p-2 max-h-96 overflow-y-auto">
                  {grupo.lista.map((c, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between gap-2 text-xs text-neutral-400"
                    >
                      <div>
                        <span className="font-medium text-neutral-300">
                          {c.nome}
                        </span>{" "}
                        <span className="text-neutral-600">({c.partido})</span>
                        {c.situacao !== "Concorrendo" && (
                          <span className="ml-1.5 rounded bg-red-950/60 px-1.5 py-0.5 text-[10px] text-red-400">
                            {c.situacao}
                          </span>
                        )}
                      </div>
                      <span className="shrink-0 tabular-nums text-neutral-600">
                        {c.numero}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-600">
        Fonte: DivulgaCand/TSE, exportado em 24/08/2026. Senado: apenas
        titulares (suplentes não listados). Candidatos inaptos/substituídos
        aparecem marcados.
      </p>
    </div>
  );
}
