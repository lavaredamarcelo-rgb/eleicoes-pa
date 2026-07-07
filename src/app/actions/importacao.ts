"use server";

import { revalidatePath } from "next/cache";
import { verifySession } from "@/lib/dal";
import { parseCsvTse } from "@/lib/tse/parseCsv";
import { importarCandidatos } from "@/lib/tse/importarCandidatos";
import { importarResultados } from "@/lib/tse/importarResultados";
import { importarEleitorado } from "@/lib/tse/importarEleitorado";
import { limparCacheMunicipios } from "@/lib/tse/util";

export type ImportarTseState =
  | { error: string }
  | { success: true; criados: number; atualizados: number; avisos: string[] }
  | undefined;

async function exigirAdmin() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    throw new Error("Apenas administradores podem importar dados.");
  }
  return session;
}

export async function importarArquivoTse(
  _prevState: ImportarTseState,
  formData: FormData
): Promise<ImportarTseState> {
  await exigirAdmin();

  const eleicaoId = String(formData.get("eleicaoId") ?? "");
  const ano = Number(formData.get("ano"));
  const tipo = String(formData.get("tipo") ?? "");
  const arquivo = formData.get("arquivo");

  if (tipo !== "candidatos" && tipo !== "resultados" && tipo !== "eleitorado") {
    return { error: "Selecione o tipo de arquivo." };
  }
  if (tipo === "eleitorado") {
    if (!Number.isFinite(ano) || ano < 1990) return { error: "Informe o ano do eleitorado." };
  } else if (!eleicaoId) {
    return { error: "Selecione a eleição." };
  }
  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return { error: "Selecione um arquivo CSV." };
  }

  let rows: Record<string, string>[];
  try {
    const buffer = await arquivo.arrayBuffer();
    rows = parseCsvTse(buffer);
  } catch {
    return { error: "Não foi possível ler o arquivo. Confirme que é um CSV exportado pelo TSE (separado por ';')." };
  }

  if (rows.length === 0) {
    return { error: "Arquivo vazio ou sem linhas reconhecidas." };
  }

  limparCacheMunicipios();
  const resumo =
    tipo === "candidatos"
      ? await importarCandidatos(rows, eleicaoId)
      : tipo === "resultados"
        ? await importarResultados(rows, eleicaoId)
        : await importarEleitorado(rows, ano);

  revalidatePath("/candidatos");
  revalidatePath("/municipios");
  revalidatePath("/quociente");
  revalidatePath("/simulacoes");
  revalidatePath("/mapa");
  revalidatePath("/inicio");

  return { success: true, ...resumo };
}
