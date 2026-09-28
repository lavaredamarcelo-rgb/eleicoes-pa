import "server-only";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// RADAR DA APURAÇÃO — lê os resultados oficiais do TSE em tempo real no dia
// da eleição, com descoberta automática dos códigos do pleito, e oferece um
// MODO SIMULADO que reproduz uma noite de apuração usando os resultados
// reais de 2022 do nosso próprio banco (o TSE tira os ciclos antigos do ar).
//
// Endpoints TSE (público, sem autenticação — confirmado em 28/09/2026):
//   config:  https://resultados.tse.jus.br/oficial/comum/config/ele-c.json
//   dados:   https://resultados.tse.jus.br/oficial/ele2026/<cd>/dados-simplificados/pa/pa-c<cargo>-e<cd6>-r.json
//   cargos:  c0001 Presidente · c0003 Governador · c0005 Senador ·
//            c0006 Dep. Federal · c0007 Dep. Estadual
// ---------------------------------------------------------------------------

export type CandidatoRadar = {
  numero: number;
  nome: string;
  votos: number;
  pct: number; // % dos votos válidos
  situacaoTSE: string | null;
};

export type SnapshotRadar = {
  cargo: string;
  pctApurado: number; // % de seções totalizadas
  atualizadoEm: string;
  candidatos: CandidatoRadar[];
  totalVotos: number;
  fonte: "tse" | "simulado" | "aguardando";
  mensagem?: string;
};

const CARGO_TSE: Record<string, string> = {
  presidente: "0001",
  governador: "0003",
  senador: "0005",
  "dep-federal": "0006",
  "dep-estadual": "0007",
};

const CARGO_2022: Record<string, string> = {
  governador: "Governador",
  senador: "Senador",
  "dep-federal": "Deputado Federal",
  "dep-estadual": "Deputado Estadual",
};

// --- Descoberta dos códigos do pleito de 04/10/2026 -------------------------
let configCache: { quando: number; cdEleicao: string | null } = {
  quando: 0,
  cdEleicao: null,
};

export async function descobrirEleicao2026(): Promise<string | null> {
  // Cache de 10 minutos — o arquivo muda raramente.
  if (Date.now() - configCache.quando < 10 * 60 * 1000) return configCache.cdEleicao;
  try {
    const resp = await fetch(
      "https://resultados.tse.jus.br/oficial/comum/config/ele-c.json",
      { cache: "no-store", signal: AbortSignal.timeout(10000) }
    );
    if (!resp.ok) throw new Error(String(resp.status));
    const cfg = (await resp.json()) as {
      pl?: { dt?: string; e?: { cd: string; nm?: string; tp?: string }[] }[];
    };
    let cd: string | null = null;
    for (const pl of cfg.pl ?? []) {
      if (pl.dt !== "04/10/2026") continue;
      // Eleição ordinária (federal/estadual) do pleito de outubro.
      const ord = (pl.e ?? []).find((e) => /ordin/i.test(e.nm ?? "")) ?? (pl.e ?? [])[0];
      if (ord) cd = ord.cd;
    }
    configCache = { quando: Date.now(), cdEleicao: cd };
    return cd;
  } catch {
    configCache = { quando: Date.now() - 9 * 60 * 1000, cdEleicao: configCache.cdEleicao };
    return configCache.cdEleicao;
  }
}

// --- Leitura dos dados simplificados do TSE ---------------------------------
const numPt = (s: unknown) =>
  typeof s === "number" ? s : Number(String(s ?? "0").replace(/\./g, "").replace(",", "."));

