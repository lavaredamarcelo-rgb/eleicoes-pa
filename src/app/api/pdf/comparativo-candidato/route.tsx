import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { compararPorMunicipio } from "@/lib/comparativos";
import { RelatorioComparativoCandidato } from "@/lib/pdf/RelatorioComparativoCandidato";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF do comparativo de um candidato entre duas eleições (?a=&b= ids).
export async function GET(req: NextRequest) {
  await verifySession();
  const a = req.nextUrl.searchParams.get("a");
  const b = req.nextUrl.searchParams.get("b");
  if (!a || !b) notFound();

  const comp = await compararPorMunicipio(a, b);
  if (!comp) notFound();

  return pdfResponse(
    <RelatorioComparativoCandidato a={comp.a} b={comp.b} linhas={comp.linhas} />,
    nomeArquivo("comparativo", `${comp.b.nome}-${comp.a.ano}-${comp.b.ano}`)
  );
}
