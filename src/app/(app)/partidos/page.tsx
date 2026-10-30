import { CardLink } from "@/components/CardLink";
import { GraficoBarras } from "@/components/GraficoBarras";
import { getPartidosComEstatisticas } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function PartidosPage() {
  const partidos = await getPartidosComEstatisticas();
  const fundos = await prisma.partidoFundo.findMany({
    include: { partido: { select: { sigla: true } } },
    orderBy: { valor: "desc" },
  });
  const soFefc = fundos.filter((f) => f.tipo === "FEFC");
  const anoFundo = soFefc.length
    ? Math.max(...soFefc.map((f) => f.ano))
    : null;
  const fefc = soFefc.filter((f) => f.ano === anoFundo);
  const totalFefc = fefc.reduce((s, f) => s + f.valor, 0);
  // Fundo Partidário anual (duodécimos): ano mais recente, com o
  // anterior ao lado para mostrar a variação.
  const soAnual = fundos.filter((f) => f.tipo === "FUNDO_PARTIDARIO");
  const anoAnual = soAnual.length ? Math.max(...soAnual.map((f) => f.ano)) : null;
  const anual = soAnual.filter((f) => f.ano === anoAnual);
  const anualAnterior = new Map(
    soAnual.filter((f) => f.ano === (anoAnual ?? 0) - 1).map((f) => [f.partido.sigla, f.valor])
  );
  const totalAnual = anual.reduce((s, f) => s + f.valor, 0);
  const ultimoAno = partidos[0]?.ultimoAno;
  const top10 = partidos.filter((p) => p.votosUltimaEleicao > 0).slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Partidos Políticos</h1>
        <p className="text-sm text-neutral-500">
          Dados institucionais, lideranças e desempenho eleitoral de cada partido.
        </p>
      </div>

      <GraficoBarras
        titulo={ultimoAno ? `Votos por partido na eleição de ${ultimoAno}` : "Votos por partido"}
        subtitulo="Votos nominais válidos no Pará na eleição mais recente"
        pontos={top10.map((p) => ({ rotulo: p.sigla, valor: p.votosUltimaEleicao }))}
      />

      {fefc.length > 0 && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-sm font-semibold text-neutral-200">
            Fundo eleitoral (FEFC) {anoFundo} — distribuição por partido
          </h2>
          <p className="mb-3 text-xs text-neutral-500">
            Total distribuído: R${" "}
            {(totalFefc / 1e9).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} bilhões ·
            divisão oficial do TSE (critérios da Lei 13.487/2017)
          </p>
          <div className="flex flex-col gap-1">
            {fefc.map((f) => (
              <div key={f.id} className="flex flex-col gap-0.5">
                <div className="flex flex-wrap items-center justify-between gap-x-3 text-xs">
                  <span className="font-medium text-neutral-200">{f.partido.sigla}</span>
                  <span className="tabular-nums text-neutral-400">
                    R$ {(f.valor / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi
                    <span className="ml-2 text-neutral-600">
                      {totalFefc > 0 ? `${((f.valor / totalFefc) * 100).toFixed(1)}%` : ""}
                    </span>
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-1.5 rounded-full bg-emerald-500/80"
                    style={{ width: `${totalFefc > 0 ? (f.valor / (fefc[0]?.valor || 1)) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          {fefc[0]?.fonte && (
            <p className="mt-2 text-[11px] text-neutral-600">Fonte: {fefc[0].fonte}</p>
          )}
        </section>
      )}

      {anual.length > 0 && (
        <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="text-sm font-semibold text-neutral-200">
            Fundo Partidário {anoAnual} — duodécimos distribuídos no ano
          </h2>
          <p className="mb-3 text-xs text-neutral-500">
            Total distribuído: R${" "}
            {(totalAnual / 1e9).toLocaleString("pt-BR", { maximumFractionDigits: 2 })} bilhões ·
            verba mensal de manutenção dos partidos (Lei 9.096/1995), fora de campanha
          </p>
          <div className="flex flex-col gap-1">
            {anual.map((f) => {
              const antes = anualAnterior.get(f.partido.sigla);
              const delta = antes ? ((f.valor - antes) / antes) * 100 : null;
              return (
                <div key={f.id} className="flex flex-col gap-0.5">
                  <div className="flex flex-wrap items-center justify-between gap-x-3 text-xs">
                    <span className="font-medium text-neutral-200">{f.partido.sigla}</span>
                    <span className="tabular-nums text-neutral-400">
                      R$ {(f.valor / 1e6).toLocaleString("pt-BR", { maximumFractionDigits: 1 })} mi
                      {delta !== null && (
                        <span className={`ml-2 ${delta >= 0 ? "text-emerald-500" : "text-red-400"}`}>
                          {delta >= 0 ? "+" : ""}
                          {delta.toFixed(0)}% vs {(anoAnual ?? 0) - 1}
                        </span>
                      )}
                      <span className="ml-2 text-neutral-600">
                        {totalAnual > 0 ? `${((f.valor / totalAnual) * 100).toFixed(1)}%` : ""}
                      </span>
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                    <div
                      className="h-1.5 rounded-full bg-sky-500/80"
                      style={{ width: `${totalAnual > 0 ? (f.valor / (anual[0]?.valor || 1)) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          {anual[0]?.fonte && (
            <p className="mt-2 text-[11px] text-neutral-600">Fonte: {anual[0].fonte}</p>
          )}
        </section>
      )}

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        {partidos.map((p) => (
          <CardLink key={p.id} href={`/partidos/${p.id}`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{p.sigla}</p>
                {p.federacao && (
                  <span className="rounded-full bg-orange-950 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                    Federação {p.federacao}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{p.nome}</p>
              {p.presidenteNacional && (
                <p className="text-xs text-neutral-600">Pres.: {p.presidenteNacional}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-amber-400">
                {p.votosUltimaEleicao.toLocaleString("pt-BR")}
              </p>
              <p className="text-[10px] text-neutral-600">
                votos em {p.ultimoAno ?? "—"} · {p.eleitosComMandato} com mandato
              </p>
            </div>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
