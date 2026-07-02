import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { calcularQuocienteEleitoral } from "@/lib/eleitoral";
import { getPartidos } from "@/lib/data";
import { RelatorioSimulacao } from "@/lib/pdf/RelatorioSimulacao";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: Request, ctx: RouteContext<"/api/pdf/simulacao/[cargoId]">) {
  await verifySession();
  const { cargoId } = await ctx.params;

  const url = new URL(req.url);
  const candidatoId = url.searchParams.get("candidato");
  if (!candidatoId) notFound();

  const novoPartidoId = url.searchParams.get("partido") ?? undefined;
  const percentualParam = Number(url.searchParams.get("percentual"));
  const percentual = Number.isFinite(percentualParam) ? percentualParam : 0;

  const [resultado, partidos] = await Promise.all([
    calcularQuocienteEleitoral(cargoId),
    getPartidos(),
  ]);
  if (!resultado) notFound();

  const candidatoAlvo = resultado.candidatosComSituacao.find((c) => c.id === candidatoId);
  if (!candidatoAlvo) notFound();

  return pdfResponse(
    <RelatorioSimulacao
      resultado={resultado}
      partidos={partidos}
      candidatoId={candidatoId}
      novoPartidoId={novoPartidoId}
      percentual={percentual}
    />,
    nomeArquivo("simulacao", candidatoAlvo.nome, resultado.cargo.nome)
  );
}
