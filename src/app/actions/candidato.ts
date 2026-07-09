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

  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      trocasPartido: { orderBy: { data: "desc" }, take: 1 },
    },
  });
  if (!candidato) {
    return { error: "Candidato não encontrado." };
  }
  // A filiação atual é a última troca registrada (ou o partido da urna). O
  // partido da candidatura NÃO é alterado: ele preserva os votos por partido
  // e o quociente do ano da eleição.
  const filiacaoAtualId = candidato.trocasPartido[0]?.partidoDestinoId ?? candidato.partidoId;
  if (filiacaoAtualId === novoPartidoId) {
    return { error: "O candidato já está filiado a esse partido." };
  }

  await prisma.trocaPartido.create({
    data: {
      candidatoId,
      partidoOrigemId: filiacaoAtualId,
      partidoDestinoId: novoPartidoId,
      data: new Date(dataStr),
      motivo,
    },
  });

  revalidatePath(`/candidatos/${candidatoId}`);
  return { success: true };
}
