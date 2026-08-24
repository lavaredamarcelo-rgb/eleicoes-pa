import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Iniciando busca de pré-candidatos aprovados...");

    const preCandidatos = await prisma.preCandidato.findMany({
      where: { situacao: "APROVADO" },
      include: { partido: true },
      orderBy: [{ cargo: "asc" }, { nome: "asc" }],
    });

    console.log(`Encontrados ${preCandidatos.length} pré-candidatos aprovados`);
    return NextResponse.json(preCandidatos);
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error("Erro ao buscar pré-candidatos:", errorMsg);
    console.error("Stack:", error instanceof Error ? error.stack : "N/A");

    return NextResponse.json(
      { error: "Erro ao buscar pré-candidatos", details: errorMsg },
      { status: 500 }
    );
  }
}
