import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";

// Busca leve de candidatos (qualquer cargo/ano) para autocompletes.
export async function GET(req: NextRequest) {
  await verifySession();
  const q = (req.nextUrl.searchParams.get("q") ?? "").trim();
  if (q.length < 2) return NextResponse.json({ candidatos: [] });

  const numero = /^\d+$/.test(q) ? Number(q) : undefined;
  const candidatos = await prisma.candidato.findMany({
    where: {
      OR: [
        { nome: { contains: q } },
        { nomeCompleto: { contains: q } },
        ...(numero !== undefined ? [{ numero }] : []),
      ],
    },
    include: { partido: true, cargo: { include: { eleicao: true, municipio: true } } },
    orderBy: { cargo: { eleicao: { ano: "desc" } } },
    take: 12,
  });

  return NextResponse.json({
    candidatos: candidatos.map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partido: c.partido.sigla,
      cargo: c.cargo.nome,
      municipio: c.cargo.municipio?.nome ?? "PA",
      ano: c.cargo.eleicao.ano,
    })),
  });
}