export async function lerTSE(cargoChave: string): Promise<SnapshotRadar> {
  const cargoCod = CARGO_TSE[cargoChave];
  const cd = await descobrirEleicao2026();
  if (!cd || !cargoCod) {
    return {
      cargo: cargoChave,
      pctApurado: 0,
      atualizadoEm: new Date().toISOString(),
      candidatos: [],
      totalVotos: 0,
      fonte: "aguardando",
      mensagem: cd
        ? "Cargo inválido."
        : "O TSE ainda não publicou os códigos do pleito de 04/10 — o Radar se conecta sozinho assim que publicarem (verificação automática a cada 10 min).",
    };
  }
  const cd6 = cd.padStart(6, "0");
  const url = `https://resultados.tse.jus.br/oficial/ele2026/${cd}/dados-simplificados/pa/pa-c${cargoCod}-e${cd6}-r.json`;
  try {
    const resp = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!resp.ok) throw new Error(String(resp.status));
    const d = (await resp.json()) as {
      pst?: string;
      ht?: string;
      cand?: { n?: string; nm?: string; vap?: string; pvap?: string; st?: string }[];
    };
    const candidatos: CandidatoRadar[] = (d.cand ?? [])
      .map((c) => ({
        numero: Number(c.n ?? 0),
        nome: String(c.nm ?? "?"),
        votos: Math.round(numPt(c.vap)),
        pct: numPt(c.pvap),
        situacaoTSE: c.st || null,
      }))
      .sort((a, b) => b.votos - a.votos);
    return {
      cargo: cargoChave,
      pctApurado: numPt(d.pst),
      atualizadoEm: new Date().toISOString(),
      candidatos,
      totalVotos: candidatos.reduce((s, c) => s + c.votos, 0),
      fonte: "tse",
    };
  } catch (e) {
    return {
      cargo: cargoChave,
      pctApurado: 0,
      atualizadoEm: new Date().toISOString(),
      candidatos: [],
      totalVotos: 0,
      fonte: "aguardando",
      mensagem: `Arquivo do TSE ainda indisponível (${e instanceof Error ? e.message : "erro"}) — normal antes de a totalização começar (~17h30 de 04/10).`,
    };
  }
}

// --- Simulado: reproduz uma apuração com os dados reais de 2022 -------------
// t = progresso de 0 a 100 (o cliente controla pelo relógio). A cada passo,
// cada candidato tem uma fração apurada própria (municípios chegam em ordens
// diferentes), que converge para o resultado final quando t = 100.
function ruido(seed: number) {
  // Determinístico: mesmo candidato + mesmo passo => mesmo valor.
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x); // 0..1
}

export async function gerarSimulado(cargoChave: string, t: number): Promise<SnapshotRadar> {
  const cargoNome = CARGO_2022[cargoChave];
  if (!cargoNome) {
    return {
      cargo: cargoChave,
      pctApurado: 0,
      atualizadoEm: new Date().toISOString(),
      candidatos: [],
      totalVotos: 0,
      fonte: "simulado",
      mensagem: "Simulado disponível para Governador, Senador e Deputados (base 2022).",
    };
  }
  const prog = Math.max(0, Math.min(100, t));
  const passo = Math.floor(prog / 4); // muda o "sorteio" a cada ~4%

  const linhas = await prisma.$queryRawUnsafe<
    { nome: string; numero: number; eleito: number; votos: number }[]
  >(
    `SELECT c.nome AS nome, c.numero AS numero, c.eleito AS eleito,
            COALESCE(SUM(r.votos), 0) AS votos
     FROM "Candidato" c
     JOIN "Cargo" ca ON ca.id = c."cargoId"
     JOIN "Eleicao" e ON e.id = ca."eleicaoId"
     LEFT JOIN "Resultado" r ON r."candidatoId" = c.id AND r.turno = 1
     WHERE ca.nome = '${cargoNome.replace(/'/g, "''")}' AND e.ano = 2022 AND ca."municipioId" IS NULL
     GROUP BY c.id HAVING votos > 0`
  );

  const candidatos: CandidatoRadar[] = linhas
    .map((l) => {
      // Fração apurada deste candidato neste passo: centrada no progresso
      // geral, com dispersão que desaparece no fim (municípios diferentes).
      const disp = (ruido(l.numero * 131 + passo * 17) - 0.5) * 0.35 * (1 - prog / 100);
      const fracao = Math.max(0, Math.min(1, prog / 100 + disp));
      return {
        numero: l.numero,
        nome: l.nome,
        votos: Math.round(Number(l.votos) * fracao),
        pct: 0,
        situacaoTSE: prog >= 100 && Number(l.eleito) ? "Eleito" : null,
      };
    })
    .sort((a, b) => b.votos - a.votos);
  const total = candidatos.reduce((s, c) => s + c.votos, 0);
  for (const c of candidatos) c.pct = total > 0 ? (c.votos / total) * 100 : 0;

  return {
    cargo: cargoChave,
    pctApurado: prog,
    atualizadoEm: new Date().toISOString(),
    candidatos,
    totalVotos: total,
    fonte: "simulado",
    mensagem: "SIMULADO com os resultados reais de 2022 — ensaio para o dia 04/10.",
  };
}
