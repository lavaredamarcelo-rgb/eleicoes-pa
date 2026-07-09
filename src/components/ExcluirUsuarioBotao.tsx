"use client";

import { useState, useTransition } from "react";

export function ExcluirUsuarioBotao({ acao, nome }: { acao: () => Promise<void>; nome: string }) {
  const [confirmando, setConfirmando] = useState(false);
  const [pendente, startTransition] = useTransition();

  if (!confirmando) {
    return (
      <button
        onClick={() => setConfirmando(true)}
        className="rounded-lg border border-red-900/60 px-2 py-1 text-xs text-red-400 transition-colors hover:border-red-700 hover:text-red-300"
      >
        Excluir
      </button>
    );
  }

  return (
    <span className="flex items-center gap-1.5">
      <button
        onClick={() => startTransition(() => acao())}
        disabled={pendente}
        title={`Excluir ${nome} definitivamente`}
        className="rounded-lg bg-red-900/70 px-2 py-1 text-xs font-medium text-red-100 transition-colors hover:bg-red-800 disabled:opacity-50"
      >
        {pendente ? "Excluindo…" : "Confirmar"}
      </button>
      <button
        onClick={() => setConfirmando(false)}
        className="rounded-lg border border-neutral-700 px-2 py-1 text-xs text-neutral-400"
      >
        Cancelar
      </button>
    </span>
  );
}
