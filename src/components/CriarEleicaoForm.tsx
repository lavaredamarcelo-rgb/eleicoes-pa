"use client";

import { useActionState } from "react";
import { criarEleicao } from "@/app/actions/eleicoes";

export function CriarEleicaoForm() {
  const [state, action, pending] = useActionState(criarEleicao, undefined);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm font-medium text-neutral-300">Cadastrar eleição</p>

      <div className="flex flex-col gap-2 sm:flex-row">
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-500">Ano</label>
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
        <div className="flex-1">
          <label className="mb-1 block text-xs text-neutral-500">Tipo</label>
          <select
            name="tipo"
            defaultValue="MUNICIPAL"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
          >
            <option value="MUNICIPAL">Municipal (Prefeito/Vereador)</option>
            <option value="ESTADUAL">Estadual (Governador/Deputados)</option>
          </select>
        </div>
        <div className="w-full sm:w-24">
          <label className="mb-1 block text-xs text-neutral-500">UF</label>
          <input
            type="text"
            name="uf"
            required
            maxLength={2}
            defaultValue="PA"
            className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm uppercase text-neutral-100"
          />
        </div>
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-xs text-red-300">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-md bg-emerald-950 px-3 py-2 text-xs text-emerald-300">
          Eleição cadastrada. Já aparece na tela de Importação de dados.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Criando..." : "Cadastrar eleição"}
      </button>
    </form>
  );
}
