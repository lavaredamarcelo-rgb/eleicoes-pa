import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Proxy para a API oficial de resultados do TSE (resultados.tse.jus.br),
// usada pelo painel "Apuração ao vivo". No dia da eleição esses arquivos
// são atualizados minuto a minuto; fora dele, servem a totalização final.
const BASE = "https://resultados.tse.jus.br/oficial";

// DS_CARGO interno -> código de cargo da API de resultados.
export const CODIGO_CARGO: Record<string, string> = {
  Prefeito: "0011",
  Vereador: "0013",
  Governador: "0003",
  Senador: "0005",
  "Deputado Federal": "0006",
  "Deputado Estadual": "0007",
};

async function buscarJson(url: string) {
  const resp = await fetch(url, { cache: "no-store" });
  if (!resp.ok) return null;
  return resp.json();
}

type CandidatoApuracao = {
  numero: string;
  nome: string | null;
  partido: string | null;
  votos: number;
  percentual: string;
  eleito: boolean;
  situacao: string;
};

function extrairCandidatos(dados: unknown): { candidatos: CandidatoApuracao[]; meta: Record<string, unknown> } {
  const d = dados as Record<string, unknown>;
  const candidatos: CandidatoApuracao[] = [];
  const meta: Record<string, unknown> = { dg: d.dg, hg: d.hg, turno: d.t };

  // Formato municipal (-u.json): carg[].agr[].par[].cand[]
  const carg = d.carg as { agr?: { par?: { sg?: string; cand?: Record<string, string>[] }[] }[] }[] | undefined;
  if (carg?.[0]?.agr) {
    for (const agr of carg[0].agr) {
      for (const par of agr.par ?? []) {
        for (const c of par.cand ?? []) {
          candidatos.push({
            numero: c.n,
            nome: c.nmu || c.nm || null,
            partido: par.sg ?? null,
            votos: Number(c.vap) || 0,
            percentual: c.pvap ?? "",
            eleito: c.e === "s" || c.e === "S",
            situacao: c.st ?? "",
          });
        }
      }
    }
  }

  // Formato estadual (-v.json): abr[].cand[] (sem nomes)
  const abr = d.abr as ({ cand?: Record<string, string>[] } & Record<string, unknown>)[] | undefined;
  if (candidatos.length === 0 && abr?.[0]?.cand) {
    meta.secoesTotalizadas = abr[0].pst;
    for (const c of abr[0].cand) {
      candidatos.push({
        numero: c.n,
        nome: null,
        partido: null,
        votos: Number(c.vap) || 0,
        percentual: c.pvap ?? "",
        eleito: c.e === "s" || c.e === "S",
        situacao: c.st ?? "",
      });
    }
  }

  candidatos.sort((a, b) => b.votos - a.votos);
  return { candidatos, meta };
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;

  if (sp.get("tipo") === "eleicoes") {
    const idx = (await buscarJson(`${BASE}/comum/config/ele-c.json`)) as {
      pl?: { dt?: string; e?: { cd: string; nm: string; t?: string }[] }[];
    } | null;
    if (!idx) return NextResponse.json({ erro: "Índice do TSE indisponível." }, { status: 502 });
    const eleicoes = (idx.pl ?? [])
      .flatMap((pl) => (pl.e ?? []).map((e) => ({ cd: e.cd, nome: e.nm, data: pl.dt ?? "" })))
      .reverse();
    return NextResponse.json({ eleicoes });
  }

  const eleicao = sp.get("eleicao");
  const cargo = sp.get("cargo");
  const mun = sp.get("mun"); // codigoTse do município ou "estado"
  const ano = sp.get("ano");
  if (!eleicao || !cargo) {
    return NextResponse.json({ erro: "Parâmetros: eleicao, cargo, mun." }, { status: 400 });
  }

  const cod = eleicao.padStart(6, "0");
  const abrangencia = mun && mun !== "estado" ? `pa${mun.padStart(5, "0")}` : "pa";
  const urls = [
    `${BASE}/ele${anoDoCodigo(eleicao, ano)}/${eleicao}/dados/pa/${abrangencia}-c${cargo}-e${cod}-u.json`,
    `${BASE}/ele${anoDoCodigo(eleicao, ano)}/${eleicao}/dados/pa/${abrangencia}-c${cargo}-e${cod}-v.json`,
  ];

  for (const url of urls) {
    const dados = await buscarJson(url);
    if (!dados) continue;
    const { candidatos, meta } = extrairCandidatos(dados);

    // Enriquecimento: a API estadual não traz nomes; cruzamos com os
    // candidatos já importados (cargo + número) quando o ano existir aqui.
    if (ano && candidatos.some((c) => !c.nome)) {
      const nomeCargo = Object.entries(CODIGO_CARGO).find(([, v]) => v === cargo)?.[0];
      if (nomeCargo) {
        const doBanco = await prisma.candidato.findMany({
          where: { cargo: { nome: nomeCargo, eleicao: { ano: Number(ano) } } },
          include: { partido: true },
        });
        const porNumero = new Map(doBanco.map((c) => [String(c.numero), c]));
        for (const c of candidatos) {
          const b = porNumero.get(c.numero);
          if (b) {
            c.nome = c.nome ?? b.nome;
            c.partido = c.partido ?? b.partido.sigla;
          }
        }
      }
    }

    return NextResponse.json({ candidatos, meta, fonte: url });
  }

  return NextResponse.json(
    { erro: "O TSE ainda não publicou resultados para essa combinação." },
    { status: 404 }
  );
}

// O ciclo na URL (ele2022/ele2024/...) acompanha o ano da eleição; o
// chamador informa o ano do pleito escolhido no índice.
function anoDoCodigo(_cd: string, ano: string | null) {
  return ano ?? "2024";
}
