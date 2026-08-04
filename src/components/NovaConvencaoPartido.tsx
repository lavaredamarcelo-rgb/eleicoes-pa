"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { salvarConvencao } from "@/app/actions/convencoes";

// Inicia o registro de convenção para um partido que ainda não aparece na
// lista (cria o registro vazio; as datas e nomes entram no card).
export function NovaConvencaoPartido({ partidos }: { partidos: { id: string; sigla: string }[] }) {
  const router = useRouter();
  const [partidoId, setPartidoId] = useState("");
  const [criando, setCriando] = useState(false);

  if (partidos.length === 0) return null;

  async function criar() {
    if (!partidoId || criando) return;
    setCriando(true);
    try {
      await salvarConvencao({ partidoId, observacoes: "Registro iniciado manualmente" });
      setPartidoId("");
      router.refresh();
    } finally {
      setCriando(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 p-4 sm:flex-row sm:items-center">
      <p className="flex-1 text-sm text-neutral-400">
        Registrar convenção de outro partido:
      </p>
      <select
        value={partidoId}
        onChange={(e) => setPartidoId(e.target.value)}
        className="rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100"
      >
        <option value="">Escolha o partido…</option>
        {partidos.map((p) => (
          <option key={p.id} value={p.id}>
            {p.sigla}
          </option>
        ))}
      </select>
      <button
        onClick={criar}
        disabled={!partidoId || criando}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 px-3 py-2 text-xs font-semibold text-neutral-950 transition-opacity disabled:opacity-40"
      >
        <Plus size={13} />
        {criando ? "Criando…" : "Iniciar registro"}
      </button>
    </div>
  );
}
