import Link from "next/link";
import { Radio } from "lucide-react";
import { ApuracaoAoVivo } from "@/components/ApuracaoAoVivo";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export default async function ApuracaoPage() {
  const session = await verifySession();
  const [favoritos, regioes, municipios] = await Promise.all([
    prisma.apuracaoFavorito.findMany({
      where: { userId: session.userId },
      orderBy: { ordem: "asc" },
    }),
    prisma.regiao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.municipio.findMany({
      where: { codigoTse: { not: null } },
      orderBy: { nome: "asc" },
      select: { nome: true, codigoTse: true, regiaoId: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Apuração ao vivo</h1>
        <p className="text-sm text-neutral-500">
          Eleições Gerais de 2026 — resultados oficiais direto do TSE, atualizados a cada minuto
          no dia da votação. O painel liga automaticamente quando o TSE publicar o pleito.
        </p>
      </div>

      <Link
        href="/radar"
        className="flex items-center justify-between rounded-xl border border-red-900/60 bg-gradient-to-r from-red-950/40 to-amber-950/30 px-4 py-3 transition-colors hover:border-red-700"
      >
        <div>
          <p className="text-sm font-semibold text-red-300">
            <Radio size={14} className="mr-1.5 inline animate-pulse" />
            RADAR DA APURAÇÃO — novo painel do dia 04/10
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">
            Corrida ao vivo, projeção de cadeiras, boca de urna virtual (apurado × pesquisas),
            alertas dos favoritos, modo TV e simulado de ensaio com os dados de 2022.
          </p>
        </div>
        <span className="shrink-0 rounded-lg bg-red-800 px-3 py-1.5 text-xs font-semibold text-white">
          Abrir →
        </span>
      </Link>

      <ApuracaoAoVivo
        favoritos={favoritos}
        regioes={regioes}
        municipios={municipios.map((m) => ({
          nome: m.nome,
          codigoTse: m.codigoTse!,
          regiaoId: m.regiaoId,
        }))}
      />
    </div>
  );
}
