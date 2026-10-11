import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { CARGOS_COMPARAVEIS, vencedoresPorMunicipio } from "@/lib/comparativos";
import { RelatorioVencedores } from "@/lib/pdf/RelatorioVencedores";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF do mapa de vencedores (?cargo=&ano=).
export async function GET(req: NextRequest) {
  await verifySession();
  const cargo = req.nextUrl.searchParams.get("cargo") ?? "";
  const ano = Number(req.nextUrl.searchParams.get("ano"));
  if (!CARGOS_COMPARAVEIS.includes(cargo as (typeof CARGOS_COMPARAVEIS)[number]) || !Number.isFinite(ano))
    notFound();

  const dados = await vencedoresPorMunicipio(cargo, ano);
  if (dados.porMunicipio.length === 0) notFound();

  return pdfResponse(
    <RelatorioVencedores
      cargo={cargo}
      ano={ano}
      porMunicipio={dados.porMunicipio}
      ranking={dados.ranking}
    />,
    nomeArquivo("vencedores", `${cargo}-${ano}`)
  );
}
