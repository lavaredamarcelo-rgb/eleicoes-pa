"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type CriarEleicaoState = { error?: string; success?: boolean } | undefined;

async function exigirAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("Apenas administradores podem gerenciar eleições.");
  }
  return session;
}

export async function criarEleicao(
  _prevState: CriarEleicaoState,
  formData: FormData
): Promise<CriarEleicaoState> {
  await exigirAdmin();

  const ano = Number(formData.get("ano"));
  const tipo = String(formData.get("tipo") ?? "");
  const uf = String(formData.get("uf") ?? "PA")
    .trim()
    .toUpperCase();

  if (!Number.isFinite(ano) || ano < 1990 || ano > 2100) {
    return { error: "Informe um ano válido." };
  }
  if (tipo !== "MUNICIPAL" && tipo !== "ESTADUAL") {
    return { error: "Selecione o tipo de eleição." };
  }
  if (!uf || uf.length !== 2) {
    return { error: "Informe a UF (2 letras)." };
  }

  const existente = await prisma.eleicao.findFirst({ where: { ano, tipo, uf } });
  if (existente) {
    return { error: `Já existe uma eleição ${tipo === "ESTADUAL" ? "estadual" : "municipal"} de ${ano} para ${uf}.` };
  }

  await prisma.eleicao.create({ data: { ano, tipo, uf } });

  revalidatePath("/configuracoes/eleicoes");
  revalidatePath("/importacao");

  return { success: true };
}
