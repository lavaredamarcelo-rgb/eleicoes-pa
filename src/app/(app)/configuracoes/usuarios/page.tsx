import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getUsuarios } from "@/lib/data";
import { CriarUsuarioForm } from "@/components/CriarUsuarioForm";
import { alternarStatusUsuario } from "@/app/actions/usuarios";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador",
  CANDIDATO: "Candidato",
};

export default async function UsuariosPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/configuracoes");
  }

  const usuarios = await getUsuarios();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Usuários</h1>
        <p className="text-sm text-neutral-500">
          Crie acessos temporários para coordenadores e candidatos.
        </p>
      </div>

      <CriarUsuarioForm />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Usuários cadastrados ({usuarios.length})
        </h2>
        {usuarios.map((u) => {
          const statusLabel = !u.ativo ? "Desativado" : u.expirado ? "Expirado" : "Ativo";
          const statusColor = !u.ativo || u.expirado ? "text-red-400" : "text-emerald-400";

          return (
            <div
              key={u.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">{u.nome}</p>
                <p className="truncate text-xs text-neutral-500">
                  {u.email} · {ROLE_LABEL[u.role] ?? u.role}
                </p>
                {u.expiresAt && (
                  <p className="text-xs text-neutral-600">
                    Expira em {u.expiresAt.toLocaleDateString("pt-BR")}
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <span className={`text-xs font-medium ${statusColor}`}>{statusLabel}</span>
                {u.id !== session.userId && (
                  <form action={alternarStatusUsuario.bind(null, u.id, !u.ativo)}>
                    <button
                      type="submit"
                      className="rounded-lg border border-neutral-700 px-2 py-1 text-xs text-neutral-400 transition-colors hover:border-neutral-600 hover:text-neutral-200"
                    >
                      {u.ativo ? "Desativar" : "Reativar"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
