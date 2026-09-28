import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { gerarSimulado, lerTSE } from "@/lib/radar";

// Snapshot da apuração para o Radar: ?cargo=governador|senador|dep-federal|
// dep-estadual|presidente. Com ?simulado=1&t=<0-100> serve o ensaio com os
// dados de 2022. Cache curto no servidor para não martelar o TSE.
const cacheTSE = new Map<string, { quando: number; corpo: unknown }>();

export async function GET(req: NextRequest) {
  await verifySession();
  const sp = req.nextUrl.searchParams;
  const cargo = sp.get("cargo") ?? "governador";
  const simulado = sp.get("simulado") === "1";

  if (simulado) {
    const t = Number(sp.get("t") ?? 0);
    return NextResponse.json(await gerarSimulado(cargo, t));
  }

  const atual = cacheTSE.get(cargo);
  if (atual && Date.now() - atual.quando < 20_000) {
    return NextResponse.json(atual.corpo);
  }
  const snap = await lerTSE(cargo);
  cacheTSE.set(cargo, { quando: Date.now(), corpo: snap });
  return NextResponse.json(snap);
}
