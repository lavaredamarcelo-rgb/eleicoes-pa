import Link from "next/link";
import brMapa from "@/data/br-mapa.json";
import { AutoRefresh } from "@/components/AutoRefresh";
import { MapaVotos } from "@/components/MapaVotos";
import { prisma } from "@/lib/prisma";

// PANORAMA 1º × 2º TURNO (Presidente): placar nacional dos dois turnos
// lado a lado, UF a UF (quem mudou de lado, onde cada um cresceu) e o
// recorte do Pará com comparecimento. O lado do 2º turno preenche
// sozinho no dia 25/10, conforme a totalização avança.
const BASE = "https://resultados.tse.jus.br/oficial";
const ELEICAO: Record<number, string> = { 1: "6257", 2: "6258" };

type UFDados = {
  uf: string;
  lula: number;
  flavio: number;
  aptos: number;
  compareceram: number;
  pst: string | null;
};

const ehLula = (n: string) => /LULA/i.test(n);
const ehFlavio = (n: string) =>
  /FLAVIO/i.test(n.normalize("NFD").replace(/[̀-ͯ]/g, ""));

async function buscarUF(uf: string, turno: number): Promise<UFDados | null> {
  const eleicao = ELEICAO[turno];
  const cod = eleicao.padStart(6, "0");
  try {
    const resp = await fetch(
      `${BASE}/ele2026/${eleicao}/dados/${uf}/${uf}-c0001-e${cod}-u.json`,
      { next: { revalidate: turno === 2 ? 120 : 3600 } }
    );
    if (!resp.ok) return null;
    const d = (await resp.json()) as {
      s?: { pst?: string };
      e?: { te?: string };
      v?: { tv?: string };
      carg?: { agr?: { par?: { cand?: Record<string, string>[] }[] }[] }[];
    };
    let lula = 0;
    let flavio = 0;
    for (const agr of d.carg?.[0]?.agr ?? []) {
      for (const par of agr.par ?? []) {
        for (const c of par.cand ?? []) {
          const nome = (c.nmu || c.nm || "") as string;
          const v = Number(c.vap) || 0;
          if (ehLula(nome)) lula += v;
          else if (ehFlavio(nome)) flavio += v;
        }
      }
    }
    return {
      uf: uf.toUpperCase(),
      lula,
      flavio,
      aptos: Number(d.e?.te) || 0,
      compareceram: Number(d.v?.tv) || 0,
      pst: d.s?.pst ?? null,
    };
  } catch {
    return null;
  }
}

const f = (n: number) => n.toLocaleString("pt-BR");
const pct = (a: number, b: number) => (a + b > 0 ? ((a / (a + b)) * 100).toFixed(2) : "—");

