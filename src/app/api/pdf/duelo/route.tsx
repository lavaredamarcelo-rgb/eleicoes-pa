import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { compararPorMunicipio } from "@/lib/comparativos";
import { RelatorioDuelo } from "@/lib/pdf/RelatorioDuelo";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF do duelo entre dois candidatos (?a=&b=).
export async function GET(req: NextRequest) {
  await verifySession();
  const a = req.nextUrl.searchParams.get("a");
  const b = req.nextUrl.searchParams.get("b");
  if (!a || !b || a === b) notFound();

  const comp = await compararPorMunicipio(a, b);
  if (!comp) notFound();

  return pdfResponse(
    <RelatorioDuelo a={comp.a} b={comp.b} linhas={comp.linhas} />,
    nomeArquivo("duelo", `${comp.a.nome}-x-${comp.b.nome}`)
  );
}
