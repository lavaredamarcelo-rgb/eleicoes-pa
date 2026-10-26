import { NextResponse } from "next/server";
import { createReadStream, createWriteStream } from "node:fs";
import { unlink, stat } from "node:fs/promises";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";
import { Readable } from "node:stream";
import os from "node:os";
import path from "node:path";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

// BACKUP DO BANCO (apenas ADMIN). Estratégia híbrida: o retrato
// (VACUUM INTO) e o gzip acontecem EM DISCO via stream — memória baixa,
// o buffer total estourava o contêiner com o banco grande — e a
// resposta sai com Content-Length conhecido, que é o que o Safari do
// iPhone exige para salvar o anexo em vez de um arquivo vazio.
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
  const tempDb = path.join(os.tmpdir(), `backup-${carimbo}-${process.pid}.db`);
  const tempGz = `${tempDb}.gz`;
  const limpar = () => {
    unlink(tempDb).catch(() => {});
    unlink(tempGz).catch(() => {});
  };

  try {
    // Retrato consistente mesmo com o banco em uso.
    await prisma.$executeRawUnsafe(`VACUUM INTO '${tempDb.replace(/'/g, "''")}'`);
    // Comprime disco -> disco (streaming, sem segurar o banco em memória).
    await pipeline(createReadStream(tempDb), createGzip({ level: 6 }), createWriteStream(tempGz));
    await unlink(tempDb).catch(() => {});
    const info = await stat(tempGz);

    const origem = createReadStream(tempGz);
    origem.on("close", limpar);
    origem.on("error", limpar);

    return new NextResponse(Readable.toWeb(origem) as ReadableStream, {
      headers: {
        "Content-Type": "application/gzip",
        "Content-Disposition": `attachment; filename="eleicoes-pa-prod-${carimbo}.db.gz"`,
        "Content-Length": String(info.size),
      },
    });
  } catch (e) {
    limpar();
    return NextResponse.json(
      { erro: `Falha ao gerar o backup: ${e instanceof Error ? e.message : String(e)}` },
      { status: 500 }
    );
  }
}
