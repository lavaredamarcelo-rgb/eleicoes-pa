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

  // ---- Zoom e navegação no mapa (viewBox dinâmico) ----
  const base = useMemo(() => {
    const [x, y, w, h] = mapaData.viewBox.split(" ").map(Number);
    return { x, y, w, h };
  }, []);
  const [vb, setVb] = useState(base);
  const vbRef = useRef(vb);
  const zoomFator = base.w / vb.w;

  const ponteiros = useRef(new Map<number, { x: number; y: number }>());
  const pinchInicial = useRef<{
    dist: number;
    vb: { x: number; y: number; w: number; h: number };
    mx: number;
    my: number;
  } | null>(null);
  // Distância arrastada desde o toque: acima do limiar, o "clique" que o
  // navegador dispara ao soltar era um arrasto/pinça, não uma seleção.
  const arrastou = useRef(0);

  function clampVb(nv: { x: number; y: number; w: number; h: number }) {
    const w = Math.min(base.w, Math.max(base.w / 8, nv.w));
    const h = w * (base.h / base.w);
    const x = Math.min(base.x + base.w - w, Math.max(base.x, nv.x));
    const y = Math.min(base.y + base.h - h, Math.max(base.y, nv.y));
    return { x, y, w, h };
  }

  function aplicarVb(nv: { x: number; y: number; w: number; h: number }) {
    const c = clampVb(nv);
    vbRef.current = c;
    setVb(c);
  }

  function zoomEm(fator: number, clientX?: number, clientY?: number) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const v = vbRef.current;
    const cx = clientX ?? rect.left + rect.width / 2;
    const cy = clientY ?? rect.top + rect.height / 2;
    const fx = (cx - rect.left) / rect.width;
    const fy = (cy - rect.top) / rect.height;
    const px = v.x + fx * v.w;
    const py = v.y + fy * v.h;
    const w = Math.min(base.w, Math.max(base.w / 8, v.w / fator));
    const h = w * (base.h / base.w);
    aplicarVb({ x: px - fx * w, y: py - fy * h, w, h });
  }

  function onPointerDown(e: React.PointerEvent<SVGSVGElement>) {
    // Com zoom ativo, o arrasto do mouse pana o mapa — bloqueia a seleção de
    // texto da página durante o gesto (preventDefault aqui suprimiria o click).
    if (e.pointerType === "mouse" && base.w / vbRef.current.w > 1.01) {
      document.body.style.userSelect = "none";
    }
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ponteiros.current.size === 1) arrastou.current = 0;
    if (ponteiros.current.size === 2) {
      const [a, b] = [...ponteiros.current.values()];
      pinchInicial.current = {
        dist: Math.hypot(a.x - b.x, a.y - b.y),
        vb: vbRef.current,
        mx: (a.x + b.x) / 2,
        my: (a.y + b.y) / 2,
      };
    }
  }

  function onPointerMove(e: React.PointerEvent<SVGSVGElement>) {
    const ant = ponteiros.current.get(e.pointerId);
    if (!ant) return;
    ponteiros.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (ponteiros.current.size === 2 && pinchInicial.current) {
      // Pinça: zoom em torno do ponto médio inicial dos dois dedos.
      const [a, b] = [...ponteiros.current.values()];
      const p0 = pinchInicial.current;
      const fator = Math.hypot(a.x - b.x, a.y - b.y) / p0.dist;
      const w = Math.min(base.w, Math.max(base.w / 8, p0.vb.w / fator));
      const h = w * (base.h / base.w);
      const fx = (p0.mx - rect.left) / rect.width;
      const fy = (p0.my - rect.top) / rect.height;
      const px = p0.vb.x + fx * p0.vb.w;
      const py = p0.vb.y + fy * p0.vb.h;
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      arrastou.current = 99;
      aplicarVb({
        x: px - ((mx - rect.left) / rect.width) * w,
        y: py - ((my - rect.top) / rect.height) * h,
        w,
        h,
      });
      return;
    }

    if (ponteiros.current.size === 1 && base.w / vbRef.current.w > 1.01) {
      // Um dedo (ou mouse pressionado) com zoom ativo: arrasta o mapa.
      if (e.pointerType === "mouse" && e.buttons !== 1) return;
      const v = vbRef.current;
      arrastou.current += Math.hypot(e.clientX - ant.x, e.clientY - ant.y);
      aplicarVb({
        ...v,
        x: v.x - ((e.clientX - ant.x) / rect.width) * v.w,
        y: v.y - ((e.clientY - ant.y) / rect.height) * v.h,
      });
    }
  }

  function onPointerFim(e: React.PointerEvent<SVGSVGElement>) {
    ponteiros.current.delete(e.pointerId);
    if (ponteiros.current.size < 2) pinchInicial.current = null;
    if (ponteiros.current.size === 0) document.body.style.userSelect = "";
  }

  // Zoom com a rolagem do mouse segurando Ctrl/Cmd (e pinça no trackpad,
  // que os navegadores entregam como wheel+ctrlKey). Listener nativo porque
  // o React registra wheel como passivo e o preventDefault não funcionaria.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      zoomEm(e.deltaY < 0 ? 1.25 : 0.8, e.clientX, e.clientY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Soltar o dedo/mouse após arrastar ou pinçar dispara um "click" do
    // navegador — não é uma seleção de município.
    if (arrastou.current > 8) {
      arrastou.current = 0;
      return;
    }
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
          viewBox={`${vb.x} ${vb.y} ${vb.w} ${vb.h}`}
          className="w-full select-none"
          // Sem zoom, o dedo continua rolando a página normalmente (pan-y);
          // com zoom, o mapa assume todos os gestos (arrastar/pinçar).
          style={{ touchAction: zoomFator > 1.01 ? "none" : "pan-y" }}
          onMouseMove={handleMouseMove}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerFim}
          onPointerCancel={onPointerFim}
          onPointerLeave={onPointerFim}
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
                strokeWidth={(isHover ? 2 : 0.5) / zoomFator}
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

        <div className="absolute right-2 top-2 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => zoomEm(1.6)}
            aria-label="Aproximar"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/90 text-lg font-bold text-neutral-200 backdrop-blur active:bg-neutral-800"
          >
            +
          </button>
          <button
            onClick={() => zoomEm(1 / 1.6)}
            aria-label="Afastar"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/90 text-lg font-bold text-neutral-200 backdrop-blur active:bg-neutral-800"
          >
            −
          </button>
          {zoomFator > 1.01 && (
            <button
              onClick={() => aplicarVb(base)}
              aria-label="Ver o mapa inteiro"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-700 bg-neutral-900/90 text-[11px] font-semibold text-amber-400 backdrop-blur active:bg-neutral-800"
            >
              1×
            </button>
          )}
        </div>

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
          ? "Use + e − (ou Ctrl + rolagem) para aproximar municípios pequenos; com zoom, arraste para mover o mapa. "
          : "Use + e − (ou a pinça com dois dedos) para aproximar municípios pequenos; com zoom, arraste para mover o mapa. "}
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
