import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import {
  calcularQuocienteEleitoral,
  calcularMajoritario,
  calcularQuocienteProjetado,
  cenarioComAprovados,
} from "@/lib/eleitoral";
import { RelatorioQuociente, RelatorioMajoritario } from "@/lib/pdf/RelatorioQuociente";
import { RelatorioQuocientePrevisto } from "@/lib/pdf/RelatorioQuocientePrevisto";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/quociente/[cargoId]">) {
  await verifySession();
  const { cargoId: cargoIdBruto } = await ctx.params;
  const cargoId = decodeURIComponent(cargoIdBruto);

  // Disputa projetada ("proj:<id>"): PDF do quociente PREVISTO (ex.: 2026),
  // com as mesmas estimativas e cenários da tela.
  if (cargoId.startsWith("proj:")) {
    const proj = await calcularQuocienteProjetado(cargoId.slice(5));
    if (!proj) notFound();
    const comAprovados = await cenarioComAprovados(cargoId.slice(5), proj);
    return pdfResponse(
      <RelatorioQuocientePrevisto proj={proj} comAprovados={comAprovados} />,
      nomeArquivo("quociente-previsto", proj.cargoNome, String(proj.anoAlvo))
    );
  }

  const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
  if (!cargo) notFound();

  if (cargo.tipoApuracao === "PROPORCIONAL") {
    const resultado = await calcularQuocienteEleitoral(cargoId);
    if (!resultado) notFound();
    return pdfResponse(
      <RelatorioQuociente resultado={resultado} />,
      nomeArquivo("quociente", resultado.cargo.nome, resultado.cargo.municipio?.nome ?? "pa")
    );
  }

  const resultado = await calcularMajoritario(cargoId);
  if (!resultado) notFound();
  return pdfResponse(
    <RelatorioMajoritario resultado={resultado} />,
    nomeArquivo("apuracao", resultado.cargo.nome, resultado.cargo.municipio?.nome ?? "pa")
  );
}
