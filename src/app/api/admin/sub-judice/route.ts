import { NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { corrigirSubJudice2024 } from "@/lib/tse/corrigirSubJudice";

// Busca no TSE o resultado atual das disputas de Vereador 2024 que ficaram
// sub judice e grava votos/eleitos/legenda. Restrito ao administrador.
export const maxDuration = 120;

export async function POST() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return NextResponse.json({ error: "Apenas o administrador." }, { status: 403 });
  }

  try {
    const resumo = await corrigirSubJudice2024();
    return NextResponse.json({ resumo });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Falha na correção.";
    console.error("[sub-judice]", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
