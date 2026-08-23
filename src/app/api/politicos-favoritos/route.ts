import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { candidatoId, favoritar, notas } = await req.json();
  console.log("POST favorito:", { userId: session.userId, candidatoId, favoritar });

  try {
    if (favoritar) {
      console.log("Buscando se existe...");
      const existe = await prisma.politicoFavorito.findFirst({
        where: { userId: session.userId, candidatoId },
      });

      console.log("Existe?", !!existe);
      if (!existe) {
        console.log("Criando novo favorito...");
        await prisma.politicoFavorito.create({
          data: { userId: session.userId, candidatoId, notas: notas || null },
        });
        console.log("Favorito criado!");
      } else if (notas !== undefined) {
        console.log("Atualizando notas...");
        await prisma.politicoFavorito.update({
          where: { id: existe.id },
          data: { notas },
        });
        console.log("Notas atualizadas!");
      }
    } else {
      console.log("Deletando favorito...");
      await prisma.politicoFavorito.deleteMany({
        where: { userId: session.userId, candidatoId },
      });
      console.log("Favorito deletado!");
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao favoritar:", error);
    return NextResponse.json(
      { error: `Erro ao processar favorito: ${error instanceof Error ? error.message : "desconhecido"}` },
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

    console.log("Favoritos retornados:", favoritos.length);
    if (favoritos.length > 0) {
      console.log("Primeiro favorito:", JSON.stringify(favoritos[0], null, 2));
    }

    return NextResponse.json(favoritos);
  } catch (error) {
    console.error("Erro ao buscar favoritos:", error);
    return NextResponse.json(
      { error: "Erro ao buscar favoritos" },
      { status: 500 }
    );
  }
}
