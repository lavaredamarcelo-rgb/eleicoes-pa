"use client";

import { useActionState, useState } from "react";
import { importarArquivoTse } from "@/app/actions/importacao";

type Eleicao = { id: string; ano: number; uf: string; tipo: string };

export function ImportacaoTseForm({ eleicoes }: { eleicoes: Eleicao[] }) {
  const [state, action, pending] = useActionState(importarArquivoTse, undefined);
  const [tipo, setTipo] = useState("candidatos");

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm font-medium text-neutral-300">Importar arquivo do TSE</p>
      <p className="text-xs text-neutral-500">
        Envie os arquivos oficiais em CSV, exportados de{" "}
        <span className="text-neutral-400">dadosabertos.tse.jus.br</span> — "consulta_cand" para
        candidatos, "votacao_candidato_munzona" para resultados de votação, ou o perfil do
        eleitorado (já agregado por município) para o número de eleitores. Importe sempre os
        candidatos antes dos resultados.
      </p>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Tipo de arquivo</label>
        <select
          name="tipo"
          required
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="candidatos">Candidatos (consulta_cand)</option>
          <option value="resultados">Resultados (votacao_candidato_munzona)</option>
          <option value="eleitorado">Eleitorado (perfil_eleitor_secao, agregado)</option>
        </select>
      </div>

      {tipo === "eleitorado" ? (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Ano do eleitorado</label>
          <input
            type="number"
            name="ano"
            required
            min={1990}
            max={2100}
            placeholder="2024"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
          />
        </div>
      ) : (
        <div>
          <label className="mb-1 block text-xs text-neutral-500">Eleição</label>
          <select
            name="eleicaoId"
            required
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="">Selecione...</option>
            {eleicoes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.tipo === "ESTADUAL" ? "Estadual" : "Municipal"} · {e.ano} · {e.uf}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Arquivo CSV</label>
        <input
          type="file"
          name="arquivo"
          accept=".csv,text/csv"
          required
          className="w-full rounded-lg border border-dashed border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-300 file:mr-3 file:rounded-md file:border-0 file:bg-neutral-700 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-neutral-200"
        />
      </div>

      {state && "error" in state && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-xs text-red-300">{state.error}</p>
      )}

      {state && "success" in state && (
        <div className="flex flex-col gap-2 rounded-md bg-emerald-950/60 px-3 py-2 text-xs text-emerald-300">
          <p>
            {state.criados} registro(s) criado(s) · {state.atualizados} atualizado(s)
            {state.avisos.length > 0 ? ` · ${state.avisos.length} aviso(s)` : ""}
          </p>
          {state.avisos.length > 0 && (
            <ul className="flex max-h-48 flex-col gap-1 overflow-y-auto text-amber-300">
              {state.avisos.map((aviso, i) => (
                <li key={i}>• {aviso}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
      >
        {pending ? "Importando..." : "Importar arquivo"}
      </button>
    </form>
  );
}
