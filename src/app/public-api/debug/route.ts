import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const preCanCount = await prisma.preCandidato.count();
    const preCanAprovados = await prisma.preCandidato.count({
      where: { situacao: "APROVADO" },
    });

    // Diagnóstico da importação dos resultados 2026 (sem dados pessoais).
    const eleicoes2026 = await prisma.eleicao.findMany({
      where: { ano: 2026 },
      select: { id: true, ano: true, uf: true, tipo: true },
    });
    const cargos2026 = await prisma.cargo.findMany({
      where: { eleicao: { ano: 2026 } },
      select: { nome: true, _count: { select: { candidatos: true } } },
    });
    const eleitos2026 = await prisma.candidato.groupBy({
      by: ["cargoId"],
      where: { eleito: true, cargo: { eleicao: { ano: 2026 } } },
      _count: true,
    });
    const resultados2026 = await prisma.resultado.count({
      where: { candidato: { cargo: { eleicao: { ano: 2026 } } } },
    });
    const anosComEleitos = await prisma.eleicao.findMany({
      where: { cargos: { some: { candidatos: { some: { eleito: true } } } } },
      select: { ano: true },
      orderBy: { ano: "desc" },
    });

    return NextResponse.json({
      status: "ok",
      preCanditatosTotal: preCanCount,
      preCanditatosAprovados: preCanAprovados,
      eleicoes2026,
      cargos2026: cargos2026.map((c) => ({ nome: c.nome, candidatos: c._count.candidatos })),
      eleitos2026TotalGrupos: eleitos2026.length,
      eleitos2026Total: eleitos2026.reduce((s, g) => s + g._count, 0),
      resultados2026,
      anosComEleitos: anosComEleitos.map((a) => a.ano),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
