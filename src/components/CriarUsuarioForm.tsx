"use client";

import { useActionState } from "react";
import { criarUsuarioTemporario } from "@/app/actions/usuarios";

export function CriarUsuarioForm() {
  const [state, action, pending] = useActionState(criarUsuarioTemporario, undefined);

  return (
    <form action={action} className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
      <p className="text-sm font-medium text-neutral-300">Criar login temporário</p>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Nome</label>
        <input
          type="text"
          name="nome"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">E-mail</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">Perfil de acesso</label>
        <select
          name="role"
          defaultValue="COORDENADOR"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        >
          <option value="COORDENADOR">Coordenador regional/municipal</option>
          <option value="CANDIDATO">Candidato</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>

      <div>
        <label className="mb-1 block text-xs text-neutral-500">
          Expira em (opcional — deixe em branco para acesso sem prazo)
        </label>
        <input
          type="date"
          name="expiraEm"
          className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-sm text-neutral-100"
        />
      </div>

      {state?.error && (
        <p className="rounded-md bg-red-950 px-3 py-2 text-xs text-red-300">{state.error}</p>
      )}

      {state?.senhaGerada && (
        <div className="rounded-md bg-emerald-950 px-3 py-2 text-xs text-emerald-300">
          <p className="font-medium">Login criado para {state.email}</p>
          <p className="mt-1">
            Senha temporária:{" "}
            <span className="font-mono text-sm font-semibold text-emerald-200">
              {state.senhaGerada}
            </span>
          </p>
          <p className="mt-1 text-emerald-400/80">
            Copie e envie agora — ela não será exibida novamente.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-medium text-neutral-950 transition-colors hover:bg-amber-300 disabled:opacity-60"
      >
        {pending ? "Criando..." : "Criar login"}
      </button>
    </form>
  );
}
