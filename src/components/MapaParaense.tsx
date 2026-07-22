"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import mapaData from "@/data/pa-mapa.json";

type MunicipioMapa = {
  id: string;
  nome: string;
  codigoIbge: string | null;
  regiaoId: string;
  regiaoNome: string;
  totalVotos: number;
  top: { nome: string; votos: number } | null;
  linkCargoId: string | null;
  populacao: number | null;
  prefeito: { nome: string; partido: string; ano: number } | null;
  eleitorado: {
    ultimoAno: number;
    ultimoTotal: number;
    anoProjecao: number;
    projecao: number;
    oficial?: boolean;
  } | null;
};

const pathByCodigo = new Map(mapaData.municipios.map((m) => [m.codigoIbge, m.path]));

// Uma cor (matiz HSL) fixa por mesorregião, para identificação visual
// consistente independente do volume de votos.
const REGIAO_HUE: Record<string, number> = {
  "Metropolitana de Belém": 217, // azul
  "Baixo Amazonas": 189, // ciano
  Marajó: 271, // roxo
  "Nordeste Paraense": 38, // âmbar
  "Sudeste Paraense": 0, // vermelho
  "Sudoeste Paraense": 142, // verde
};

function corMunicipio(hue: number, valor: number, max: number) {
  if (max <= 0) return `hsl(${hue} 15% 20%)`;
  const t = Math.sqrt(valor / max);
  const l = 22 + t * 42;
  return `hsl(${hue} 70% ${l}%)`;
}

function corRegiao(hue: number, valor: number, max: number) {
  const t = max > 0 ? valor / max : 0;
  const l = 32 + t * 26;
  return `hsl(${hue} 65% ${l}%)`;
}

