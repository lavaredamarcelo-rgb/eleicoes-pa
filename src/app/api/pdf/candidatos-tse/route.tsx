import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { RelatorioCandidatosTSE, type CandidatoTSEPdf } from "@/lib/pdf/RelatorioCandidatosTSE";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";
import candidatosTSE from "@/data/candidatos-tse-2026.json";

const CARGOS = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

export async function GET(req: Request) {
  await verifySession();
  const cargo = new URL(req.url).searchParams.get("cargo") || undefined;
  if (cargo && !CARGOS.includes(cargo)) notFound();

  const candidatos = (candidatosTSE as CandidatoTSEPdf[]).filter(
    (c) => !cargo || c.cargo === cargo
  );
  if (candidatos.length === 0) notFound();

  return pdfResponse(
    <RelatorioCandidatosTSE candidatos={candidatos} cargoFiltro={cargo} />,
    nomeArquivo("candidaturas-tse-2026", cargo || "geral")
  );
}
