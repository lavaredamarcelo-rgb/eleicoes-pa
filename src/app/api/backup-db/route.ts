import { NextResponse } from "next/server";
import { createReadStream } from "node:fs";
import { unlink, stat } from "node:fs/promises";
import { createGzip } from "node:zlib";
import { Readable } from "node:stream";
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
  const info = await stat(temp);

  const origem = createReadStream(temp);
  const gzip = createGzip({ level: 6 });
  origem.pipe(gzip);
  gzip.on("close", () => {
    unlink(temp).catch(() => {});
  });
  origem.on("error", () => {
    gzip.destroy();
    unlink(temp).catch(() => {});
  });

  return new NextResponse(Readable.toWeb(gzip) as ReadableStream, {
    headers: {
      "Content-Type": "application/gzip",
      "Content-Disposition": `attachment; filename="eleicoes-pa-prod-${carimbo}.db.gz"`,
      "X-Tamanho-Original": String(info.size),
    },
  });
}
