"use client";

import { useRouter } from "next/navigation";

type Opcao = { id: string; nome: string };

const VAGAS = 6;

// Até seis seletores de município; a URL (?m=id1,id2,...) guia o server.
export function SeletorComparacao({
  municipios,
  selecionados,
}: {
  municipios: Opcao[];
  selecionados: string[];
}) {
  const router = useRouter();

  function atualizar(indice: number, valor: string) {
    const novos = [...selecionados];
    novos[indice] = valor;
    const ids = novos.filter(Boolean);
    router.push(ids.length ? `/comparar?m=${ids.join(",")}` : "/comparar");
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {Array.from({ length: VAGAS }, (_, i) => (
        <div key={i}>
          <label className="mb-1 block text-xs text-neutral-500">Município {i + 1}</label>
          <select
            value={selecionados[i] ?? ""}
            onChange={(e) => atualizar(i, e.target.value)}
            className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">{i < 2 ? "Escolha…" : "(opcional)"}</option>
            {municipios.map((m) => (
              <option
                key={m.id}
                value={m.id}
                disabled={selecionados.includes(m.id) && selecionados[i] !== m.id}
              >
                {m.nome}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
