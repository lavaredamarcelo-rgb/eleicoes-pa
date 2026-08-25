import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

const DISPUTAS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Presidente",
];

const CORES = [
  "#f59e0b",
  "#3b82f6",
  "#10b981",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#14b8a6",
  "#f97316",
  "#84cc16",
  "#6366f1",
];

const NAO_CANDIDATO =
  /brancos?|nulos?|n[aã]o sabe|n[aã]o respondeu|nenhum|indecisos?|ns\/nr|^outros?$/i;

export default async function EvolucaoPage({
  searchParams,
}: {
  searchParams: Promise<{ disputa?: string; turno?: string }>;
}) {
  await verifySession();
  const sp = await searchParams;
  const disputa = sp.disputa || "Governador";
  const turno = Number(sp.turno) || 1;

  const pesquisas = await prisma.pesquisaEleitoral.findMany({
    where: { disputa, turno, tipo: "estimulada" },
    include: { resultados: true },
    orderBy: { dataDivulgacao: "asc" },
  });

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      timeZone: "UTC",
    });

  // Séries por candidato (exclui brancos/nulos/não sabe do gráfico)
  const nomes: string[] = [];
  for (const p of pesquisas) {
    for (const r of p.resultados) {
      const n = r.nome.trim();
      if (!NAO_CANDIDATO.test(n) && !nomes.includes(n)) nomes.push(n);
    }
  }
  const series = nomes.map((nome, i) => ({
    nome,
    cor: CORES[i % CORES.length],
    pontos: pesquisas.map((p) => {
      const r = p.resultados.find((x) => x.nome.trim() === nome);
      return r ? r.percentual : null;
    }),
  }));

  // Geometria do gráfico
  const W = 820;
  const H = 340;
  const ML = 44;
  const MR = 16;
  const MT = 16;
  const MB = 36;
  const maxPct = Math.max(
    10,
    ...series.flatMap((s) => s.pontos.filter((v): v is number => v != null))
  );
  const yMax = Math.min(100, Math.ceil((maxPct + 8) / 10) * 10);
  const n = pesquisas.length;
  const x = (i: number) =>
    n <= 1 ? ML + (W - ML - MR) / 2 : ML + (i * (W - ML - MR)) / (n - 1);
  const y = (v: number) => MT + (H - MT - MB) * (1 - v / yMax);

  // Comparativo: duas últimas pesquisas
  const ultima = pesquisas[pesquisas.length - 1];
  const anterior = pesquisas[pesquisas.length - 2];
  const margem = ultima?.margemErro ?? null;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Evolução das pesquisas</h1>
          <p className="text-sm text-neutral-500">
            Pesquisas estimuladas, em ordem de divulgação.{" "}
            <Link href="/pesquisas" className="text-amber-400 hover:underline">
              ← Ver lista
            </Link>
          </p>
        </div>
        <PdfDownloadLink
          href={`/api/pdf/pesquisas?disputa=${encodeURIComponent(disputa)}&turno=${turno}`}
          label={`PDF · ${disputa} ${turno}º turno`}
        />
      </div>

      <div className="flex flex-wrap gap-2">
        {DISPUTAS.map((d) => (
          <Link
            key={d}
            href={`/pesquisas/evolucao?disputa=${encodeURIComponent(d)}&turno=${turno}`}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              disputa === d
                ? "bg-amber-500 font-semibold text-neutral-950"
                : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"
            }`}
          >
            {d}
          </Link>
        ))}
        <span className="mx-1 border-l border-neutral-800" />
        {[1, 2].map((t) => (
          <Link
            key={t}
            href={`/pesquisas/evolucao?disputa=${encodeURIComponent(disputa)}&turno=${t}`}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              turno === t
                ? "bg-amber-500 font-semibold text-neutral-950"
                : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"
            }`}
          >
            {t}º turno
          </Link>
        ))}
      </div>

      {pesquisas.length === 0 ? (
        <div className="rounded-lg border border-neutral-800 py-12 text-center text-sm text-neutral-500">
          Nenhuma pesquisa estimulada registrada para {disputa} ({turno}º turno).
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950 p-4">
            <svg
              viewBox={`0 0 ${W} ${H}`}
              className="min-w-[640px]"
              role="img"
              aria-label={`Evolução das pesquisas: ${disputa}`}
            >
              {Array.from({ length: yMax / 10 + 1 }, (_, i) => i * 10).map(
                (v) => (
                  <g key={v}>
                    <line
                      x1={ML}
                      x2={W - MR}
                      y1={y(v)}
                      y2={y(v)}
                      stroke="#262626"
                      strokeWidth={1}
                    />
                    <text
                      x={ML - 8}
                      y={y(v) + 4}
                      textAnchor="end"
                      fontSize={11}
                      fill="#737373"
                    >
                      {v}%
                    </text>
                  </g>
                )
              )}
              {pesquisas.map((p, i) => (
                <text
                  key={p.id}
                  x={x(i)}
                  y={H - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#a3a3a3"
                >
                  {fmt(p.dataDivulgacao)}
                </text>
              ))}
              {series.map((s) => {
                const path = s.pontos
                  .map((v, i) =>
                    v == null ? null : `${x(i)},${y(v)}`
                  )
                  .filter(Boolean);
                return (
                  <g key={s.nome}>
                    {path.length > 1 && (
                      <polyline
                        points={path.join(" ")}
                        fill="none"
                        stroke={s.cor}
                        strokeWidth={2.5}
                        strokeLinejoin="round"
                      />
                    )}
                    {s.pontos.map((v, i) =>
                      v == null ? null : (
                        <g key={i}>
                          <circle cx={x(i)} cy={y(v)} r={4} fill={s.cor} />
                          <text
                            x={x(i)}
                            y={y(v) - 9}
                            textAnchor="middle"
                            fontSize={11}
                            fontWeight={600}
                            fill={s.cor}
                          >
                            {v.toLocaleString("pt-BR")}
                          </text>
                        </g>
                      )
                    )}
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex flex-wrap gap-3">
            {series.map((s) => (
              <span
                key={s.nome}
                className="flex items-center gap-1.5 text-xs text-neutral-300"
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: s.cor }}
                />
                {s.nome}
              </span>
            ))}
          </div>

          {ultima && anterior && (
            <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
              <h2 className="text-sm font-semibold text-neutral-100">
                Última variação — {ultima.instituto} ({fmt(ultima.dataDivulgacao)})
                vs {anterior.instituto} ({fmt(anterior.dataDivulgacao)})
              </h2>
              {margem != null && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  Margem de erro da última pesquisa: ±{margem} p.p. — variações
                  dentro da margem são empate técnico.
                </p>
              )}
              <div className="mt-3 flex flex-col gap-1.5">
                {ultima.resultados
                  .filter((r) => !NAO_CANDIDATO.test(r.nome))
                  .sort((a, b) => b.percentual - a.percentual)
                  .map((r) => {
                    const ant = anterior.resultados.find(
                      (a) => a.nome.trim() === r.nome.trim()
                    );
                    const delta = ant ? r.percentual - ant.percentual : null;
                    const dentroDaMargem =
                      delta != null && margem != null && Math.abs(delta) <= margem;
                    return (
                      <div
                        key={r.id}
                        className="flex flex-wrap items-center gap-2 text-sm"
                      >
                        <span className="w-44 truncate font-medium text-neutral-200">
                          {r.nome}
                        </span>
                        <span className="tabular-nums text-neutral-400">
                          {ant ? `${ant.percentual.toLocaleString("pt-BR")}% → ` : "novo: "}
                          <span className="font-semibold text-neutral-100">
                            {r.percentual.toLocaleString("pt-BR")}%
                          </span>
                        </span>
                        {delta != null && (
                          <span
                            className={`flex items-center gap-1 text-xs font-medium ${
                              delta > 0
                                ? "text-emerald-400"
                                : delta < 0
                                  ? "text-red-400"
                                  : "text-neutral-500"
                            }`}
                          >
                            {delta > 0 ? (
                              <TrendingUp size={13} />
                            ) : delta < 0 ? (
                              <TrendingDown size={13} />
                            ) : (
                              <Minus size={13} />
                            )}
                            {delta > 0 ? "+" : ""}
                            {delta.toLocaleString("pt-BR", {
                              maximumFractionDigits: 1,
                            })}{" "}
                            p.p.
                          </span>
                        )}
                        {dentroDaMargem && (
                          <span className="rounded bg-neutral-900 px-1.5 py-0.5 text-[10px] text-neutral-500">
                            dentro da margem
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
