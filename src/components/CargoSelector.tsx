"use client";

import { useRouter } from "next/navigation";

export function CargoSelector({
  cargos,
  selecionado,
}: {
  cargos: { id: string; nome: string; municipioNome?: string }[];
  selecionado: string;
}) {
  const router = useRouter();

  return (
    <select
      value={selecionado}
      onChange={(e) => router.push(`/mapa?cargoId=${e.target.value}`)}
      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
    >
      {cargos.map((c) => (
        <option key={c.id} value={c.id}>
          {c.nome}
          {c.municipioNome ? ` · ${c.municipioNome}` : " · PA"}
        </option>
      ))}
    </select>
  );
}
