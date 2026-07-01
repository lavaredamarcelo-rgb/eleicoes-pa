import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCandidato } from "@/lib/data";
import { BoletimCandidato } from "@/lib/pdf/BoletimCandidato";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/candidato/[id]">) {
  await verifySession();
  const { id } = await ctx.params;

  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  return pdfResponse(
    <BoletimCandidato candidato={candidato} />,
    nomeArquivo("boletim-candidato", candidato.nome)
  );
}
