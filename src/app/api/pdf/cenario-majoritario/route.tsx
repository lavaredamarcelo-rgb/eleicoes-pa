import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import {
  RelatorioCenarioMajoritario,
  type CenarioMajoritarioPayload,
} from "@/lib/pdf/RelatorioCenarioMajoritario";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function POST(req: NextRequest) {
  await verifySession();

  let body: CenarioMajoritarioPayload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }
  const linhas = (body.linhas ?? []).filter(
    (l) => typeof l?.nome === "string" && Number.isFinite(l?.votos)
  );
  if (linhas.length === 0) {
    return NextResponse.json({ error: "Cenário sem candidaturas." }, { status: 400 });
  }

  return pdfResponse(
    <RelatorioCenarioMajoritario c={{ ...body, linhas: linhas.slice(0, 100) }} />,
    nomeArquivo("cenario-majoritario", body.cargoNome ?? "disputa", String(body.ano ?? ""))
  );
}
