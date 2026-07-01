"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import mapaData from "@/data/pa-mapa.json";

type MunicipioMapa = {
  id: string;
  nome: string;
  codigoIbge: string | null;
  regiaoId: string;
  regiaoNome: string;
  totalVotos: number;
  lider: { nome: string; partido: string } | null;
};

const pathByCodigo = new Map(mapaData.municipios.map((m) => [m.codigoIbge, m.path]));

function corPorIntensidade(valor: number, max: number) {
  if (max <= 0) return "#1e293b";
  const t = Math.sqrt(valor / max);
  const l = 20 + t * 45;
  return `hsl(217 85% ${l}%)`;
}

export function MapaParaense({ municipios }: { municipios: MunicipioMapa[] }) {
  const router = useRouter();
  const [modo, setModo] = useState<"municipio" | "regiao">("municipio");
  const [hover, setHover] = useState<MunicipioMapa | null>(null);

  const totalPorRegiao = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of municipios) {
      map.set(m.regiaoId, (map.get(m.regiaoId) ?? 0) + m.totalVotos);
    }
    return map;
  }, [municipios]);

  const maxValor = useMemo(() => {
    if (modo === "municipio") {
      return Math.max(0, ...municipios.map((m) => m.totalVotos));
    }
    return Math.max(0, ...Array.from(totalPorRegiao.values()));
  }, [municipios, modo, totalPorRegiao]);

  const valorDe = (m: MunicipioMapa) =>
    modo === "municipio" ? m.totalVotos : (totalPorRegiao.get(m.regiaoId) ?? 0);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={() => setModo("municipio")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            modo === "municipio" ? "bg-blue-600 text-white" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Por município
        </button>
        <button
          onClick={() => setModo("regiao")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            modo === "regiao" ? "bg-blue-600 text-white" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Por região
        </button>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950">
        <svg viewBox={mapaData.viewBox} className="w-full touch-manipulation">
          {municipios.map((m) => {
            const path = m.codigoIbge ? pathByCodigo.get(m.codigoIbge) : undefined;
            if (!path) return null;
            const isHover = hover?.id === m.id;
            return (
              <path
                key={m.id}
                d={path}
                fill={corPorIntensidade(valorDe(m), maxValor)}
                stroke={isHover ? "#93c5fd" : "#0a0a0a"}
                strokeWidth={isHover ? 2 : 0.5}
                className="cursor-pointer transition-[fill,stroke] duration-150"
                onMouseEnter={() => setHover(m)}
                onMouseLeave={() => setHover((h) => (h?.id === m.id ? null : h))}
                onClick={() => router.push(`/municipios/${m.id}`)}
              />
            );
          })}
        </svg>

        {hover && (
          <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-neutral-700 bg-neutral-900/95 px-3 py-2 text-xs shadow-lg backdrop-blur">
            <p className="font-semibold text-neutral-100">{hover.nome}</p>
            <p className="text-neutral-400">{hover.regiaoNome}</p>
            <p className="mt-1 font-medium text-blue-400">
              {hover.totalVotos.toLocaleString("pt-BR")} votos
            </p>
            {hover.lider && (
              <p className="text-neutral-400">
                Líder: {hover.lider.nome} ({hover.lider.partido})
              </p>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-neutral-600">
        Toque em um município para ver os detalhes. Cor mais clara = mais votos.
      </p>
    </div>
  );
}
