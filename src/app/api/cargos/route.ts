import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cargos = await prisma.cargo.findMany({
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(cargos);
  } catch (error) {
    console.error("Erro ao buscar cargos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar cargos" },
      { status: 500 }
    );
  }
}
