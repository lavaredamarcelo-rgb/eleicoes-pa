import { ApuracaoAoVivo } from "@/components/ApuracaoAoVivo";
import { prisma } from "@/lib/prisma";

export default async function ApuracaoPage() {
  const municipios = await prisma.municipio.findMany({
    where: { codigoTse: { not: null } },
    orderBy: { nome: "asc" },
    select: { codigoTse: true, nome: true },
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Apuração ao vivo</h1>
        <p className="text-sm text-neutral-500">
          Resultados oficiais direto do TSE, atualizados automaticamente a cada minuto. No dia da
          eleição, acompanhe a contagem em tempo real; fora dele, veja a totalização final de
          qualquer pleito do índice — as eleições de 2026 aparecem aqui assim que o TSE as
          publicar.
        </p>
      </div>

      <ApuracaoAoVivo
        municipios={municipios.map((m) => ({ codigoTse: m.codigoTse!, nome: m.nome }))}
      />
    </div>
  );
}
