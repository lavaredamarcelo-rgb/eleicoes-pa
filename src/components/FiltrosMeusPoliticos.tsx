"use client";

import { useTransition } from "react";

interface Cargo {
  id: string;
  nome: string;
}

interface Regiao {
  id: string;
  nome: string;
}

export default function FiltrosMeusPoliticos({
  cargos,
  regioes,
  cargoParam,
  regiaoParam,
}: {
  cargos: Cargo[];
  regioes: Regiao[];
  cargoParam?: string;
  regiaoParam?: string;
}) {
  const [, startTransition] = useTransition();

  const handleCargoChange = (value: string) => {
    startTransition(() => {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set("cargo", value);
      } else {
        url.searchParams.delete("cargo");
      }
      window.location.href = url.toString();
    });
  };

  const handleRegiaoChange = (value: string) => {
    startTransition(() => {
      const url = new URL(window.location.href);
      if (value) {
        url.searchParams.set("regiao", value);
      } else {
        url.searchParams.delete("regiao");
      }
      window.location.href = url.toString();
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Filtrar por cargo:</label>
        <select
          value={cargoParam || ""}
          onChange={(e) => handleCargoChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 text-sm"
        >
          <option value="">Todos os cargos</option>
          {cargos.map((c) => (
            <option key={c.id} value={c.id}>
              {c.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium mb-1 text-gray-700">Filtrar por região:</label>
        <select
          value={regiaoParam || ""}
          onChange={(e) => handleRegiaoChange(e.target.value)}
          className="w-full border border-gray-300 rounded px-3 py-2 bg-white text-gray-900 text-sm"
        >
          <option value="">Todas as regiões</option>
          {regioes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nome}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
