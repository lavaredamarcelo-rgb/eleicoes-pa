"use client";

import { useActionState } from "react";
import { alterarSenha } from "@/app/actions/perfil";

export function TrocarSenhaForm() {
  const [state, action, pending] = useActionState(alterarSenha, undefined);

  return (
    <form
      action={action}
      className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4"
    >
      <p className="text-sm font-medium text-neutral-300">Trocar senha</p>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Senha atual</label>
        <input
          type="password"
          name="senhaAtual"
          required
          autoComplete="current-password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Nova senha (mín. 8 caracteres)</label>
        <input
          type="password"
          name="novaSenha"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Confirmar nova senha</label>
        <input
          type="password"
          name="confirmarSenha"
          required
          minLength={8}
          autoComplete="new-password"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-xs text-red-300">{state.error}</p>
      )}
      {state?.success && (
        <p className="rounded-md bg-emerald-950 px-3 py-2 text-xs text-emerald-300">
          Senha alterada com sucesso.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Salvando..." : "Salvar nova senha"}
      </button>
    </form>
  );
}
