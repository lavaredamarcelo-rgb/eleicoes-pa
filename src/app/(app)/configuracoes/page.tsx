import { verifySession } from "@/lib/dal";
import { logout } from "@/app/actions/auth";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador regional/municipal",
  CANDIDATO: "Candidato",
};

export default async function ConfiguracoesPage() {
  const session = await verifySession();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Configurações</h1>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-4">
        <p className="text-sm text-neutral-500">Usuário</p>
        <p className="text-base font-medium">{session.nome}</p>
        <p className="mt-2 text-sm text-neutral-500">Perfil de acesso</p>
        <p className="text-base font-medium">{ROLE_LABEL[session.role] ?? session.role}</p>
      </section>

      <form action={logout}>
        <button
          type="submit"
          className="w-full rounded-lg border border-red-900 bg-red-950/40 px-4 py-2 text-sm font-medium text-red-300"
        >
          Sair da conta
        </button>
      </form>
    </div>
  );
}
