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
  } catch (e) {
    out.dbError = e instanceof Error ? e.message : String(e);
  }
  try {
    const tabelas = await prisma.$queryRawUnsafe<{ name: string }[]>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('PoliticoFavorito','PesquisaEleitoral','PreCandidato','new_PreCandidato') ORDER BY name"
    );
    out.tabelas = tabelas.map((t) => t.name);
    const col = await prisma.$queryRawUnsafe<{ n: bigint }[]>(
      "SELECT COUNT(*) as n FROM pragma_table_info('PreCandidato') WHERE name='registroTRE'"
    );
    out.migracaoRegistroTRE = Number(col[0]?.n) === 1 ? "aplicada" : "PENDENTE";
    const migs = await prisma.$queryRawUnsafe<
      { migration_name: string; finished_at: string | null; rolled_back_at: string | null }[]
    >(
      "SELECT migration_name, finished_at, rolled_back_at FROM _prisma_migrations ORDER BY started_at DESC LIMIT 6"
    );
    out.ultimasMigracoes = migs.map(
      (m) =>
        m.migration_name +
        (m.finished_at ? " [ok]" : m.rolled_back_at ? " [rolled-back]" : " [FALHOU]")
    );
  } catch (e) {
    out.migError = e instanceof Error ? e.message : String(e);
  }
  try {
    if (fs.existsSync("/data/migrate.log")) {
      out.migrateLog = fs.readFileSync("/data/migrate.log", "utf-8").slice(-1500);
    }
  } catch {}
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
