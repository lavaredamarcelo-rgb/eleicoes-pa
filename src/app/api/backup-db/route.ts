import { NextResponse } from "next/server";
import { readFile, unlink } from "node:fs/promises";
import { gzipSync } from "node:zlib";
import os from "node:os";
import path from "node:path";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

// BACKUP DO BANCO (apenas ADMIN): tira um retrato consistente do SQLite
// com VACUUM INTO e devolve comprimido para download. É o jeito oficial
// de levar o prod.db para a pasta backups/ e o espelho no iCloud.
export async function GET() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return NextResponse.json({ erro: "Apenas administradores." }, { status: 403 });
  }

  const carimbo = new Date()
    .toLocaleString("sv-SE", { timeZone: "America/Belem" })
    .replace(" ", "-")
    .replace(/:/g, "")
    .slice(0, 15);
  const temp = path.join(os.tmpdir(), `backup-${carimbo}-${process.pid}.db`);

  // VACUUM INTO cria uma cópia íntegra e compacta mesmo com o banco em uso.
  await prisma.$executeRawUnsafe(`VACUUM INTO '${temp.replace(/'/g, "''")}'`);

  // Resposta COMPLETA (sem streaming) com Content-Length: o Safari do
  // iPhone salvava um arquivo vazio com a resposta em stream.
  const bruto = await readFile(temp);
  await unlink(temp).catch(() => {});
  const comprimido = gzipSync(bruto, { level: 6 });

  return new NextResponse(new Uint8Array(comprimido), {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="eleicoes-pa-prod-${carimbo}.db.gz"`,
      "Content-Length": String(comprimido.length),
      "X-Tamanho-Original": String(bruto.length),
    },
  });
}
