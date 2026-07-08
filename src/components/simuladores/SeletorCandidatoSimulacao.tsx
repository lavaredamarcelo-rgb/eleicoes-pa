"use client";

import { useRouter } from "next/navigation";

type Opcao = { id: string; nome: string; partidoSigla: string; votos: number };

export function SeletorCandidatoSimulacao({
  candidatos,
  cargoId,
  selecionado,
  sim,
}: {
  candidatos: Opcao[];
  cargoId: string;
  selecionado?: string;
  sim: string;
}) {
  const router = useRouter();

  return (
    <div>
      <label className="mb-1 block text-xs text-neutral-500">Candidato</label>
      <select
        value={selecionado ?? ""}
        onChange={(e) => {
          if (e.target.value)
            router.push(`/simulacoes?sim=${sim}&cargo=${cargoId}&candidato=${e.target.value}`);
        }}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
      >
        <option value="" disabled>
          Escolha o candidato…
        </option>
        {candidatos.map((c) => (
          <option key={c.id} value={c.id}>
            {c.nome} ({c.partidoSigla} · {c.votos.toLocaleString("pt-BR")} votos)
          </option>
        ))}
      </select>
    </div>
  );
}
