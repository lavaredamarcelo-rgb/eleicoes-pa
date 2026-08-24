import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const preCandidatos = await prisma.preCandidato.findMany({
      where: { situacao: "APROVADO" },
      include: { partido: true },
      orderBy: [{ cargo: "asc" }, { nome: "asc" }],
    });

    return NextResponse.json(preCandidatos);
  } catch (error) {
    console.error("Erro ao buscar pré-candidatos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar pré-candidatos" },
      { status: 500 }
    );
  }
}
