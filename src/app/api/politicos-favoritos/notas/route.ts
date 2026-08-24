import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { favoritoId, notas } = await req.json();

  try {
    await prisma.politicoFavorito.update({
      where: { id: favoritoId },
      data: { notas: notas || null },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao atualizar notas:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar notas" },
      { status: 500 }
    );
  }
}
