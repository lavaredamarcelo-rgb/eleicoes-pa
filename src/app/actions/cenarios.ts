"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

// Cenários salvos da meta por município (Criar Cenário) — cada usuário
// gerencia os próprios cenários de convenção.

export async function salvarCenarioMeta(entrada: {
  id?: string;
  cargoId: string;
  titulo: string;
  candidatoNome: string;
  partidoId?: string;
  votos: Record<string, number>;
}) {
  const session = await verifySession();
  const userId = String(session.userId);

  const titulo = entrada.titulo.trim().slice(0, 80);
  const candidatoNome = entrada.candidatoNome.trim().slice(0, 80) || "Pretenso candidato";
  if (!titulo) throw new Error("Dê um título ao cenário (ex.: Convenção de Santarém — chapa A).");

  const votosLimpos: Record<string, number> = {};
  for (const [municipioId, v] of Object.entries(entrada.votos ?? {})) {
    if (Number.isFinite(v) && v > 0) votosLimpos[municipioId] = Math.round(v);
  }
  if (Object.keys(votosLimpos).length === 0) {
    throw new Error("Alimente votos em pelo menos um município antes de salvar.");
  }

  const dados = {
    titulo,
    candidatoNome,
    partidoId: entrada.partidoId || null,
    votos: JSON.stringify(votosLimpos),
  };

  let salvo;
  if (entrada.id) {
    const existente = await prisma.cenarioMeta.findUnique({ where: { id: entrada.id } });
    if (!existente || existente.userId !== userId) {
      throw new Error("Cenário não encontrado.");
    }
    salvo = await prisma.cenarioMeta.update({ where: { id: entrada.id }, data: dados });
  } else {
    // Disputas projetadas ("proj:<id>") gravam sobre o cargo base — o
    // cenário é uma distribuição de votos por município, válida para ambos.
    const cargoId = entrada.cargoId.startsWith("proj:")
      ? entrada.cargoId.slice(5)
      : entrada.cargoId;
    salvo = await prisma.cenarioMeta.create({
      data: { ...dados, userId, cargoId },
    });
  }

  revalidatePath("/criar-cenario");
  return { id: salvo.id };
}

export async function excluirCenarioMeta(id: string) {
  const session = await verifySession();
  const cenario = await prisma.cenarioMeta.findUnique({ where: { id } });
  if (!cenario) return;
  if (cenario.userId !== String(session.userId) && session.role !== "ADMIN") {
    throw new Error("Sem permissão para excluir este cenário.");
  }
  await prisma.cenarioMeta.delete({ where: { id } });
  revalidatePath("/criar-cenario");
}

// Cenários salvos da Eleição Completa — votos por número de candidato.

export async function salvarCenarioEleicao(entrada: {
  id?: string;
  cargoNome: string;
  titulo: string;
  votos: Record<string, number>;
}) {
  const session = await verifySession();
  const userId = String(session.userId);

  const titulo = entrada.titulo.trim().slice(0, 80);
  if (!titulo) throw new Error("Dê um título ao cenário (ex.: Cenário base agosto).");

  const votosLimpos: Record<string, number> = {};
  for (const [numero, v] of Object.entries(entrada.votos ?? {})) {
    if (Number.isFinite(v) && v > 0) votosLimpos[numero] = Math.round(v);
  }
  if (Object.keys(votosLimpos).length === 0) {
    throw new Error("Gere ou alimente votos antes de salvar.");
  }

  const dados = {
    titulo,
    cargoNome: entrada.cargoNome,
    votos: JSON.stringify(votosLimpos),
  };

  let salvo;
  if (entrada.id) {
    const existente = await prisma.cenarioEleicao.findUnique({ where: { id: entrada.id } });
    if (!existente || existente.userId !== userId) {
      throw new Error("Cenário não encontrado.");
    }
    salvo = await prisma.cenarioEleicao.update({ where: { id: entrada.id }, data: dados });
  } else {
    salvo = await prisma.cenarioEleicao.create({ data: { ...dados, userId } });
  }

  revalidatePath("/criar-cenario");
  return { id: salvo.id };
}

export async function excluirCenarioEleicao(id: string) {
  const session = await verifySession();
  const cenario = await prisma.cenarioEleicao.findUnique({ where: { id } });
  if (!cenario) return;
  if (cenario.userId !== String(session.userId) && session.role !== "ADMIN") {
    throw new Error("Sem permissão para excluir este cenário.");
  }
  await prisma.cenarioEleicao.delete({ where: { id } });
  revalidatePath("/criar-cenario");
}
