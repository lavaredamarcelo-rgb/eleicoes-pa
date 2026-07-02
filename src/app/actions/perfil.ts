"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export type AlterarSenhaState = { error?: string; success?: boolean } | undefined;

export async function alterarSenha(
  _prevState: AlterarSenhaState,
  formData: FormData
): Promise<AlterarSenhaState> {
  const session = await verifySession();

  const senhaAtual = String(formData.get("senhaAtual") ?? "");
  const novaSenha = String(formData.get("novaSenha") ?? "");
  const confirmarSenha = String(formData.get("confirmarSenha") ?? "");

  if (!senhaAtual || !novaSenha || !confirmarSenha) {
    return { error: "Preencha todos os campos." };
  }
  if (novaSenha.length < 8) {
    return { error: "A nova senha precisa ter pelo menos 8 caracteres." };
  }
  if (novaSenha !== confirmarSenha) {
    return { error: "A confirmação não bate com a nova senha." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  if (!user) {
    return { error: "Usuário não encontrado." };
  }

  const senhaValida = await bcrypt.compare(senhaAtual, user.passwordHash);
  if (!senhaValida) {
    return { error: "Senha atual incorreta." };
  }

  const passwordHash = await bcrypt.hash(novaSenha, 10);
  await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });

  return { success: true };
}
