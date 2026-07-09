"use server";

import { randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type CriarUsuarioState = { error?: string; senhaGerada?: string; email?: string } | undefined;

const CARACTERES_SENHA = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";

function gerarSenhaTemporaria(tamanho = 10) {
  const bytes = randomBytes(tamanho);
  return Array.from(bytes, (b) => CARACTERES_SENHA[b % CARACTERES_SENHA.length]).join("");
}

async function exigirAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("Apenas administradores podem gerenciar usuários.");
  }
  return session;
}

export async function criarUsuarioTemporario(
  _prevState: CriarUsuarioState,
  formData: FormData
): Promise<CriarUsuarioState> {
  const admin = await exigirAdmin();

  const nome = String(formData.get("nome") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const role = String(formData.get("role") ?? "COORDENADOR") as "ADMIN" | "COORDENADOR" | "CANDIDATO";
  const expiraEmStr = String(formData.get("expiraEm") ?? "").trim();

  if (!nome || !email) {
    return { error: "Preencha nome e e-mail." };
  }

  const existente = await prisma.user.findUnique({ where: { email } });
  if (existente) {
    return { error: "Já existe um usuário com esse e-mail." };
  }

  const senha = gerarSenhaTemporaria();
  const passwordHash = await bcrypt.hash(senha, 10);

  await prisma.user.create({
    data: {
      nome,
      email,
      passwordHash,
      role,
      expiresAt: expiraEmStr ? new Date(expiraEmStr) : null,
      criadoPorId: admin.userId,
    },
  });

  revalidatePath("/configuracoes/usuarios");
  return { senhaGerada: senha, email };
}

export async function alternarStatusUsuario(userId: string, ativo: boolean) {
  await exigirAdmin();
  // Reativar também limpa uma expiração já vencida — senão o acesso
  // continua bloqueado mesmo com o usuário "ativo".
  const usuario = await prisma.user.findUnique({ where: { id: userId } });
  const expiracaoVencida = !!usuario?.expiresAt && usuario.expiresAt.getTime() < Date.now();
  await prisma.user.update({
    where: { id: userId },
    data: { ativo, ...(ativo && expiracaoVencida ? { expiresAt: null } : {}) },
  });
  revalidatePath("/configuracoes/usuarios");
}

export async function excluirUsuario(userId: string) {
  const admin = await exigirAdmin();
  if (userId === admin.userId) {
    throw new Error("Você não pode excluir o próprio usuário.");
  }
  // Usuários criados por este continuam existindo, apenas sem o vínculo.
  await prisma.user.updateMany({ where: { criadoPorId: userId }, data: { criadoPorId: null } });
  await prisma.apuracaoFavorito.deleteMany({ where: { userId } });
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/configuracoes/usuarios");
}
