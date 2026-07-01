import { verifySession } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import { TabBar } from "@/components/TabBar";
import { Settings } from "lucide-react";
import Link from "next/link";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador",
  CANDIDATO: "Candidato",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="flex min-h-screen flex-col bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Eleições PA</p>
            <p className="text-xs text-neutral-500">
              {session.nome} · {ROLE_LABEL[session.role] ?? session.role}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/configuracoes" className="text-neutral-400 hover:text-neutral-200">
              <Settings size={20} />
            </Link>
            <form action={logout}>
              <button type="submit" className="text-xs text-neutral-400 hover:text-red-400">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4">{children}</main>

      <TabBar />
    </div>
  );
}
