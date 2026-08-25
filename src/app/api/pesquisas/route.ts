import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const b = await req.json();
    if (!b.disputa || !b.instituto || !b.dataDivulgacao) {
      return NextResponse.json(
        { error: "Preencha disputa, instituto e data de divulgação." },
        { status: 400 }
      );
    }
    const resultados = (b.resultados || [])
      .filter((r: any) => r.nome?.trim() && r.percentual !== "" && r.percentual != null)
      .map((r: any, i: number) => ({
        nome: String(r.nome).trim(),
        partido: r.partido?.trim() || null,
        percentual: Number(r.percentual),
        ordem: i,
      }));
    if (resultados.length === 0) {
      return NextResponse.json(
        { error: "Informe ao menos um candidato com percentual." },
        { status: 400 }
      );
    }

    const pesquisa = await prisma.pesquisaEleitoral.create({
      data: {
        disputa: b.disputa,
        turno: Number(b.turno) || 1,
        tipo: b.tipo || "estimulada",
        cenario: b.cenario?.trim() || null,
        instituto: b.instituto.trim(),
        contratante: b.contratante?.trim() || null,
        registroTSE: b.registroTSE?.trim() || null,
        linkRegistro: b.linkRegistro?.trim() || null,
        linkMateria: b.linkMateria?.trim() || null,
        dataDivulgacao: new Date(b.dataDivulgacao),
        dataCampoInicio: b.dataCampoInicio ? new Date(b.dataCampoInicio) : null,
        dataCampoFim: b.dataCampoFim ? new Date(b.dataCampoFim) : null,
        amostra: b.amostra ? Number(b.amostra) : null,
        margemErro: b.margemErro !== "" && b.margemErro != null ? Number(b.margemErro) : null,
        confianca: b.confianca !== "" && b.confianca != null ? Number(b.confianca) : null,
        observacoes: b.observacoes?.trim() || null,
        resultados: { create: resultados },
      },
    });

    return NextResponse.json({ ok: true, id: pesquisa.id });
  } catch (e) {
    console.error("Erro ao criar pesquisa:", e);
    return NextResponse.json({ error: "Erro ao salvar pesquisa." }, { status: 500 });
  }
}
