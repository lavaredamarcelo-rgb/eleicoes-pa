import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { calcularCenarioServidor, type CenarioPayload } from "@/lib/cenario";
import { RelatorioCenario } from "@/lib/pdf/RelatorioCenario";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// O cenário completo (trocas, fictícios, substituições) não cabe em URL —
// chega por POST e o servidor recalcula tudo a partir dos dados oficiais.
export async function POST(req: NextRequest) {
  await verifySession();

  let body: CenarioPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }
  if (!body?.cargoId) {
    return NextResponse.json({ error: "Informe o cargo do cenário." }, { status: 400 });
  }

  const calc = await calcularCenarioServidor(body);
  if (!calc) {
    return NextResponse.json({ error: "Cargo não encontrado ou não proporcional." }, { status: 404 });
  }

  return pdfResponse(
    <RelatorioCenario calc={calc} />,
    nomeArquivo("cenario", calc.cargo.nome, String(calc.cargo.ano))
  );
}
