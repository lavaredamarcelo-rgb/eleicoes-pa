import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getDistribuicaoCandidato } from "@/lib/data";
import { RelatorioMetaPercentual } from "@/lib/pdf/RelatorioMetaPercentual";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: NextRequest) {
  await verifySession();
  const sp = req.nextUrl.searchParams;
  const candidatoId = sp.get("candidato");
  const pct = Number(sp.get("pct"));
  if (!candidatoId || !Number.isFinite(pct)) notFound();

  const distribuicao = await getDistribuicaoCandidato(candidatoId);
  if (!distribuicao) notFound();

  return pdfResponse(
    <RelatorioMetaPercentual distribuicao={distribuicao} pct={pct} />,
    nomeArquivo("projecao-percentual", distribuicao.nome)
  );
}
