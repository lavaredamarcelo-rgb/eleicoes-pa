import { verifySession } from "@/lib/dal";
import { logout } from "@/app/actions/auth";
import { TabBar } from "@/components/TabBar";
import { Sidebar } from "@/components/Sidebar";
import { PageTransition } from "@/components/PageTransition";
import { Settings, Search } from "lucide-react";
import Link from "next/link";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Administrador",
  COORDENADOR: "Coordenador",
  CANDIDATO: "Candidato",
};

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <Sidebar />

      <div className="flex min-h-screen flex-col lg:pl-60">
        <header className="sticky top-0 z-10 border-b border-neutral-800 bg-neutral-950/95 backdrop-blur">
          <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3 lg:max-w-5xl lg:px-8">
            <div>
              <p className="text-sm font-semibold">Eleições PA</p>
              <p className="text-xs text-neutral-500">
                {session.nome} · {ROLE_LABEL[session.role] ?? session.role}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/busca"
                className="text-neutral-400 hover:text-neutral-200 lg:hidden"
              >
                <Search size={20} />
              </Link>
              <Link
                href="/configuracoes"
                className="text-neutral-400 hover:text-neutral-200 lg:hidden"
              >
                <Settings size={20} />
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="rounded-lg px-3 py-1.5 text-xs text-neutral-400 transition-colors hover:bg-neutral-900 hover:text-red-400"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-24 pt-4 lg:max-w-5xl lg:px-8 lg:pb-10 lg:pt-6">
          <PageTransition>{children}</PageTransition>
        </main>

        <TabBar />
      </div>
    </div>
  );
}
