"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, deleteSession } from "@/lib/session";

export type LoginState = { error?: string } | undefined;

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Informe e-mail e senha." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return { error: "E-mail ou senha inválidos." };
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return { error: "E-mail ou senha inválidos." };
  }

  if (!user.ativo) {
    return { error: "Este acesso foi desativado. Fale com o administrador." };
  }
  if (user.expiresAt && user.expiresAt.getTime() < Date.now()) {
    return { error: "Este acesso temporário expirou. Fale com o administrador." };
  }

  await createSession({
    userId: user.id,
    nome: user.nome,
    role: user.role,
    regiaoId: user.regiaoId,
    candidatoId: user.candidatoId,
  });

  redirect("/inicio");
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
