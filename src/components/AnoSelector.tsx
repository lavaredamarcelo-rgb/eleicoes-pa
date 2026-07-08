"use client";

import { useRouter } from "next/navigation";

export function AnoSelector({
  anos,
  selecionado,
  basePath,
  somenteAnos = false,
}: {
  anos: number[];
  selecionado: number | "todos";
  basePath: string;
  somenteAnos?: boolean;
}) {
  const router = useRouter();

  return (
    <select
      value={String(selecionado)}
      onChange={(e) => {
        const valor = e.target.value;
        router.push(valor === "todos" ? basePath : `${basePath}?ano=${valor}`);
      }}
      className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
    >
      {!somenteAnos && <option value="todos">Todos os anos</option>}
      {anos.map((ano) => (
        <option key={ano} value={ano}>
          {ano}
        </option>
      ))}
    </select>
  );
}
