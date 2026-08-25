import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { RelatorioPesquisas, type GrupoPesquisas } from "@/lib/pdf/RelatorioPesquisas";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

const ORDEM_DISPUTAS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Presidente",
];

export async function GET(req: Request) {
  await verifySession();
  const url = new URL(req.url);
  const disputa = url.searchParams.get("disputa") || undefined;
  const turnoParam = url.searchParams.get("turno");
  const turno = turnoParam ? Number(turnoParam) : undefined;

  const where: any = {};
  if (disputa) where.disputa = disputa;
  if (turno) where.turno = turno;

  const pesquisas = await prisma.pesquisaEleitoral.findMany({
    where,
    include: { resultados: true },
    orderBy: { dataDivulgacao: "asc" },
  });
  if (pesquisas.length === 0) notFound();

  const grupos: GrupoPesquisas[] = [];
  for (const d of ORDEM_DISPUTAS) {
    for (const t of [1, 2]) {
      const doGrupo = pesquisas.filter((p) => p.disputa === d && p.turno === t);
      if (doGrupo.length > 0) grupos.push({ disputa: d, turno: t, pesquisas: doGrupo });
    }
  }

  const titulo = disputa
    ? `Pesquisas — ${disputa}${turno ? ` · ${turno}º turno` : ""}`
    : "Pesquisas Eleitorais — Geral";
  const subtitulo = `2026 · ${pesquisas.length} pesquisas registradas`;

  return pdfResponse(
    <RelatorioPesquisas titulo={titulo} subtitulo={subtitulo} grupos={grupos} />,
    nomeArquivo("pesquisas", disputa || "geral", turno ? `${turno}turno` : "")
  );
}
