import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { preCandidatoId, registroTRE } = await req.json();

  try {
    const preCandidato = await prisma.preCandidato.update({
      where: { id: preCandidatoId },
      data: {
        registroTRE,
        dataRegistroTRE: registroTRE ? new Date() : null,
      },
    });

    return NextResponse.json(preCandidato);
  } catch (error) {
    console.error("Erro ao atualizar registro TRE:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar registro TRE" },
      { status: 500 }
    );
  }
}
