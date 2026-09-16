import Link from "next/link";
import { Pencil } from "lucide-react";
import { QuocienteHierarquia } from "@/components/QuocienteHierarquia";
import { getHierarquiaCargos } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export default async function CenarioPage() {
  const session = await verifySession();
  const [anos, cenariosSalvos] = await Promise.all([
    getHierarquiaCargos(),
    prisma.cenarioEleicao.findMany({
      where: { userId: String(session.userId) },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Cenários Eleitorais</h1>
        <p className="text-sm text-neutral-500">
          Escolha um ano, depois o cargo e o município para ver a composição da casa (federal,
          estadual ou municipal) e simular cenários de troca de partido.
        </p>
      </div>

      {cenariosSalvos.length > 0 && (
        <section className="rounded-xl border border-amber-900/40 bg-amber-950/10 p-4">
          <h2 className="text-sm font-medium text-amber-300">
            Meus cenários simulados (Eleição Completa)
          </h2>
          <p className="mt-0.5 text-xs text-neutral-500">
            Toque em Editar para abrir o cenário no Criar Cenário — com votos, legenda e
            resultado prontos para ajustar e salvar de novo.
          </p>
          <div className="mt-3 flex flex-col gap-1.5">
            {cenariosSalvos.map((c) => {
              const votos = JSON.parse(c.votos) as Record<string, number>;
              const totalVotos = Object.values(votos).reduce((s, v) => s + v, 0);
              const nCandidatos = Object.keys(votos).filter(
                (k) => !k.startsWith("legenda:")
              ).length;
              return (
                <div
                  key={c.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-neutral-200">{c.titulo}</p>
                    <p className="text-xs text-neutral-500">
                      {c.cargoNome} · {nCandidatos} candidatos ·{" "}
                      {totalVotos.toLocaleString("pt-BR")} votos ·{" "}
                      {c.updatedAt.toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <Link
                    href={`/criar-cenario?modo=eleicao&cenario=${c.id}`}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-semibold text-neutral-950 transition-opacity hover:opacity-90"
                  >
                    <Pencil size={12} />
                    Editar
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <QuocienteHierarquia anos={anos} basePath="/cenario" />
    </div>
  );
}
