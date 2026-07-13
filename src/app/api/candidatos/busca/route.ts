import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { buscarCandidatosLeve } from "@/lib/data";

// Busca leve de candidatos (qualquer cargo/ano) para autocompletes —
// insensível a caixa e acentos (ex.: "chicão" encontra "CHICÃO").
export async function GET(req: NextRequest) {
  await verifySession();
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ candidatos: [] });

  return NextResponse.json({ candidatos: await buscarCandidatosLeve(q) });
}
