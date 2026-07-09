import { ApuracaoAoVivo } from "@/components/ApuracaoAoVivo";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export default async function ApuracaoPage() {
  const session = await verifySession();
  const favoritos = await prisma.apuracaoFavorito.findMany({
    where: { userId: session.userId },
    orderBy: { ordem: "asc" },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Apuração ao vivo</h1>
        <p className="text-sm text-neutral-500">
          Eleições Gerais de 2026 — resultados oficiais direto do TSE, atualizados a cada minuto
          no dia da votação. O painel liga automaticamente quando o TSE publicar o pleito.
        </p>
      </div>

      <ApuracaoAoVivo favoritos={favoritos} />
    </div>
  );
}
