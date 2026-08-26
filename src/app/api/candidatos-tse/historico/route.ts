import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Histórico político de um nome de urna: candidaturas anteriores no banco
// (eleições importadas do TSE), partidos por onde passou e trocas registradas.
// O vínculo é pelo nome de urna — homônimos são possíveis, por isso cada
// item traz ano/cargo/município para o usuário conferir.
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nome = req.nextUrl.searchParams.get("nome")?.trim();
  if (!nome) {
    return NextResponse.json({ error: "Informe o nome." }, { status: 400 });
  }

  try {
    const candidatos = await prisma.candidato.findMany({
      where: { nome: { equals: nome } },
      include: {
        partido: { select: { sigla: true } },
        cargo: {
          include: {
            eleicao: { select: { ano: true } },
            municipio: { select: { nome: true } },
          },
        },
        resultados: { select: { votos: true } },
        trocasPartido: {
          include: {
            partidoOrigem: { select: { sigla: true } },
            partidoDestino: { select: { sigla: true } },
          },
          orderBy: { data: "asc" },
        },
      },
    });

    // Só eleições passadas (2026 é a candidatura atual, não histórico) e
    // sem duplicatas de importações repetidas.
    const vistos = new Set<string>();
    const candidaturas = candidatos
      .map((c) => ({
        ano: c.cargo.eleicao.ano,
        cargo: c.cargo.nome,
        municipio: c.cargo.municipio?.nome ?? null,
        partido: c.partido.sigla,
        numero: c.numero,
        votos: c.resultados.reduce((s, r) => s + r.votos, 0),
        eleito: c.eleito,
        nomeCompleto: c.nomeCompleto,
      }))
      .filter((c) => {
        if (c.ano >= 2026) return false;
        const chave = `${c.ano}|${c.cargo}|${c.partido}|${c.municipio ?? ""}`;
        if (vistos.has(chave)) return false;
        vistos.add(chave);
        return true;
      })
      .sort((a, b) => b.ano - a.ano);

    const trocas = candidatos.flatMap((c) =>
      c.trocasPartido.map((t) => ({
        data: t.data,
        de: t.partidoOrigem.sigla,
        para: t.partidoDestino.sigla,
        motivo: t.motivo,
      }))
    );

    const partidos = [
      ...new Set([
        ...candidaturas.map((c) => c.partido),
        ...trocas.flatMap((t) => [t.de, t.para]),
      ]),
    ];

    return NextResponse.json({ candidaturas, trocas, partidos });
  } catch (e) {
    console.error("Erro no histórico:", e);
    return NextResponse.json({ error: "Erro ao buscar histórico." }, { status: 500 });
  }
}
