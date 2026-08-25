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

              {aberto && (
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
                      </div>
                      <span className="shrink-0 tabular-nums text-neutral-600">
                        {c.numero}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-neutral-600">
        Fonte: DivulgaCand/TSE, exportado em 24/08/2026. Situação:
        &quot;Concorrendo&quot;.
      </p>
    </div>
  );
}
