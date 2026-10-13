"use client";

import { useState } from "react";
import mapaData from "@/data/pa-mapa.json";

// Mapa do Pará reutilizável: recebe a cor pronta de cada município (por
// codigoIbge) e pinta. O clique/toque seleciona o município e mostra as
// informações numa FAIXA FIXA abaixo do mapa — nada de balão cortado na
// borda (caso Oriximiná). No desktop o hover nativo (title) também vale.
export function MapaVotos({
  cores,
  titulos,
  altura = "h-[420px]",
}: {
  cores: Record<string, string>;
  titulos?: Record<string, string>;
  altura?: string;
}) {
  const [selecionado, setSelecionado] = useState<string | null>(null);

  return (
    <div>
      <svg
        viewBox={mapaData.viewBox}
        className={`w-full ${altura}`}
        role="img"
        aria-label="Mapa do Pará por município"
      >
        {mapaData.municipios.map((m) => (
          <path
            key={m.codigoIbge}
            d={m.path}
            fill={cores[m.codigoIbge] ?? "#262626"}
            stroke={selecionado === m.codigoIbge ? "#fbbf24" : "#0a0a0a"}
            strokeWidth={selecionado === m.codigoIbge ? 2.5 : 1}
            onClick={() =>
              setSelecionado((atual) => (atual === m.codigoIbge ? null : m.codigoIbge))
            }
            style={{ cursor: titulos?.[m.codigoIbge] ? "pointer" : "default" }}
          >
            {titulos?.[m.codigoIbge] && <title>{titulos[m.codigoIbge]}</title>}
          </path>
        ))}
      </svg>
      {selecionado && titulos?.[selecionado] && (
        <div className="mt-2 flex items-start justify-between gap-2 rounded-lg border border-amber-800 bg-amber-950/30 px-3 py-2">
          <p className="text-xs text-amber-100">{titulos[selecionado]}</p>
          <button
            onClick={() => setSelecionado(null)}
            aria-label="Fechar"
            className="shrink-0 text-neutral-500 hover:text-neutral-200"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
}