export function MapaParaense({
  municipios,
  rotuloVotos,
}: {
  municipios: MunicipioMapa[];
  rotuloVotos?: string;
}) {
  const router = useRouter();
  const [modo, setModo] = useState<"municipio" | "regiao">("municipio");

  // Camada fixa: eleitores (projeção) na visão geral; com um cargo
  // selecionado, a cor passa a refletir os votos exibidos.
  const comVotos = Boolean(rotuloVotos);
  const valorDe = (m: MunicipioMapa) => (comVotos ? m.totalVotos : m.eleitorado?.projecao ?? 0);

  const [hover, setHover] = useState<MunicipioMapa | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ left: number; top: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Telas de toque (sem mouse): o 1º toque mostra as informações e o 2º
  // toque — no mesmo município ou no botão do balão — abre os detalhes,
  // reproduzindo o "passar o mouse" do computador.
  const [temHover, setTemHover] = useState(true);
  useEffect(() => {
    setTemHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  function posicionarTooltip(clientX: number, clientY: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const tooltipW = 190;
    const tooltipH = temHover ? 96 : 130;
    const offset = 16;
    let left = x + offset;
    let top = y + offset;
    if (left + tooltipW > rect.width) left = x - tooltipW - offset;
    if (top + tooltipH > rect.height) top = y - tooltipH - offset;
    setTooltipPos({ left: Math.max(4, left), top: Math.max(4, top) });
  }

  function handleMouseMove(e: React.MouseEvent<SVGSVGElement>) {
    if (!temHover) return;
    posicionarTooltip(e.clientX, e.clientY);
  }

  function navegar(m: MunicipioMapa) {
    router.push(
      m.linkCargoId ? `/disputas/${m.linkCargoId}?municipio=${m.id}` : `/municipios/${m.id}`
    );
  }

  function handleToque(m: MunicipioMapa, e: React.MouseEvent) {
    if (temHover) {
      // Com mouse, o clique abre direto (o tooltip já apareceu no hover).
      navegar(m);
      return;
    }
    if (hover?.id === m.id) {
      navegar(m);
      return;
    }
    setHover(m);
    posicionarTooltip(e.clientX, e.clientY);
  }

  const totalPorRegiao = useMemo(() => {
    const map = new Map<string, number>();
    for (const m of municipios) {
      map.set(m.regiaoId, (map.get(m.regiaoId) ?? 0) + valorDe(m));
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [municipios, comVotos]);

  const maxValorMunicipio = useMemo(
    () => Math.max(0, ...municipios.map((m) => valorDe(m))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [municipios, comVotos]
  );
  const maxValorRegiao = useMemo(
    () => Math.max(0, ...Array.from(totalPorRegiao.values())),
    [totalPorRegiao]
  );

  const corDe = (m: MunicipioMapa) => {
    const hue = REGIAO_HUE[m.regiaoNome] ?? 217;
    if (modo === "municipio") {
      return corMunicipio(hue, valorDe(m), maxValorMunicipio);
    }
    return corRegiao(hue, totalPorRegiao.get(m.regiaoId) ?? 0, maxValorRegiao);
  };

  const regioesLegenda = useMemo(() => {
    const nomes = new Set(municipios.map((m) => m.regiaoNome));
    return Array.from(nomes).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [municipios]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-2">
        <button
          onClick={() => setModo("municipio")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            modo === "municipio" ? "bg-amber-400 text-neutral-950" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Por município
        </button>
        <button
          onClick={() => setModo("regiao")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
            modo === "regiao" ? "bg-amber-400 text-neutral-950" : "bg-neutral-900 text-neutral-400"
          }`}
        >
          Por região
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-950"
      >
        <svg
          viewBox={mapaData.viewBox}
          className="w-full touch-manipulation"
          onMouseMove={handleMouseMove}
        >
          {municipios.map((m) => {
            const path = m.codigoIbge ? pathByCodigo.get(m.codigoIbge) : undefined;
            if (!path) return null;
            const isHover = hover?.id === m.id;
            return (
              <path
                key={m.id}
                d={path}
                fill={corDe(m)}
                stroke={isHover ? "#f8fafc" : "#0a0a0a"}
                strokeWidth={isHover ? 2 : 0.5}
                className="cursor-pointer transition-[fill,stroke] duration-150"
                onMouseEnter={temHover ? () => setHover(m) : undefined}
                onMouseLeave={
                  temHover ? () => setHover((h) => (h?.id === m.id ? null : h)) : undefined
                }
                onClick={(e) => handleToque(m, e)}
              />
            );
          })}
        </svg>

        {hover && tooltipPos && (
          <div
            className={`absolute rounded-lg border border-neutral-700 bg-neutral-900/95 px-3 py-2 text-xs shadow-lg backdrop-blur ${
              temHover ? "pointer-events-none" : ""
            }`}
            style={{ left: tooltipPos.left, top: tooltipPos.top }}
          >
            {!temHover && (
              <button
                onClick={() => setHover(null)}
                aria-label="Fechar"
                className="absolute right-1.5 top-1 text-neutral-500 hover:text-neutral-200"
              >
                ×
              </button>
            )}
            <p className="font-semibold text-neutral-100">{hover.nome}</p>
            <p className="text-neutral-400">{hover.regiaoNome}</p>
            {hover.eleitorado ? (
              <>
                <p className="mt-1 font-medium text-amber-400">
                  {hover.eleitorado.projecao.toLocaleString("pt-BR")} eleitores aptos{" "}
                  {hover.eleitorado.oficial
                    ? `${hover.eleitorado.anoProjecao} (oficial TSE)`
                    : `(projeção ${hover.eleitorado.anoProjecao})`}
                </p>
                {!hover.eleitorado.oficial && (
                  <p className="text-neutral-500">
                    {hover.eleitorado.ultimoTotal.toLocaleString("pt-BR")} em {hover.eleitorado.ultimoAno}
                  </p>
                )}
              </>
            ) : (
              <p className="mt-1 text-neutral-500">Sem dado de eleitorado</p>
            )}
            {rotuloVotos && (
              <p className="font-medium text-amber-300">
                {hover.totalVotos.toLocaleString("pt-BR")} {rotuloVotos}
              </p>
            )}
            {rotuloVotos && hover.top && (
              <p className="text-neutral-400">
                Mais votado: {hover.top.nome} — {hover.top.votos.toLocaleString("pt-BR")} votos
              </p>
            )}
            {hover.populacao != null && (
              <p className="text-neutral-500">
                {hover.populacao.toLocaleString("pt-BR")} habitantes
                {hover.eleitorado
                  ? ` · ${((hover.eleitorado.ultimoTotal / hover.populacao) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}% eleitores`
                  : ""}
              </p>
            )}
            {hover.prefeito && (
              <p className="text-neutral-400">
                Prefeito: {hover.prefeito.nome} ({hover.prefeito.partido} · {hover.prefeito.ano})
              </p>
            )}
            {!temHover && (
              <button
                onClick={() => navegar(hover)}
                className="mt-1.5 w-full rounded-md bg-amber-400 px-2 py-1.5 text-center text-xs font-semibold text-neutral-950"
              >
                Ver detalhes →
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {regioesLegenda.map((nome) => (
          <span key={nome} className="flex items-center gap-1.5 text-xs text-neutral-400">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: `hsl(${REGIAO_HUE[nome] ?? 217} 65% 55%)` }}
            />
            {nome}
          </span>
        ))}
      </div>

      <p className="text-center text-xs text-neutral-600">
        {temHover
          ? comVotos
            ? "Passe o mouse para ver as informações e clique para abrir a disputa no município. Cor mais clara = mais votos."
            : "Passe o mouse para ver as informações e clique para abrir os detalhes. Cor mais clara = mais eleitores (projeção)."
          : comVotos
            ? "Toque em um município para ver as informações; toque de novo (ou em Ver detalhes) para abrir a disputa nele. Cor mais clara = mais votos."
            : "Toque em um município para ver as informações; toque de novo (ou em Ver detalhes) para abrir os detalhes. Cor mais clara = mais eleitores (projeção)."}
      </p>
    </div>
  );
}
