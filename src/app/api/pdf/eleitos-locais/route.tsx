import { NextRequest } from "next/server";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";
import { RelatorioEleitosLocais } from "@/lib/pdf/RelatorioEleitosLocais";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF: todos os eleitos de um ano com os votos deles em UM município,
// detalhados por bairro (e escola a escola quando o volume permite).
// ?ano=2026&municipio=<id>
const ORDEM_CARGOS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Prefeito",
  "Vereador",
];
const LIMITE_ESCOLAS = 6000;

export async function GET(req: NextRequest) {
  await verifySession();
  const ano = Number(req.nextUrl.searchParams.get("ano") ?? "2026");
  const municipioId = req.nextUrl.searchParams.get("municipio");
  if (!municipioId || !Number.isFinite(ano)) notFound();

  const municipio = await prisma.municipio.findUnique({
    where: { id: municipioId },
    select: { id: true, nome: true },
  });
  if (!municipio) notFound();

  // Cargos ESTADUAIS (municipioId null: Gov/Sen/Deputados) e os
  // MUNICIPAIS do próprio município (Prefeito/Vereador) — assim o mesmo
  // relatório serve para 2026 e para os anos municipais (2024, 2020…).
  const eleitos = await prisma.candidato.findMany({
    where: {
      eleito: true,
      cargo: {
        eleicao: { ano },
        OR: [{ municipioId: null }, { municipioId }],
      },
    },
    include: {
      partido: true,
      cargo: true,
      resultados: true,
      votosLocais: {
        where: { turno: 1, colegioEleitoral: { municipioId } },
        include: { colegioEleitoral: { select: { nome: true, bairro: true } } },
      },
    },
  });

  const totalLinhasLocais = eleitos.reduce((s, e) => s + e.votosLocais.length, 0);
  const incluiEscolas = totalLinhasLocais > 0 && totalLinhasLocais <= LIMITE_ESCOLAS;

  const porCargo = new Map<string, ReturnType<typeof linha>[]>();
  function linha(e: (typeof eleitos)[number]) {
    const votosMun = e.resultados
      .filter((r) => r.turno === 1 && r.municipioId === municipioId)
      .reduce((s, r) => s + r.votos, 0);
    const bairrosMap = new Map<string, number>();
    for (const v of e.votosLocais) {
      const b = v.colegioEleitoral.bairro?.trim() || "(bairro não informado)";
      bairrosMap.set(b, (bairrosMap.get(b) ?? 0) + v.votos);
    }
    return {
      nome: e.nome,
      partido: e.partido.sigla,
      votosMun,
      totalEstado: votosDecisivos(e.resultados),
      bairros: [...bairrosMap.entries()]
        .map(([nome, votos]) => ({ nome, votos }))
        .sort((x, y) => y.votos - x.votos),
      locais: incluiEscolas
        ? e.votosLocais
            .map((v) => ({
              nome: v.colegioEleitoral.nome,
              bairro: v.colegioEleitoral.bairro,
              votos: v.votos,
            }))
            .sort((x, y) => y.votos - x.votos)
        : undefined,
    };
  }

  for (const e of eleitos) {
    const l = linha(e);
    if (l.votosMun <= 0) continue;
    const lista = porCargo.get(e.cargo.nome) ?? [];
    lista.push(l);
    porCargo.set(e.cargo.nome, lista);
  }

  const cargos = ORDEM_CARGOS.filter((c) => porCargo.has(c)).map((c) => ({
    cargo: c,
    eleitos: porCargo.get(c)!.sort((x, y) => y.votosMun - x.votosMun),
  }));
  if (cargos.length === 0) notFound();

  return pdfResponse(
    <RelatorioEleitosLocais
      municipio={municipio.nome}
      ano={ano}
      cargos={cargos}
      incluiEscolas={incluiEscolas}
    />,
    nomeArquivo("eleitos-locais", `${municipio.nome}-${ano}`)
  );
}
