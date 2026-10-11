import Link from "next/link";
import brMapa from "@/data/br-mapa.json";

// MAPA DO BRASIL · PRESIDENTE: cada UF pintada com a cor de quem venceu
// (Lula vermelho × Flávio azul), direto da totalização oficial do TSE.
// Funciona para o 1º turno (04/10) e, em 25/10, para o 2º turno ao vivo.
const BASE = "https://resultados.tse.jus.br/oficial";
const ELEICAO_TURNO: Record<number, string> = { 1: "6257", 2: "6258" };
const COR_LULA = "#ef4444";
const COR_FLAVIO = "#3b82f6";

type UFResultado = {
  uf: string;
  candidatos: { nome: string; votos: number }[];
  pst: string | null;
};

async function buscarUF(uf: string, eleicao: string): Promise<UFResultado | null> {
  const cod = eleicao.padStart(6, "0");
  const url = `${BASE}/ele2026/${eleicao}/dados/${uf}/${uf}-c0001-e${cod}-u.json`;
  try {
    const resp = await fetch(url, { next: { revalidate: 600 } });
    if (!resp.ok) return null;
    const d = (await resp.json()) as {
      s?: { pst?: string };
      carg?: { agr?: { par?: { cand?: Record<string, string>[] }[] }[] }[];
    };
    const candidatos: { nome: string; votos: number }[] = [];
    for (const agr of d.carg?.[0]?.agr ?? []) {
      for (const par of agr.par ?? []) {
        for (const c of par.cand ?? []) {
          candidatos.push({ nome: (c.nmu || c.nm || c.n) ?? "?", votos: Number(c.vap) || 0 });
        }
      }
    }
    candidatos.sort((a, b) => b.votos - a.votos);
    return { uf: uf.toUpperCase(), candidatos, pst: d.s?.pst ?? null };
  } catch {
    return null;
  }
}

const ehLula = (nome: string) => /LULA/i.test(nome);
const ehFlavio = (nome: string) =>
  /FLAVIO|FLÁVIO/i.test(nome.normalize("NFD").replace(/[̀-ͯ]/g, ""));

export default async function MapaBrasilPage({
  searchParams,
}: {
  searchParams: Promise<{ turno?: string }>;
}) {
  const sp = await searchParams;
  const turno = sp.turno === "2" ? 2 : 1;
  const eleicao = ELEICAO_TURNO[turno];

  const ufs = brMapa.ufs.map((u) => u.uf.toLowerCase());
  const [nacional, ...porUF] = await Promise.all([
    buscarUF("br", eleicao),
    ...ufs.map((uf) => buscarUF(uf, eleicao)),
  ]);

  const resultados = new Map<string, UFResultado>();
  porUF.forEach((r) => {
    if (r) resultados.set(r.uf, r);
  });

  const ufsLula: string[] = [];
  const ufsFlavio: string[] = [];
  const cores: Record<string, string> = {};
  const titulos: Record<string, string> = {};
  for (const [uf, r] of resultados) {
    const lula = r.candidatos.find((c) => ehLula(c.nome))?.votos ?? 0;
    const flavio = r.candidatos.find((c) => ehFlavio(c.nome))?.votos ?? 0;
    const total = lula + flavio;
    const margem = total > 0 ? Math.abs(lula - flavio) / total : 0;
    const op = 0.5 + Math.min(margem * 3, 0.5);
    if (lula > flavio) {
      ufsLula.push(uf);
      cores[uf] = `rgba(239, 68, 68, ${op.toFixed(2)})`;
    } else if (flavio > lula) {
      ufsFlavio.push(uf);
      cores[uf] = `rgba(59, 130, 246, ${op.toFixed(2)})`;
    } else {
      cores[uf] = "#404040";
    }
    titulos[uf] =
      `${uf}: Lula ${lula.toLocaleString("pt-BR")} × ${flavio.toLocaleString("pt-BR")} Flávio` +
      (r.pst ? ` (${r.pst}% das seções)` : "");
  }

  const lulaBR = nacional?.candidatos.find((c) => ehLula(c.nome))?.votos ?? 0;
  const flavioBR = nacional?.candidatos.find((c) => ehFlavio(c.nome))?.votos ?? 0;
  const totalBR = lulaBR + flavioBR;
  const semDados = resultados.size === 0;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-neutral-500">
          <Link href="/comparativos" className="hover:text-amber-400">
            Comparativos
          </Link>{" "}
          / mapa do Brasil
        </p>
        <h1 className="text-lg font-semibold">Presidente — mapa do Brasil por estado</h1>
        <p className="text-sm text-neutral-500">
          Dados oficiais da totalização do TSE · {turno}º turno
          {turno === 2 ? " (25/10 — liga sozinho quando a totalização começar)" : " (04/10)"}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2].map((t) => (
          <Link
            key={t}
            href={`/comparativos/brasil${t === 2 ? "?turno=2" : ""}`}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              turno === t
                ? "bg-amber-400 text-neutral-950"
                : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700"
            }`}
          >
            {t}º turno
          </Link>
        ))}
      </div>

      {semDados && (
        <p className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-6 text-sm text-neutral-400">
          O TSE ainda não publicou a totalização deste turno. No dia 25/10, a partir das ~17h30,
          este mapa pinta sozinho estado a estado.
        </p>
      )}

      {!semDados && (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Card
              titulo="Lula (PT)"
              valor={totalBR > 0 ? `${((lulaBR / totalBR) * 100).toFixed(2)}%` : "—"}
              cor="text-red-400"
              detalhe={`${lulaBR.toLocaleString("pt-BR")} votos · venceu em ${ufsLula.length} UFs`}
            />
            <Card
              titulo="Flávio Bolsonaro (PL)"
              valor={totalBR > 0 ? `${((flavioBR / totalBR) * 100).toFixed(2)}%` : "—"}
              cor="text-blue-400"
              detalhe={`${flavioBR.toLocaleString("pt-BR")} votos · venceu em ${ufsFlavio.length} UFs`}
            />
            <Card
              titulo="Entre os dois"
              valor={totalBR > 0 ? `${Math.abs(((lulaBR - flavioBR) / totalBR) * 100).toFixed(2)} pp` : "—"}
              cor={lulaBR >= flavioBR ? "text-red-400" : "text-blue-400"}
              detalhe={`vantagem de ${lulaBR >= flavioBR ? "Lula" : "Flávio"} no Brasil`}
            />
          </div>

          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <svg viewBox={brMapa.viewBox} className="h-[480px] w-full" role="img" aria-label="Mapa do Brasil">
              {brMapa.ufs.map((u) => (
                <path
                  key={u.uf}
                  d={u.path}
                  fill={cores[u.uf] ?? "#262626"}
                  stroke="#0a0a0a"
                  strokeWidth={1}
                >
                  <title>{titulos[u.uf] ?? u.uf}</title>
                </path>
              ))}
            </svg>
            <p className="mt-1 text-[11px] text-neutral-600">
              <span className="text-red-400">■ Lula</span> ·{" "}
              <span className="text-blue-400">■ Flávio Bolsonaro</span> · cor mais forte =
              vitória mais folgada. Passe o mouse num estado para ver os números (contagem
              sobre os votos dos dois).
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function Card({ titulo, valor, cor, detalhe }: { titulo: string; valor: string; cor: string; detalhe: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
      <p className={`text-xl font-bold ${cor}`}>{valor}</p>
      <p className="text-xs text-neutral-500">{detalhe}</p>
    </div>
  );
}
