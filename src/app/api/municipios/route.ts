import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const municipios = await prisma.municipio.findMany({
      orderBy: { nome: "asc" },
    });
    return NextResponse.json(municipios);
  } catch (error) {
    console.error("Erro ao buscar municipios:", error);
    return NextResponse.json(
      { error: "Erro ao buscar municipios" },
      { status: 500 }
    );
  }
}
