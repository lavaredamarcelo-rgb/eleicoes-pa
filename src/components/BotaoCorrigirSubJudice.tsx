"use client";

import { useState } from "react";
import { Scale } from "lucide-react";

// Dispara a correção das disputas de Vereador 2024 que ficaram sub judice
// (Breu Branco, Placas e Rurópolis), buscando o resultado atual no TSE.
export function BotaoCorrigirSubJudice() {
  const [rodando, setRodando] = useState(false);
  const [resumo, setResumo] = useState<string[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function corrigir() {
    if (rodando) return;
    setRodando(true);
    setErro(null);
    setResumo(null);
    try {
      const resp = await fetch("/api/admin/sub-judice", { method: "POST" });
      const d = await resp.json();
      if (!resp.ok) throw new Error(d.error ?? "Falha na correção.");
      setResumo(d.resumo ?? []);
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Falha na correção.");
    } finally {
      setRodando(false);
    }
  }

  return (
    <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center gap-2">
        <Scale size={16} className="text-neutral-500" />
        <p className="text-sm font-medium text-neutral-300">Disputas sub judice de 2024</p>
      </div>
      <p className="text-xs text-neutral-500">
        Breu Branco, Placas e Rurópolis tiveram a totalização de Vereador 2024 suspensa pela
        Justiça Eleitoral, e os votos não vieram nos arquivos abertos da importação original. Este
        botão busca o resultado oficial atual no TSE e grava votos, eleitos e votos de legenda —
        pode rodar mais de uma vez sem duplicar nada.
      </p>
      <button
        onClick={corrigir}
        disabled={rodando}
        className="self-start rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
      >
        {rodando ? "Buscando no TSE…" : "Corrigir com dados do TSE"}
      </button>
      {resumo && (
        <div className="flex flex-col gap-1 rounded-lg border border-emerald-900 bg-emerald-950/30 px-3 py-2">
          {resumo.map((linha) => (
            <p key={linha} className="text-xs text-emerald-300">
              ✓ {linha}
            </p>
          ))}
        </div>
      )}
      {erro && (
        <p className="rounded-lg border border-red-900 bg-red-950/40 px-3 py-2 text-xs text-red-300">
          {erro}
        </p>
      )}
    </section>
  );
}
