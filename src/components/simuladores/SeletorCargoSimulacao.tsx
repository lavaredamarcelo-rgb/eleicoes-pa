"use client";

import { useRouter } from "next/navigation";

type CargoOpcao = { id: string; nome: string; ano: number; municipioNome: string | null };

// Um <select> agrupado por "Cargo · Ano" com os municípios dentro (ou "PA"
// para cargos estaduais). Troca a URL para o server component recarregar os
// dados do cargo escolhido.
export function SeletorCargoSimulacao({
  cargos,
  selecionado,
  sim,
}: {
  cargos: CargoOpcao[];
  selecionado?: string;
  sim: string;
}) {
  const router = useRouter();

  const grupos = new Map<string, CargoOpcao[]>();
  for (const c of cargos) {
    const rotulo = `${c.nome} · ${c.ano}`;
    const lista = grupos.get(rotulo);
    if (lista) lista.push(c);
    else grupos.set(rotulo, [c]);
  }

  return (
    <div>
      <label className="mb-1 block text-xs text-neutral-500">Disputa de referência</label>
      <select
        value={selecionado ?? ""}
        onChange={(e) => {
          if (e.target.value) router.push(`/simulacoes?sim=${sim}&cargo=${e.target.value}#simuladores`);
        }}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
      >
        <option value="" disabled>
          Escolha o cargo e o município…
        </option>
        {Array.from(grupos.entries()).map(([rotulo, lista]) => (
          <optgroup key={rotulo} label={rotulo}>
            {lista.map((c) => (
              <option key={c.id} value={c.id}>
                {c.municipioNome ?? "Pará (estadual)"}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
