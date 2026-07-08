import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getEleitosOficiais } from "@/lib/data";
import { RelatorioEleitos } from "@/lib/pdf/RelatorioEleitos";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/eleitos/[ano]">) {
  await verifySession();
  const { ano: anoParam } = await ctx.params;
  const ano = Number(anoParam);
  if (!Number.isFinite(ano)) notFound();

  const grupos = await getEleitosOficiais(ano);
  if (grupos.length === 0) notFound();

  return pdfResponse(
    <RelatorioEleitos ano={ano} grupos={grupos} />,
    nomeArquivo("eleitos", String(ano), "pa")
  );
}
