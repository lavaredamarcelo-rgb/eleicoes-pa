import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getDistribuicaoMeta, type BaseMeta } from "@/lib/data";
import { RelatorioMeta } from "@/lib/pdf/RelatorioMeta";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: NextRequest) {
  await verifySession();
  const sp = req.nextUrl.searchParams;
  const candidatoId = sp.get("candidato");
  const baseParam = sp.get("base");
  const meta = Number(sp.get("meta"));
  if (!candidatoId || !Number.isFinite(meta)) notFound();

  const base: BaseMeta =
    baseParam === "partido" || baseParam === "eleitorado" ? baseParam : "candidato";
  const distribuicao = await getDistribuicaoMeta(candidatoId, base);
  if (!distribuicao) notFound();

  return pdfResponse(
    <RelatorioMeta distribuicao={distribuicao} meta={meta} />,
    nomeArquivo("meta", distribuicao.nome, base)
  );
}
