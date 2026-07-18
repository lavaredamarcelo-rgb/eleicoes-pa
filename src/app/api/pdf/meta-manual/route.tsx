import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { estudoViabilidadeServidor } from "@/lib/cenario";
import { RelatorioMetaManual, type ItemMetaManual } from "@/lib/pdf/RelatorioMetaManual";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// Os votos alimentados à mão não cabem em uma URL (144 municípios), então a
// distribuição manual chega por POST com JSON. Com cargoId + partidoId, o
// PDF inclui o estudo fictício de viabilidade da disputa base.
export async function POST(req: NextRequest) {
  await verifySession();

  let body: { nome?: string; itens?: ItemMetaManual[]; cargoId?: string; partidoId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const nome = (body.nome ?? "").trim().slice(0, 80) || "Pretenso candidato";
  const itens = (body.itens ?? [])
    .filter(
      (i) =>
        typeof i?.municipio === "string" &&
        typeof i?.regiao === "string" &&
        Number.isFinite(i?.votos) &&
        i.votos > 0
    )
    .slice(0, 200);
  if (itens.length === 0) {
    return NextResponse.json({ error: "Alimente votos em pelo menos um município." }, { status: 400 });
  }

  const total = itens.reduce((s, i) => s + i.votos, 0);
  const estudo =
    body.cargoId && body.partidoId
      ? await estudoViabilidadeServidor(body.cargoId, body.partidoId, nome, total)
      : null;

  return pdfResponse(
    <RelatorioMetaManual nome={nome} itens={itens} estudo={estudo} />,
    nomeArquivo("meta-manual", nome)
  );
}
