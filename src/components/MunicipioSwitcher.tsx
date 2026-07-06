"use client";

import { useRouter } from "next/navigation";

export function MunicipioSwitcher({
  cargoId,
  opcoes,
}: {
  cargoId: string;
  opcoes: { cargoId: string; municipioNome: string }[];
}) {
  const router = useRouter();

  return (
    <select
      value={cargoId}
      onChange={(e) => router.push(`/quociente/${e.target.value}`)}
      className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-100"
    >
      {opcoes.map((o) => (
        <option key={o.cargoId} value={o.cargoId}>
          {o.municipioNome}
        </option>
      ))}
    </select>
  );
}
