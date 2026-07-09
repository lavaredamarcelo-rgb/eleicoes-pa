"use client";

import { useRouter } from "next/navigation";

export const SIMULACOES = [
  { chave: "projecao", rotulo: "Projeção de votos" },
  { chave: "segundo-turno", rotulo: "2º turno" },
  { chave: "federacao", rotulo: "Federação" },
  { chave: "transferencia", rotulo: "Transferência de votos" },
  { chave: "chapa", rotulo: "Cenário de chapa" },
  { chave: "comparecimento", rotulo: "Comparecimento e QE" },
  { chave: "meta", rotulo: "Meta por município" },
] as const;

export function SeletorSimulacao({ ativa }: { ativa: string }) {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {SIMULACOES.map((s) => (
        <button
          key={s.chave}
          onClick={() => router.push(`/simulacoes?sim=${s.chave}#simuladores`)}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors duration-150 ${
            ativa === s.chave
              ? "bg-amber-400 text-neutral-950"
              : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
          }`}
        >
          {s.rotulo}
        </button>
      ))}
    </div>
  );
}
