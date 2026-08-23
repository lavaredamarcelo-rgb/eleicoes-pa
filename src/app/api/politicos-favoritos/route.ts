import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidatoId, favoritar } = await req.json();

  try {
    if (favoritar) {
      // Verificar se já existe
      const existe = await prisma.politicoFavorito.findFirst({
        where: { userId: session.userId, candidatoId },
      });

      // Se não existe, criar
      if (!existe) {
        await prisma.politicoFavorito.create({
          data: { userId: session.userId, candidatoId },
        });
      }
    } else {
      // Deletar se existe
      await prisma.politicoFavorito.deleteMany({
        where: { userId: session.userId, candidatoId },
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao favoritar:", error);
    return NextResponse.json(
      { error: "Erro ao processar favorito" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const favoritos = await prisma.politicoFavorito.findMany({
      where: { userId: session.userId },
      include: {
        candidato: {
          include: {
            cargo: true,
            partido: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favoritos);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar favoritos" },
      { status: 500 }
    );
  }
}
