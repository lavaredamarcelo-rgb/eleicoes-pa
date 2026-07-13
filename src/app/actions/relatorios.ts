"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function excluirRelatorio(id: string) {
  const session = await verifySession();

  const relatorio = await prisma.relatorio.findUnique({ where: { id } });
  if (!relatorio) return;

  // Cada usuário exclui os próprios relatórios; o admin exclui qualquer um.
  if (relatorio.userId !== session.userId && session.role !== "ADMIN") {
    throw new Error("Sem permissão para excluir este relatório.");
  }

  await prisma.relatorio.delete({ where: { id } });
  revalidatePath("/relatorios");
}
