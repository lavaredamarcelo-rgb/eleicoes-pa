"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

export async function adicionarFavoritoApuracao(dados: {
  rotulo: string;
  ano: string;
  eleicaoCd: string;
  cargoCd: string;
  municipioTse: string | null;
}) {
  const session = await verifySession();
  const existente = await prisma.apuracaoFavorito.findFirst({
    where: {
      userId: session.userId,
      eleicaoCd: dados.eleicaoCd,
      cargoCd: dados.cargoCd,
      municipioTse: dados.municipioTse,
    },
  });
  if (existente) return { ok: true, id: existente.id };

  const ultimo = await prisma.apuracaoFavorito.findFirst({
    where: { userId: session.userId },
    orderBy: { ordem: "desc" },
  });
  const criado = await prisma.apuracaoFavorito.create({
    data: {
      userId: session.userId,
      rotulo: dados.rotulo.slice(0, 120),
      ano: dados.ano,
      eleicaoCd: dados.eleicaoCd,
      cargoCd: dados.cargoCd,
      municipioTse: dados.municipioTse,
      ordem: (ultimo?.ordem ?? 0) + 1,
    },
  });
  revalidatePath("/apuracao");
  return { ok: true, id: criado.id };
}

export async function removerFavoritoApuracao(id: string) {
  const session = await verifySession();
  await prisma.apuracaoFavorito.deleteMany({ where: { id, userId: session.userId } });
  revalidatePath("/apuracao");
  return { ok: true };
}
