import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCandidato } from "@/lib/data";
import { RelatorioProjecao } from "@/lib/pdf/RelatorioProjecao";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: Request, ctx: RouteContext<"/api/pdf/projecao/[id]">) {
  await verifySession();
  const { id } = await ctx.params;

  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  const url = new URL(req.url);
  const metodo = url.searchParams.get("metodo") === "meta" ? "meta" : "percentual";
  const valorParam = Number(url.searchParams.get("valor"));
  const valor = Number.isFinite(valorParam) ? valorParam : 0;

  return pdfResponse(
    <RelatorioProjecao candidato={candidato} metodo={metodo} valor={valor} />,
    nomeArquivo("projecao", candidato.nome)
  );
}
