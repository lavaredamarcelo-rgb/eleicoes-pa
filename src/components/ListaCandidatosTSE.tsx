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

type Candidato = {
  nome: string;
  cargo: string;
  partido: { sigla: string };
};

export function ListaCandidatosTSE({
  candidatos,
}: {
  candidatos: Candidato[];
}) {
  const [expandidos, setExpandidos] = useState<Record<string, boolean>>({});

  const porCargo = CARGOS_ORDEM.map((cargo) => ({
    cargo,
    candidatos: candidatos
      .filter((c) => c.cargo === cargo)
      .sort((a, b) => a.nome.localeCompare(b.nome)),
  })).filter((g) => g.candidatos.length > 0);

  const toggle = (cargo: string) => {
    setExpandidos((prev) => ({ ...prev, [cargo]: !prev[cargo] }));
  };

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-emerald-900/50 bg-emerald-950/10 p-4">
      <div className="flex items-center gap-2 text-sm font-semibold text-emerald-300">
        <Users size={16} />
        Candidatos Registrados no TSE
      </div>

      <div className="space-y-2">
        {porCargo.map((grupo) => (
          <div key={grupo.cargo}>
            <button
              onClick={() => toggle(grupo.cargo)}
              className="w-full flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-950 px-3 py-2 text-left transition hover:bg-neutral-900"
            >
              <span className="text-xs font-medium text-neutral-300">
                {grupo.cargo} ({grupo.candidatos.length})
              </span>
              {expandidos[grupo.cargo] ? (
                <ChevronUp size={14} className="text-neutral-500" />
              ) : (
                <ChevronDown size={14} className="text-neutral-500" />
              )}
            </button>

            {expandidos[grupo.cargo] && (
              <div className="mt-1 space-y-1 rounded-lg border border-neutral-800 bg-neutral-950 p-2">
                {grupo.candidatos.map((c, i) => (
                  <div key={i} className="text-xs text-neutral-400">
                    <span className="font-medium text-neutral-300">
                      {c.nome}
                    </span>{" "}
                    <span className="text-neutral-600">({c.partido.sigla})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
