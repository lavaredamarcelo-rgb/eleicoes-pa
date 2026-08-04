"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

// Aba Convenções: datas por partido e pré-candidatos (com situação).
// Mutações restritas ao administrador.

async function exigirAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("Apenas o administrador pode editar as convenções.");
  }
  return session;
}

export async function salvarConvencao(entrada: {
  partidoId: string;
  dataPrevista?: string;
  dataRealizada?: string;
  local?: string;
  observacoes?: string;
}) {
  await exigirAdmin();
  const dados = {
    dataPrevista: entrada.dataPrevista?.trim().slice(0, 40) || null,
    dataRealizada: entrada.dataRealizada?.trim().slice(0, 40) || null,
    local: entrada.local?.trim().slice(0, 120) || null,
    observacoes: entrada.observacoes?.trim().slice(0, 300) || null,
  };
  await prisma.convencao.upsert({
    where: { partidoId: entrada.partidoId },
    create: { partidoId: entrada.partidoId, ...dados },
    update: dados,
  });
  revalidatePath("/convencoes");
}

export async function adicionarPreCandidato(entrada: {
  partidoId: string;
  nome: string;
  cargo: string;
  observacoes?: string;
}) {
  await exigirAdmin();
  const nome = entrada.nome.trim().slice(0, 80);
  const cargo = entrada.cargo.trim().slice(0, 40);
  if (!nome || !cargo) throw new Error("Informe nome e cargo do pré-candidato.");
  await prisma.preCandidato.upsert({
    where: { partidoId_nome_cargo: { partidoId: entrada.partidoId, nome, cargo } },
    create: {
      partidoId: entrada.partidoId,
      nome,
      cargo,
      origem: "manual",
      observacoes: entrada.observacoes?.trim().slice(0, 300) || null,
    },
    update: {},
  });
  revalidatePath("/convencoes");
}

export async function mudarSituacaoPreCandidato(id: string, situacao: string) {
  await exigirAdmin();
  if (!["PRE_CANDIDATO", "APROVADO", "NAO_APROVADO"].includes(situacao)) {
    throw new Error("Situação inválida.");
  }
  await prisma.preCandidato.update({ where: { id }, data: { situacao } });
  revalidatePath("/convencoes");
}

export async function excluirPreCandidato(id: string) {
  await exigirAdmin();
  await prisma.preCandidato.delete({ where: { id } });
  revalidatePath("/convencoes");
}