export default async function TurnosPage() {
  const ufs = brMapa.ufs.map((u) => u.uf.toLowerCase());
  const alvos = ["br", "pa", ...ufs];
  const [t1, t2] = await Promise.all([
    Promise.all(alvos.map((uf) => buscarUF(uf, 1))),
    Promise.all(alvos.map((uf) => buscarUF(uf, 2))),
  ]);
  const mapa1 = new Map(t1.filter(Boolean).map((r) => [r!.uf, r!]));
  const mapa2 = new Map(t2.filter(Boolean).map((r) => [r!.uf, r!]));

  const br1 = mapa1.get("BR");
  const br2 = mapa2.get("BR");
  const pa1 = mapa1.get("PA");
  const pa2 = mapa2.get("PA");
  const tem2T = Boolean(br2 && br2.lula + br2.flavio > 0);

  const linhasUF = ufs
    .map((uf) => {
      const a = mapa1.get(uf.toUpperCase());
      const b = mapa2.get(uf.toUpperCase());
      if (!a) return null;
      const liderA = a.lula > a.flavio ? "L" : a.flavio > a.lula ? "F" : "=";
      const liderB = b && b.lula + b.flavio > 0 ? (b.lula > b.flavio ? "L" : b.flavio > b.lula ? "F" : "=") : null;
      return { uf: a.uf, a, b, liderA, liderB, virou: liderB != null && liderA !== liderB };
    })
    .filter((x): x is NonNullable<typeof x> => x != null)
    .sort((x, y) => (y.a.lula + y.a.flavio) - (x.a.lula + x.a.flavio));

  const viradas = linhasUF.filter((l) => l.virou);

  return (
    <div className="flex flex-col gap-5">
      <AutoRefresh segundos={120} />
      <div>
        <p className="text-xs text-neutral-500">
          <Link href="/comparativos" className="hover:text-amber-400">
            Comparativos
          </Link>{" "}
          / 1º × 2º turno
        </p>
        <h1 className="text-lg font-semibold">Panorama: 1º × 2º turno — Presidente</h1>
        <p className="text-sm text-neutral-500">
          Totalização oficial do TSE. {tem2T
            ? "Os dois turnos lado a lado."
            : "O lado do 2º turno preenche sozinho no dia 25/10, a partir das ~17h30."}
        </p>
      </div>

      {/* Placar nacional */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Placar titulo="1º turno (04/10)" dados={br1} />
        <Placar titulo="2º turno (25/10)" dados={tem2T ? br2 : null} aguardando={!tem2T} />
      </div>

      {viradas.length > 0 && (
        <div className="rounded-xl border border-amber-700 bg-amber-950/40 px-4 py-3">
          <p className="text-sm font-bold text-amber-200">
            🔄 {viradas.length} estado{viradas.length === 1 ? "" : "s"} mudou/mudaram de lado:{" "}
            {viradas.map((v) => v.uf).join(", ")}
          </p>
        </div>
      )}

      {/* Pará em destaque */}
      <section className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-4">
        <h2 className="mb-2 text-sm font-semibold text-amber-300">Pará</h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <LadoPA rotulo="1º turno" d={pa1} />
          <LadoPA rotulo="2º turno" d={tem2T ? pa2 : null} />
        </div>
        {pa1 && pa2 && tem2T && pa1.compareceram > 0 && pa2.compareceram > 0 && (
          <p className="mt-2 text-xs text-neutral-400">
            Comparecimento: {f(pa1.compareceram)} no 1º × {f(pa2.compareceram)} no 2º (
            {pa2.compareceram >= pa1.compareceram ? "+" : ""}
            {f(pa2.compareceram - pa1.compareceram)})
          </p>
        )}
      </section>

      {/* UF a UF */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          UF a UF — % do Lula entre os dois (1º → 2º)
        </h2>
        <div className="flex flex-col gap-0.5">
          {linhasUF.map((l) => {
            const pA = Number(pct(l.a.lula, l.a.flavio));
            const pB = l.b && l.b.lula + l.b.flavio > 0 ? Number(pct(l.b.lula, l.b.flavio)) : null;
            return (
              <div
                key={l.uf}
                className={`flex flex-wrap items-center justify-between gap-x-3 rounded px-2 py-1 text-xs ${
                  l.virou ? "bg-amber-950/40" : "odd:bg-neutral-950/50"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-7 font-semibold text-neutral-200">{l.uf}</span>
                  <span className={l.liderA === "L" ? "text-red-400" : "text-blue-400"}>
                    1º: {l.liderA === "L" ? "Lula" : "Flávio"} {pA.toFixed(1)}%
                  </span>
                  {pB != null && (
                    <span className={l.liderB === "L" ? "text-red-400" : "text-blue-400"}>
                      → 2º: {l.liderB === "L" ? "Lula" : "Flávio"} {pB.toFixed(1)}%
                    </span>
                  )}
                  {l.virou && (
                    <span className="rounded-full bg-amber-900 px-1.5 py-px text-[9px] font-bold text-amber-200">
                      VIROU
                    </span>
                  )}
                </span>
                {pB != null && (
                  <span className={`tabular-nums font-semibold ${pB - pA >= 0 ? "text-red-400" : "text-blue-400"}`}>
                    Lula {pB - pA >= 0 ? "+" : ""}
                    {(pB - pA).toFixed(1)}pp
                  </span>
                )}
              </div>
            );
          })}
        </div>
        <p className="mt-2 text-[11px] text-neutral-600">
          Percentuais calculados só entre os dois candidatos. Linhas âmbar = estado que mudou de
          lado entre os turnos.
        </p>
      </section>

      <SecaoParaPorMunicipio />

      <p className="text-[11px] text-neutral-600">
        Após o 2º turno, o detalhamento do Pará por município e bairro entra no sistema (como no
        1º turno) — aí o comparativo municipal completo fica disponível aqui.
      </p>
    </div>
  );
}

function Placar({ titulo, dados, aguardando }: { titulo: string; dados: UFDados | null | undefined; aguardando?: boolean }) {
  if (!dados || aguardando) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-4 py-3">
        <p className="text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
        <p className="mt-1 text-sm text-neutral-500">Aguardando a totalização…</p>
      </div>
    );
  }
  const total = dados.lula + dados.flavio;
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
      <p className="mt-1 text-lg font-bold">
        <span className="text-red-400">Lula {pct(dados.lula, dados.flavio)}%</span>
        <span className="mx-2 text-neutral-600">×</span>
        <span className="text-blue-400">{pct(dados.flavio, dados.lula)}% Flávio</span>
      </p>
      <p className="text-xs text-neutral-500">
        {f(total)} votos entre os dois{dados.pst ? ` · ${dados.pst}% das seções` : ""}
      </p>
    </div>
  );
}

function LadoPA({ rotulo, d }: { rotulo: string; d: UFDados | null | undefined }) {
  if (!d || d.lula + d.flavio === 0) {
    return (
      <div className="rounded-lg border border-dashed border-neutral-700 px-3 py-2 text-xs text-neutral-500">
        {rotulo}: aguardando…
      </div>
    );
  }
  return (
    <div className="rounded-lg bg-neutral-950/60 px-3 py-2 text-sm">
      <p className="text-[10px] uppercase tracking-wide text-neutral-500">{rotulo}</p>
      <p>
        <span className="text-red-400 font-semibold">Lula {pct(d.lula, d.flavio)}%</span>
        <span className="mx-1.5 text-neutral-600">×</span>
        <span className="text-blue-400 font-semibold">{pct(d.flavio, d.lula)}% Flávio</span>
      </p>
      <p className="text-[11px] text-neutral-500">
        {f(d.lula)} × {f(d.flavio)} votos
        {d.aptos > 0 ? ` · comparecimento ${((d.compareceram / d.aptos) * 100).toFixed(1)}%` : ""}
      </p>
    </div>
  );
}

// Pará por município (banco local): quem venceu o 2º turno em cada
// cidade, as viradas entre turnos e os maiores avanços de cada lado.
async function SecaoParaPorMunicipio() {
  const resultados = await prisma.resultado.findMany({
    where: {
      id: { startsWith: "r26p-" },
      candidato: { numero: { in: [13, 22] } },
    },
    include: {
      candidato: { select: { numero: true } },
      municipio: { select: { nome: true, codigoIbge: true } },
    },
  });
  if (resultados.length === 0) return null;

  const porMun = new Map<
    string,
    { nome: string; codigoIbge: string | null; l1: number; f1: number; l2: number; f2: number }
  >();
  for (const r of resultados) {
    const m = porMun.get(r.municipio.nome) ?? {
      nome: r.municipio.nome,
      codigoIbge: r.municipio.codigoIbge,
      l1: 0, f1: 0, l2: 0, f2: 0,
    };
    const chave = (r.candidato.numero === 13 ? "l" : "f") + r.turno;
    (m as unknown as Record<string, number>)[chave] += r.votos;
    porMun.set(r.municipio.nome, m);
  }
  const linhas = [...porMun.values()].filter((m) => m.l2 + m.f2 > 0);
  if (linhas.length === 0) return null;

  const lulaGanhou = linhas.filter((m) => m.l2 > m.f2).length;
  const viradas = linhas
    .filter((m) => (m.l1 > m.f1) !== (m.l2 > m.f2))
    .map((m) => ({ ...m, para: m.l2 > m.f2 ? "Lula" : "Flávio" }));
  const deltas = linhas
    .map((m) => ({
      ...m,
      d: (m.l2 / Math.max(m.l2 + m.f2, 1) - m.l1 / Math.max(m.l1 + m.f1, 1)) * 100,
    }))
    .sort((a, b) => b.d - a.d);

  return (
    <section className="rounded-xl border border-amber-900/50 bg-amber-950/10 p-4">
      <h2 className="mb-1 text-sm font-semibold text-amber-300">
        Pará por município — 2º turno
      </h2>
      <p className="mb-2 text-xs text-neutral-400">
        <span className="font-semibold text-red-400">Lula venceu em {lulaGanhou}</span> ·{" "}
        <span className="font-semibold text-blue-400">
          Flávio em {linhas.length - lulaGanhou}
        </span>
        {viradas.length > 0 &&
          ` · ${viradas.length} município${viradas.length === 1 ? "" : "s"} viraram entre os turnos`}
      </p>
      <MapaVotos
        cores={Object.fromEntries(
          linhas
            .filter((m) => m.codigoIbge)
            .map((m) => {
              const tot = m.l2 + m.f2;
              const marg = tot > 0 ? Math.abs(m.l2 - m.f2) / tot : 0;
              const op = (0.45 + Math.min(marg * 2.5, 0.55)).toFixed(2);
              return [
                m.codigoIbge!,
                m.l2 > m.f2 ? `rgba(239, 68, 68, ${op})` : `rgba(59, 130, 246, ${op})`,
              ];
            })
        )}
        titulos={Object.fromEntries(
          linhas
            .filter((m) => m.codigoIbge)
            .map((m) => [
              m.codigoIbge!,
              `${m.nome} 2º turno: Lula ${m.l2.toLocaleString("pt-BR")} × ${m.f2.toLocaleString("pt-BR")} Flávio (1º: ${m.l1.toLocaleString("pt-BR")} × ${m.f1.toLocaleString("pt-BR")})`,
            ])
        )}
      />
      {viradas.length > 0 && (
        <p className="mt-2 text-xs text-neutral-300">
          <span className="font-semibold text-amber-300">Viraram:</span>{" "}
          {viradas.map((v) => `${v.nome} (→ ${v.para})`).join(", ")}
        </p>
      )}
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 text-xs">
        <div>
          <p className="font-semibold text-red-400">Lula mais cresceu (1º→2º, pp):</p>
          {deltas.slice(0, 5).map((m) => (
            <p key={m.nome} className="text-neutral-400">
              {m.nome}: +{m.d.toFixed(1)}pp
            </p>
          ))}
        </div>
        <div>
          <p className="font-semibold text-blue-400">Flávio mais cresceu (1º→2º, pp):</p>
          {deltas.slice(-5).reverse().map((m) => (
            <p key={m.nome} className="text-neutral-400">
              {m.nome}: +{(-m.d).toFixed(1)}pp
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
