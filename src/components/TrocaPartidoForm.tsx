"use client";

import { useActionState } from "react";
import { registrarTrocaPartido } from "@/app/actions/candidato";

export function TrocaPartidoForm({
  candidatoId,
  partidoAtualId,
  partidos,
}: {
  candidatoId: string;
  partidoAtualId: string;
  partidos: { id: string; sigla: string; nome: string }[];
}) {
  const [state, action, pending] = useActionState(registrarTrocaPartido, undefined);
  const hoje = new Date().toISOString().slice(0, 10);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <input type="hidden" name="candidatoId" value={candidatoId} />
      <p className="text-sm font-medium text-neutral-300">Registrar troca de partido</p>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Novo partido</label>
        <select
          name="novoPartidoId"
          required
          defaultValue=""
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="" disabled>
            Selecione...
          </option>
          {partidos
            .filter((p) => p.id !== partidoAtualId)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.sigla} · {p.nome}
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Data da troca</label>
        <input
          type="date"
          name="data"
          required
          defaultValue={hoje}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Motivo (opcional)</label>
        <input
          type="text"
          name="motivo"
          placeholder="Ex: mudança de coligação"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-xs text-red-300">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-md bg-emerald-950 px-3 py-2 text-xs text-emerald-300">
          Troca registrada com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
      >
        {pending ? "Registrando..." : "Registrar troca"}
      </button>
    </form>
  );
}
