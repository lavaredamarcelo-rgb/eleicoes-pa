import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { calcularQuocienteEleitoral, calcularMajoritario } from "@/lib/eleitoral";
import { RelatorioQuociente, RelatorioMajoritario } from "@/lib/pdf/RelatorioQuociente";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(_req: Request, ctx: RouteContext<"/api/pdf/quociente/[cargoId]">) {
  await verifySession();
  const { cargoId } = await ctx.params;

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
