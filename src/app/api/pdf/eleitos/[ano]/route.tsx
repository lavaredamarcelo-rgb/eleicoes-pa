import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { getEleitosOficiais } from "@/lib/data";
import { RelatorioEleitos } from "@/lib/pdf/RelatorioEleitos";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: Request, ctx: RouteContext<"/api/pdf/eleitos/[ano]">) {
  await verifySession();
  const { ano: anoParam } = await ctx.params;
  const ano = Number(anoParam);
  if (!Number.isFinite(ano)) notFound();

  const municipioId = new URL(req.url).searchParams.get("municipio");

  let grupos = await getEleitosOficiais(ano);
  let local: string | undefined;

  if (municipioId) {
    const municipio = await prisma.municipio.findUnique({
      where: { id: municipioId },
      select: { nome: true },
    });
    if (!municipio) notFound();
    local = municipio.nome;

    // Cargos municipais: só a disputa do município; cargos estaduais: só os
    // eleitos cujo reduto (município de maior votação) é o escolhido.
    grupos = grupos
      .map((g) => {
        if (g.escopo === "municipal") {
          const municipios = g.municipios.filter((m) => m.municipioId === municipioId);
          const totalEleitos = municipios.reduce((s, m) => s + m.eleitos.length, 0);
          return { ...g, municipios, eleitos: [], totalEleitos };
        }
        const eleitos = g.eleitos.filter((e) => e.redutoMunicipioId === municipioId);
        return { ...g, eleitos, municipios: [], totalEleitos: eleitos.length };
      })
      .filter((g) => g.totalEleitos > 0);
  }

  if (grupos.length === 0) notFound();

  return pdfResponse(
    <RelatorioEleitos ano={ano} grupos={grupos} local={local} />,
    nomeArquivo("eleitos", String(ano), local || "pa")
  );
}
