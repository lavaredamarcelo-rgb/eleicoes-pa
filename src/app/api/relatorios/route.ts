import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { gerarRelatorio, type TipoRelatorio } from "@/lib/relatorios";

const TIPOS: TipoRelatorio[] = ["candidato", "partido", "municipio", "comparativo", "cenario", "cenario-majoritario", "livre"];

// A geração consulta a API do Claude e pode levar dezenas de segundos.
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const session = await verifySession();

  // Geração restrita ao administrador — cada relatório consome créditos da
  // API paga.
  if (session.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Apenas o administrador pode gerar relatórios." },
      { status: 403 }
    );
  }

  let body: { tipo?: string; params?: Record<string, string> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const tipo = body.tipo as TipoRelatorio;
  if (!TIPOS.includes(tipo)) {
    return NextResponse.json({ error: "Tipo de relatório inválido." }, { status: 400 });
  }

  try {
    const relatorio = await gerarRelatorio({
      userId: String(session.userId),
      tipo,
      params: body.params ?? {},
    });
    return NextResponse.json({ id: relatorio.id });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Falha ao gerar o relatório.";
    console.error("[relatorios]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
