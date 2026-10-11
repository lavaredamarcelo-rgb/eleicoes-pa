import Link from "next/link";
import {
  CARGOS_COMPARAVEIS,
  anosDoCargo,
  vencedoresPorMunicipio,
} from "@/lib/comparativos";
import { MapaVotos } from "@/components/MapaVotos";

// MAPA DE VENCEDORES: cada município pintado com a cor de quem foi o
// mais votado naquele cargo/ano, com o ranking de municípios ganhos.
const PALETA = [
  "#f59e0b", // âmbar
  "#38bdf8", // azul
  "#34d399", // verde
  "#f87171", // vermelho
  "#a78bfa", // roxo
  "#fb923c", // laranja
  "#f472b6", // rosa
  "#facc15", // amarelo
  "#2dd4bf", // teal
  "#c084fc", // lilás
  "#93c5fd", // azul claro
  "#bef264", // lima
];
const OUTROS = "#525252";

export default async function MapaVencedoresPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; ano?: string }>;
}) {
  const sp = await searchParams;
  const cargo = CARGOS_COMPARAVEIS.includes(sp.cargo as (typeof CARGOS_COMPARAVEIS)[number])
    ? (sp.cargo as string)
    : "Governador";
  const anos = await anosDoCargo(cargo);
  const ano = sp.ano && anos.includes(Number(sp.ano)) ? Number(sp.ano) : anos[0];

  const dados = ano != null ? await vencedoresPorMunicipio(cargo, ano) : null;

  const corDoVencedor = new Map<string, string>();
  dados?.ranking.forEach((r, i) => {
    corDoVencedor.set(r.nome, i < PALETA.length ? PALETA[i] : OUTROS);
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-neutral-500">
          <Link href="/comparativos" className="hover:text-amber-400">
            Comparativos
          </Link>{" "}
          / mapa de vencedores
        </p>
        <h1 className="text-lg font-semibold">Quem venceu em cada município</h1>
        <p className="text-sm text-neutral-500">
          O mais votado de {cargo} em cada cidade — e o ranking de municípios conquistados.
        </p>
      </div>

      <form className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Cargo
          <select
            name="cargo"
            defaultValue={cargo}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
          >
            {CARGOS_COMPARAVEIS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-neutral-500">
          Ano
          <select
            name="ano"
            defaultValue={ano ?? ""}
            className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
          >
            {anos.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
          Ver mapa
        </button>
      </form>

      {dados && dados.porMunicipio.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[2fr_1fr]">
          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <MapaVotos
              altura="h-[480px]"
              cores={Object.fromEntries(
                dados.porMunicipio
                  .filter((m) => m.codigoIbge)
                  .map((m) => [m.codigoIbge!, corDoVencedor.get(m.melhor.nome) ?? OUTROS])
              )}
              titulos={Object.fromEntries(
                dados.porMunicipio
                  .filter((m) => m.codigoIbge)
                  .map((m) => [
                    m.codigoIbge!,
                    `${m.municipio}: ${m.melhor.nome} (${m.melhor.partido}) ${m.melhor.votos.toLocaleString("pt-BR")}${
                      m.segundo ? ` · 2º ${m.segundo.nome} ${m.segundo.votos.toLocaleString("pt-BR")}` : ""
                    }`,
                  ])
              )}
            />
            <p className="mt-1 text-[11px] text-neutral-600">
              Passe o mouse num município para ver o vencedor e o 2º colocado.
            </p>
          </section>

          <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Ranking — municípios conquistados
            </h2>
            <div className="flex max-h-[460px] flex-col gap-1 overflow-y-auto pr-1">
              {dados.ranking.map((r, i) => (
                <div
                  key={r.nome}
                  className="flex flex-wrap items-center justify-between gap-x-2 rounded-lg bg-neutral-950/60 px-2.5 py-1.5 text-sm"
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span
                      className="h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: i < PALETA.length ? PALETA[i] : OUTROS }}
                    />
                    <span className="truncate text-neutral-200">{r.nome}</span>
                    <span className="shrink-0 text-xs text-neutral-600">{r.partido}</span>
                  </span>
                  <span className="shrink-0 tabular-nums text-xs text-neutral-400">
                    <span className="font-semibold text-neutral-100">{r.municipios}</span>{" "}
                    município{r.municipios === 1 ? "" : "s"}
                  </span>
                </div>
              ))}
            </div>
            {dados.ranking.length > PALETA.length && (
              <p className="mt-1.5 text-[11px] text-neutral-600">
                Do 13º em diante, os municípios aparecem em cinza no mapa.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
