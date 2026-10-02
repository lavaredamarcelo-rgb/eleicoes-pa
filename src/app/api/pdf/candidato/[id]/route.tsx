import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCandidato, getCandidaturasAnteriores } from "@/lib/data";
import { BoletimCandidato } from "@/lib/pdf/BoletimCandidato";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/candidato/[id]">) {
  await verifySession();
  const { id } = await ctx.params;

  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  // Dossiê completo: inclui toda a trajetória eleitoral da pessoa.
  const anteriores = await getCandidaturasAnteriores(candidato);

  return pdfResponse(
    <BoletimCandidato candidato={candidato} anteriores={anteriores} />,
    nomeArquivo("dossie", candidato.nome)
  );
}
