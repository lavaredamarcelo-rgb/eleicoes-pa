"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Recarrega os dados da página (server components) num intervalo — para
// as páginas de apuração que são renderizadas no servidor (Panorama,
// mapa do Brasil) acompanharem a totalização sem F5.
export function AutoRefresh({ segundos = 120 }: { segundos?: number }) {
  const router = useRouter();
  useEffect(() => {
    const id = setInterval(() => router.refresh(), segundos * 1000);
    return () => clearInterval(id);
  }, [router, segundos]);
  return null;
}
