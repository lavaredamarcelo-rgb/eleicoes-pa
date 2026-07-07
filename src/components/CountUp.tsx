"use client";

import { useEffect, useRef, useState } from "react";

export function CountUp({
  value,
  formatador = (v: number) => Math.round(v).toLocaleString("pt-BR"),
  durationMs = 700,
}: {
  value: number;
  formatador?: (v: number) => string;
  durationMs?: number;
}) {
  const [exibido, setExibido] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setExibido(value);
      return;
    }

    const inicio = performance.now();
    const partida = 0;

    function tick(agora: number) {
      const progresso = Math.min((agora - inicio) / durationMs, 1);
      const suavizado = 1 - Math.pow(1 - progresso, 3);
      setExibido(partida + (value - partida) * suavizado);
      if (progresso < 1) frame.current = requestAnimationFrame(tick);
    }
    frame.current = requestAnimationFrame(tick);

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [value, durationMs]);

  return <>{formatador(exibido)}</>;
}
