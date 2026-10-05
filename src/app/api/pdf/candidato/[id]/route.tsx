import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCandidato, getCandidaturasAnteriores, getVotosPorLocal } from "@/lib/data";
import { BoletimCandidato } from "@/lib/pdf/BoletimCandidato";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/candidato/[id]">) {
  await verifySession();
  const { id } = await ctx.params;

  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  // Dossiê completo: trajetória inteira + votos por local de votação.
  const [anteriores, votosLocais] = await Promise.all([
    getCandidaturasAnteriores(candidato),
    getVotosPorLocal(candidato.id),
  ]);

  return pdfResponse(
    <BoletimCandidato
      candidato={candidato}
      anteriores={anteriores}
      locais={votosLocais.map((v) => ({
        nome: v.colegioEleitoral.nome,
        municipio: v.colegioEleitoral.municipio.nome,
        bairro: v.colegioEleitoral.bairro,
        votos: v.votos,
      }))}
    />,
    nomeArquivo("dossie", candidato.nome)
  );
}
