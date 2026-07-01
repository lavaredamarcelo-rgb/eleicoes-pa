import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { decrypt } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  // Checagem no banco (não só no JWT) para que desativar um usuário ou
  // deixar um login temporário expirar tenha efeito imediato, mesmo com
  // uma sessão já emitida. Server Components não podem alterar cookies,
  // então o cookie inválido é apagado por uma Route Handler dedicada.
  const user = await prisma.user.findUnique({ where: { id: session.userId } });
  const expirado = !!user?.expiresAt && user.expiresAt.getTime() < Date.now();

  if (!user || !user.ativo || expirado) {
    redirect("/api/auth/expirar");
  }

  return session;
});
