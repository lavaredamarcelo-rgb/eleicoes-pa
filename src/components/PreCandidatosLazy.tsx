"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const ORDEM_CARGOS = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

export function PreCandidatosLazy() {
  const [expandido, setExpandido] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [dados, setDados] = useState<any[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  const handleExpand = async () => {
    if (expandido || carregando) return;

    setCarregando(true);
    setErro(null);

    try {
      const res = await fetch("/api/pre-candidatos/aprovados");
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`HTTP ${res.status}: ${text}`);
      }

      const preCandidatos = await res.json();
      console.log("Pré-candidatos carregados:", preCandidatos);
      setDados(preCandidatos);
      setExpandido(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro desconhecido";
      setErro(`Erro ao carregar pré-candidatos: ${msg}`);
      console.error("Erro completo:", err);
    } finally {
      setCarregando(false);
    }
  };

  const aprovadosPorCargo = ORDEM_CARGOS.map((cargo) => ({
    cargo,
    itens: dados
      .filter((pc) => pc.cargo === cargo)
      .map((pc) => ({
        nome: pc.nome,
        sigla: pc.partido.sigla,
      })),
  })).filter((g) => g.itens.length > 0);

  return (
    <section className="flex flex-col gap-2">
      <button
        onClick={handleExpand}
        disabled={carregando}
        className="flex items-center gap-2 rounded-lg border border-emerald-900/50 bg-emerald-950/10 px-4 py-3 text-left transition hover:bg-emerald-950/20 disabled:opacity-50"
      >
        <span className="flex-1 text-sm font-medium text-emerald-300">
          {carregando ? "Carregando..." : expandido ? "Pré-candidatos Aprovados" : "Ver Pré-candidatos Aprovados"}
        </span>
        {expandido ? (
          <ChevronUp size={16} className="text-emerald-400" />
        ) : (
          <ChevronDown size={16} className="text-emerald-400" />
        )}
      </button>

      {erro && (
        <div className="rounded-lg border border-red-900/50 bg-red-950/10 px-3 py-2 text-xs text-red-400">
          {erro}
        </div>
      )}

      {expandido && !carregando && !erro && (
        <div className="space-y-2">
          {aprovadosPorCargo.length === 0 ? (
            <p className="py-4 text-center text-xs text-neutral-500">
              Nenhum pré-candidato aprovado encontrado
            </p>
          ) : (
            aprovadosPorCargo.map((g) => (
              <div
                key={g.cargo}
                className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950"
              >
                <p className="border-b border-neutral-800 bg-neutral-900 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                  {g.cargo} ({g.itens.length})
                </p>
                {g.itens.map((n, i) => (
                  <div
                    key={`${n.nome}-${n.sigla}-${i}`}
                    className="border-b border-neutral-800/50 px-3 py-2 last:border-0 text-sm"
                  >
                    <span className="font-medium text-neutral-100">{n.nome}</span>{" "}
                    <span className="text-xs text-neutral-500">({n.sigla})</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}
