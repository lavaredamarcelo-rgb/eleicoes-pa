import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import {
  RelatorioSimulacaoLivre,
  type PayloadSimulacaoLivre,
} from "@/lib/pdf/RelatorioSimulacaoLivre";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF genérico dos simuladores (Quociente e Simulações): recebe o resultado
// já calculado no navegador e apenas diagrama o relatório.
export async function POST(req: NextRequest) {
  await verifySession();

  let body: PayloadSimulacaoLivre;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }

  if (!body?.titulo || typeof body.titulo !== "string") {
    return NextResponse.json({ erro: "titulo obrigatório" }, { status: 400 });
  }

  // Sanitiza: só texto, com limites — o conteúdo vem do cliente.
  const txt = (v: unknown, max = 300) => String(v ?? "").slice(0, max);
  const payload: PayloadSimulacaoLivre = {
    titulo: txt(body.titulo, 120),
    subtitulo: body.subtitulo ? txt(body.subtitulo, 200) : undefined,
    stats: (body.stats ?? []).slice(0, 4).map((s) => ({
      rotulo: txt(s?.rotulo, 60),
      valor: txt(s?.valor, 40),
    })),
    secoes: (body.secoes ?? []).slice(0, 6).map((sec) => ({
      titulo: sec?.titulo ? txt(sec.titulo, 120) : undefined,
      colunas: (sec?.colunas ?? []).slice(0, 6).map((c) => txt(c, 40)),
      linhas: (sec?.linhas ?? [])
        .slice(0, 800)
        .map((l) => (Array.isArray(l) ? l.slice(0, 6).map((c) => txt(c, 120)) : [])),
    })),
    observacoes: (body.observacoes ?? []).slice(0, 12).map((o) => txt(o, 400)),
  };

  return pdfResponse(
    <RelatorioSimulacaoLivre payload={payload} />,
    nomeArquivo("simulacao", payload.titulo)
  );
}
