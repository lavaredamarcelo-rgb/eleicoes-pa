import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const preCanCount = await prisma.preCandidato.count();
    const preCanAprovados = await prisma.preCandidato.count({
      where: { situacao: "APROVADO" },
    });

    return NextResponse.json({
      status: "ok",
      preCanditatosTotal: preCanCount,
      preCanditatosAprovados: preCanAprovados,
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
