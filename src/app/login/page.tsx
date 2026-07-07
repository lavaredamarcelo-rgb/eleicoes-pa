"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-neutral-900 p-6 shadow-xl">
        <h1 className="mb-1 text-xl font-semibold text-white">Eleições PA</h1>
        <p className="mb-6 text-sm text-neutral-400">
          Acesso restrito à equipe autorizada.
        </p>

        <form action={action} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="mb-1 block text-sm text-neutral-300">
              E-mail
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm text-neutral-300">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-neutral-700 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-amber-500"
            />
          </div>

          {state?.error && (
            <p className="rounded-md bg-red-950 px-3 py-2 text-sm text-red-300">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-2 rounded-lg bg-amber-400 px-4 py-2 font-medium text-neutral-950 transition hover:bg-amber-300 disabled:opacity-60"
          >
            {pending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
