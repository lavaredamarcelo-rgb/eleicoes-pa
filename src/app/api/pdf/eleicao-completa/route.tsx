import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { calcularSimulacao, type CandidatoSimulacao } from "@/lib/simulacaoPartido";
import {
  RelatorioEleicaoCompleta,
  type PartidoEleicaoPdf,
} from "@/lib/pdf/RelatorioEleicaoCompleta";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";
import candidatosTSE from "@/data/candidatos-tse-2026.json";

// Recebe os votos do cenário (por número de candidato) e recalcula tudo no
// servidor a partir dos candidatos oficiais do TSE.
export async function POST(req: NextRequest) {
  await verifySession();

  let body: { cargoNome?: string; vagas?: number; titulo?: string; votos?: Record<string, number> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo inválido." }, { status: 400 });
  }
  const { cargoNome, vagas, votos } = body;
  if (!cargoNome || !vagas || !votos) {
    return NextResponse.json({ error: "Informe cargo, vagas e votos." }, { status: 400 });
  }

  const tse = (candidatosTSE as any[]).filter((c) => c.cargo === cargoNome);
  if (tse.length === 0) return NextResponse.json({ error: "Disputa inválida." }, { status: 404 });

  const sims: CandidatoSimulacao[] = tse
    .filter((c) => (votos[String(c.numero)] ?? 0) > 0)
    .map((c) => ({
      id: String(c.numero),
      nome: c.nome,
      numero: c.numero,
      votos: Math.round(votos[String(c.numero)]),
      partidoId: c.partido,
      partidoSigla: c.partido,
    }));
  if (sims.length === 0) {
    return NextResponse.json({ error: "Nenhum candidato com votos." }, { status: 400 });
  }

  const siglas = [...new Set(tse.map((c) => c.partido))];
  const partidoById = new Map(siglas.map((s) => [s, { id: s, sigla: s }]));
  const resultado = calcularSimulacao(sims, vagas, new Map(), partidoById as any, {});

  const partidos: PartidoEleicaoPdf[] = siglas
    .map((sigla) => {
      const doPartido = sims
        .filter((c) => c.partidoId === sigla)
        .sort((a, b) => b.votos - a.votos);
      const info = resultado.partidos.find((p) => p.partidoId === sigla);
      return {
        sigla,
        cadeiras: info?.quocientePartidario ?? 0,
        totalVotos: doPartido.reduce((s, c) => s + c.votos, 0),
        candidatos: doPartido.map((c) => {
          const sit = resultado.situacao.get(c.id);
          return {
            nome: c.nome,
            numero: c.numero,
            votos: c.votos,
            situacao: (sit?.situacao ?? "sem-votos") as "eleito" | "suplente" | "sem-votos",
            ordemSuplencia: sit?.ordemSuplencia ?? null,
          };
        }),
      };
    })
    .sort((a, b) => b.cadeiras - a.cadeiras || b.totalVotos - a.totalVotos);

  const titulo = body.titulo?.trim()
    ? `Cenário — ${body.titulo.trim()}`
    : `Cenário Eleição Completa — ${cargoNome}`;

  return pdfResponse(
    <RelatorioEleicaoCompleta
      titulo={titulo}
      rotulo={`${cargoNome} · PA · 2026`}
      vagas={vagas}
      votosValidos={resultado.votosValidos}
      quociente={resultado.quocienteEleitoral}
      partidos={partidos}
    />,
    nomeArquivo("cenario-eleicao", cargoNome, body.titulo || "")
  );
}
