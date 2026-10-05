import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getVotosPorLocal } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";
import { RelatorioLocaisMunicipio } from "@/lib/pdf/RelatorioLocaisMunicipio";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF dos votos de um candidato em UM município, por bairro e local
// de votação (?id=<candidato>&mun=<nome do município>).
export async function GET(req: NextRequest) {
  await verifySession();
  const id = req.nextUrl.searchParams.get("id");
  const mun = req.nextUrl.searchParams.get("mun");
  if (!id || !mun) notFound();

  const candidato = await prisma.candidato.findUnique({
    where: { id },
    include: { partido: true, cargo: { include: { eleicao: true } }, resultados: true },
  });
  if (!candidato) notFound();

  const votosLocais = await getVotosPorLocal(id);
  const locais = votosLocais
    .filter((v) => v.colegioEleitoral.municipio.nome === mun)
    .map((v) => ({
      nome: v.colegioEleitoral.nome,
      bairro: v.colegioEleitoral.bairro,
      votos: v.votos,
    }));
  if (locais.length === 0) notFound();

  return pdfResponse(
    <RelatorioLocaisMunicipio
      candidato={{
        nome: candidato.nome,
        ano: candidato.cargo.eleicao.ano,
        cargo: candidato.cargo.nome,
        partido: candidato.partido.sigla,
      }}
      municipio={mun}
      totalCandidato={votosDecisivos(candidato.resultados)}
      locais={locais}
    />,
    nomeArquivo("locais", `${candidato.nome}-${mun}`)
  );
}
