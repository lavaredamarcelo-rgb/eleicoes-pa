import Link from "next/link";
import { notFound } from "next/navigation";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import {
  compararPorMunicipio,
  dueloPorBairro,
  municipiosComLocais,
} from "@/lib/comparativos";

// DUELO: dois candidatos lado a lado, município a município e por
// região — quem lidera onde, e por quanto. Com recorte por BAIRRO
// dentro de um município (?mun=) quando há votos por local.
export default async function DueloPage({
  searchParams,
}: {
  searchParams: Promise<{ a?: string; b?: string; mun?: string }>;
}) {
  const sp = await searchParams;
  if (!sp.a || !sp.b || sp.a === sp.b) notFound();

  const comp = await compararPorMunicipio(sp.a, sp.b);
  if (!comp) notFound();

  const munsComLocais = await municipiosComLocais(sp.a, sp.b);
  const munSel = sp.mun && munsComLocais.includes(sp.mun) ? sp.mun : null;
  const bairros = munSel ? await dueloPorBairro(sp.a, sp.b, munSel) : [];

  const regioes = new Map<string, { a: number; b: number }>();
  for (const l of comp.linhas) {
    const r = regioes.get(l.regiao) ?? { a: 0, b: 0 };
    r.a += l.a;
    r.b += l.b;
    regioes.set(l.regiao, r);
  }
  const porRegiao = [...regioes.entries()]
    .map(([regiao, v]) => ({ regiao, ...v, diff: v.a - v.b }))
    .sort((x, y) => y.a + y.b - (x.a + x.b));

  const dominaA = [...comp.linhas].sort((x, y) => y.a - y.b - (x.a - x.b)).filter((l) => l.a > l.b);
  const dominaB = [...comp.linhas].sort((x, y) => y.b - y.a - (x.b - x.a)).filter((l) => l.b > l.a);
  const difTotal = comp.a.total - comp.b.total;

  const rot = (c: typeof comp.a) =>
    `${c.nome} · ${c.cargo} ${c.ano} · ${c.partido}${c.eleito ? " · eleito" : ""}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-neutral-500">
          <Link href="/comparativos" className="hover:text-amber-400">
            Comparativos
          </Link>{" "}
          / duelo
        </p>
        <h1 className="text-lg font-semibold">
          <span className="text-amber-400">{comp.a.nome}</span>
          <span className="mx-2 text-neutral-500">×</span>
          <span className="text-sky-400">{comp.b.nome}</span>
        </h1>
        <p className="text-sm text-neutral-500">
          {rot(comp.a)} <span className="text-neutral-700">contra</span> {rot(comp.b)}
        </p>
      </div>

      <div>
        <PdfDownloadLink href={`/api/pdf/duelo?a=${sp.a}&b=${sp.b}`} label="PDF do duelo" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card titulo={comp.a.nome} valor={comp.a.total.toLocaleString("pt-BR")} cor="text-amber-400" detalhe={`${comp.a.cargo} ${comp.a.ano}`} />
        <Card titulo={comp.b.nome} valor={comp.b.total.toLocaleString("pt-BR")} cor="text-sky-400" detalhe={`${comp.b.cargo} ${comp.b.ano}`} />
        <Card
          titulo="Diferença"
          valor={`${difTotal >= 0 ? "+" : ""}${difTotal.toLocaleString("pt-BR")}`}
          cor={difTotal >= 0 ? "text-amber-400" : "text-sky-400"}
          detalhe={`vantagem de ${difTotal >= 0 ? comp.a.nome : comp.b.nome}`}
        />
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Por região
        </h2>
        <div className="flex flex-col gap-1">
          {porRegiao.map((r) => {
            const total = r.a + r.b;
            return (
              <div key={r.regiao} className="rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-x-3">
                  <span className="font-medium text-neutral-200">{r.regiao}</span>
                  <span className="tabular-nums text-xs">
                    <span className="font-semibold text-amber-400">{r.a.toLocaleString("pt-BR")}</span>
                    <span className="mx-1.5 text-neutral-600">×</span>
                    <span className="font-semibold text-sky-400">{r.b.toLocaleString("pt-BR")}</span>
                    <span className={`ml-2 ${r.diff >= 0 ? "text-amber-400" : "text-sky-400"}`}>
                      ({r.diff >= 0 ? "+" : ""}
                      {r.diff.toLocaleString("pt-BR")})
                    </span>
                  </span>
                </div>
                <div className="mt-1 flex h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div className="h-1.5 bg-amber-400" style={{ width: `${total > 0 ? (r.a / total) * 100 : 0}%` }} />
                  <div className="h-1.5 bg-sky-500" style={{ width: `${total > 0 ? (r.b / total) * 100 : 0}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ListaDominio titulo={`Onde ${comp.a.nome} lidera (${dominaA.length})`} cor="text-amber-400" linhas={dominaA.slice(0, 12)} ladoA />
        <ListaDominio titulo={`Onde ${comp.b.nome} lidera (${dominaB.length})`} cor="text-sky-400" linhas={dominaB.slice(0, 12)} ladoA={false} />
      </div>

      {munsComLocais.length > 0 && (
        <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Duelo por bairro dentro de um município
          </h2>
          <form className="flex flex-wrap items-end gap-2">
            <input type="hidden" name="a" value={sp.a} />
            <input type="hidden" name="b" value={sp.b} />
            <select
              name="mun"
              defaultValue={munSel ?? ""}
              className="max-w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
            >
              <option value="">Escolha o município…</option>
              {munsComLocais.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
              Ver bairros
            </button>
          </form>

          {munSel && (
            <div className="mt-3 flex flex-col gap-1">
              {bairros.length === 0 && (
                <p className="text-xs text-neutral-500">
                  Sem votos por local registrados em {munSel} para os dois.
                </p>
              )}
              {bairros.map((l) => {
                const total = l.a + l.b;
                return (
                  <div key={l.bairro} className="rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-x-3">
                      <span className="text-neutral-200">{l.bairro}</span>
                      <span className="tabular-nums text-xs">
                        <span className="font-semibold text-amber-400">{l.a.toLocaleString("pt-BR")}</span>
                        <span className="mx-1.5 text-neutral-600">×</span>
                        <span className="font-semibold text-sky-400">{l.b.toLocaleString("pt-BR")}</span>
                        <span className={`ml-2 ${l.delta >= 0 ? "text-amber-400" : "text-sky-400"}`}>
                          ({l.delta >= 0 ? "+" : ""}
                          {l.delta.toLocaleString("pt-BR")})
                        </span>
                      </span>
                    </div>
                    <div className="mt-1 flex h-1 w-full overflow-hidden rounded-full bg-neutral-800">
                      <div className="h-1 bg-amber-400" style={{ width: `${total > 0 ? (l.a / total) * 100 : 0}%` }} />
                      <div className="h-1 bg-sky-500" style={{ width: `${total > 0 ? (l.b / total) * 100 : 0}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <p className="mt-2 text-[11px] text-neutral-600">
            Base: votos por local de votação (disponível para as eleições estaduais de 2022 e
            2026 e municipais de 2024).
          </p>
        </section>
      )}

      <details className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium text-neutral-300">
          Todos os municípios ({comp.linhas.length})
        </summary>
        <div className="mt-2 flex flex-col gap-0.5">
          {comp.linhas.map((l) => (
            <div key={l.municipio} className="flex flex-wrap items-center justify-between gap-x-3 rounded px-2 py-1 text-xs odd:bg-neutral-950/50">
              <span className="text-neutral-300">
                {l.municipio}
                <span className="ml-1.5 text-neutral-600">{l.regiao}</span>
              </span>
              <span className="tabular-nums">
                <span className="text-amber-400">{l.a.toLocaleString("pt-BR")}</span>
                <span className="mx-1 text-neutral-600">×</span>
                <span className="text-sky-400">{l.b.toLocaleString("pt-BR")}</span>
                <span className={`ml-2 font-semibold ${l.a - l.b >= 0 ? "text-amber-400" : "text-sky-400"}`}>
                  {l.a - l.b >= 0 ? "+" : ""}
                  {(l.a - l.b).toLocaleString("pt-BR")}
                </span>
              </span>
            </div>
          ))}
        </div>
      </details>

      <p className="text-[11px] text-neutral-600">
        Dica: os dois candidatos podem ser de eleições diferentes (ex.: o desempenho de um em
        2022 contra o de outro em 2026) — os votos comparados são sempre os do 1º turno de cada
        disputa.
      </p>
    </div>
  );
}

function Card({ titulo, valor, cor, detalhe }: { titulo: string; valor: string; cor: string; detalhe: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <p className="truncate text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
      <p className={`text-xl font-bold ${cor}`}>{valor}</p>
      <p className="text-xs text-neutral-500">{detalhe}</p>
    </div>
  );
}

function ListaDominio({
  titulo,
  cor,
  linhas,
  ladoA,
}: {
  titulo: string;
  cor: string;
  linhas: { municipio: string; a: number; b: number }[];
  ladoA: boolean;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <h3 className={`mb-2 text-xs font-semibold uppercase tracking-wide ${cor}`}>{titulo}</h3>
      {linhas.length === 0 && <p className="text-xs text-neutral-600">Nenhum município.</p>}
      <div className="flex flex-col gap-1">
        {linhas.map((l) => (
          <div key={l.municipio} className="flex flex-wrap items-center justify-between gap-x-3 rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm">
            <span className="text-neutral-200">{l.municipio}</span>
            <span className="tabular-nums text-xs text-neutral-500">
              {l.a.toLocaleString("pt-BR")} × {l.b.toLocaleString("pt-BR")}
              <span className={`ml-2 font-semibold ${cor}`}>
                +{Math.abs(l.a - l.b).toLocaleString("pt-BR")}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
