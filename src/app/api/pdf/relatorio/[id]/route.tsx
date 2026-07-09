import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { RelatorioIA } from "@/lib/pdf/RelatorioIA";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";
import type { ConteudoRelatorio } from "@/lib/relatorios";

const TIPO_ROTULO: Record<string, string> = {
  candidato: "Desempenho de candidato",
  partido: "Desempenho de partido",
  municipio: "Raio-X de município",
  comparativo: "Comparativo de eleições",
  livre: "Pedido livre",
};

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await verifySession();
  const { id } = await ctx.params;

  const relatorio = await prisma.relatorio.findUnique({ where: { id } });
  if (!relatorio || (relatorio.userId !== session.userId && session.role !== "ADMIN")) {
    notFound();
  }

  const conteudo = JSON.parse(relatorio.conteudo) as ConteudoRelatorio;

  return pdfResponse(
    <RelatorioIA
      conteudo={conteudo}
      tipoRotulo={TIPO_ROTULO[relatorio.tipo] ?? relatorio.tipo}
      modoPadrao={relatorio.modelo === "padrao"}
    />,
    nomeArquivo("relatorio", conteudo.titulo.slice(0, 60))
  );
}
