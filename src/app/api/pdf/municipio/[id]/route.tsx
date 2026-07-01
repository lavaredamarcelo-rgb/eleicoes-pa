import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getMunicipio } from "@/lib/data";
import { BoletimMunicipio } from "@/lib/pdf/BoletimMunicipio";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/municipio/[id]">) {
  await verifySession();
  const { id } = await ctx.params;

  const municipio = await getMunicipio(id);
  if (!municipio) notFound();

  return pdfResponse(
    <BoletimMunicipio municipio={municipio} />,
    nomeArquivo("boletim-municipio", municipio.nome)
  );
}
