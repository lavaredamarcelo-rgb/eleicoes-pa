import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await verifySession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await params;
    await prisma.pesquisaEleitoral.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Erro ao excluir pesquisa:", e);
    return NextResponse.json({ error: "Erro ao excluir." }, { status: 500 });
  }
}
