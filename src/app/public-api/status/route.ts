import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import * as fs from "fs";

export async function GET() {
  const out: Record<string, unknown> = { version: "v3-fix-migration" };
  try {
    out.users = await prisma.user.count();
    out.candidatos = await prisma.candidato.count();
    out.partidos = await prisma.partido.count();
    out.convencoes = await prisma.convencao.count();
    out.politicosFavoritos = await prisma.politicoFavorito.count();
    out.preCandidatos = await prisma.preCandidato.count();
    const col = await prisma.$queryRawUnsafe<{ n: number }[]>(
      "SELECT COUNT(*) as n FROM pragma_table_info('PreCandidato') WHERE name='registroTRE'"
    );
    out.migracaoRegistroTRE = Number(col[0]?.n) === 1 ? "aplicada" : "PENDENTE";
  } catch (e) {
    out.dbError = e instanceof Error ? e.message : String(e);
  }
  try {
    out.dataDirExists = fs.existsSync("/data");
    out.restoreMarker = fs.existsSync("/data/.restore-20260825-done");
    out.dbFile = fs.existsSync("/data/prod.db")
      ? Math.round(fs.statSync("/data/prod.db").size / 1e6) + " MB"
      : "ausente";
  } catch (e) {
    out.fsError = e instanceof Error ? e.message : String(e);
  }
  return NextResponse.json(out);
}
