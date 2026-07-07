"use client";

import { useEffect, useId, useState } from "react";

type Ponto = { rotulo: string; valor: number; projetado?: boolean };

export function GraficoBarras({
  titulo,
  subtitulo,
  pontos,
  formatador = (v: number) => v.toLocaleString("pt-BR"),
}: {
  titulo: string;
  subtitulo?: string;
  pontos: Ponto[];
  formatador?: (v: number) => string;
}) {
  const uid = useId();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const [crescido, setCrescido] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setCrescido(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  if (pontos.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <p className="text-sm font-medium text-neutral-300">{titulo}</p>
        <p className="mt-2 text-xs text-neutral-600">Sem dados suficientes ainda.</p>
      </div>
    );
  }

  const width = 100;
  const height = 46;
  const paddingBottom = 10;
  const paddingTop = 6;
  const max = Math.max(...pontos.map((p) => p.valor), 1);
  const barGap = 1.4;
  const barWidth = (width - barGap * (pontos.length - 1)) / pontos.length;

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm font-medium text-neutral-300">{titulo}</p>
      {subtitulo && <p className="text-xs text-neutral-600">{subtitulo}</p>}

      <svg viewBox={`0 0 ${width} ${height}`} className="mt-3 w-full" style={{ height: 140 }}>
        <line x1={0} y1={height - paddingBottom} x2={width} y2={height - paddingBottom} stroke="#262626" strokeWidth={0.3} />
        {pontos.map((p, i) => {
          const x = i * (barWidth + barGap);
          const barH = ((height - paddingTop - paddingBottom) * p.valor) / max;
          const y = height - paddingBottom - barH;
          const isHover = hoverIdx === i;
          return (
            <g
              key={i}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx((h) => (h === i ? null : h))}
              className="cursor-pointer"
            >
              <rect x={x} y={paddingTop} width={barWidth} height={height - paddingTop - paddingBottom} fill="transparent" />
              <rect
                x={x}
                y={crescido ? y : height - paddingBottom}
                width={barWidth}
                height={crescido ? Math.max(barH, 0.5) : 0}
                rx={0.8}
                fill={p.projetado ? `url(#${uid}-hatch)` : isHover ? "#fbbf24" : "#f59e0b"}
                stroke={p.projetado ? "#f59e0b" : "none"}
                strokeWidth={p.projetado ? 0.4 : 0}
                strokeDasharray={p.projetado ? "1.2,1" : undefined}
                style={{
                  transition: "height 500ms ease-out, y 500ms ease-out",
                  transitionDelay: `${i * 35}ms`,
                }}
              />
              <text
                x={x + barWidth / 2}
                y={height - paddingBottom + 3.6}
                fontSize={2.6}
                textAnchor="middle"
                fill="#a3a3a3"
              >
                {p.rotulo}
              </text>
            </g>
          );
        })}
        <pattern id={`${uid}-hatch`} width={2} height={2} patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <rect width={2} height={2} fill="#78350f" />
          <line x1={0} y1={0} x2={0} y2={2} stroke="#f59e0b" strokeWidth={0.6} />
        </pattern>
      </svg>

      <div className="mt-1 flex min-h-[18px] items-center justify-center text-xs">
        {hoverIdx !== null ? (
          <span className="font-medium text-amber-400">
            {pontos[hoverIdx].rotulo}: {formatador(pontos[hoverIdx].valor)}
            {pontos[hoverIdx].projetado ? " (projeção)" : ""}
          </span>
        ) : (
          <span className="text-neutral-600">Toque em uma barra para ver o valor</span>
        )}
      </div>
    </div>
  );
}
