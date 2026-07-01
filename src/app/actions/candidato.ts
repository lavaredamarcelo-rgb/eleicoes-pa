"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type TrocaPartidoState = { error?: string; success?: boolean } | undefined;

export async function registrarTrocaPartido(
  _prevState: TrocaPartidoState,
  formData: FormData
): Promise<TrocaPartidoState> {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    return { error: "Apenas administradores podem registrar trocas de partido." };
  }

  const candidatoId = String(formData.get("candidatoId") ?? "");
  const novoPartidoId = String(formData.get("novoPartidoId") ?? "");
  const dataStr = String(formData.get("data") ?? "");
  const motivo = String(formData.get("motivo") ?? "").trim() || null;

  if (!candidatoId || !novoPartidoId || !dataStr) {
    return { error: "Preencha todos os campos obrigatórios." };
  }

  const candidato = await prisma.candidato.findUnique({ where: { id: candidatoId } });
  if (!candidato) {
    return { error: "Candidato não encontrado." };
  }
  if (candidato.partidoId === novoPartidoId) {
    return { error: "O candidato já está filiado a esse partido." };
  }

  await prisma.$transaction([
    prisma.trocaPartido.create({
      data: {
        candidatoId,
        partidoOrigemId: candidato.partidoId,
        partidoDestinoId: novoPartidoId,
        data: new Date(dataStr),
        motivo,
      },
    }),
    prisma.candidato.update({
      where: { id: candidatoId },
      data: { partidoId: novoPartidoId },
    }),
  ]);

  revalidatePath(`/candidatos/${candidatoId}`);
  return { success: true };
}
