import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { getCandidaturasAnteriores } from "@/lib/data";
import { compararPorMunicipio } from "@/lib/comparativos";
import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";

// Comparativo de um candidato consigo mesmo: votação município a
// município entre duas candidaturas da mesma pessoa.
export default async function ComparativoCandidatoPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ a?: string; b?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;

  const atual = await prisma.candidato.findUnique({
    where: { id },
    include: {
      partido: true,
      cargo: { include: { eleicao: true } },
      resultados: true,
    },
  });
  if (!atual) notFound();

  const anteriores = await getCandidaturasAnteriores({
    id: atual.id,
    cpf: atual.cpf,
    nomeCompleto: atual.nomeCompleto,
    nome: atual.nome,
  });

  // Todas as candidaturas da pessoa, da mais nova para a mais antiga.
  const candidaturas = [
    {
      id: atual.id,
      nome: atual.nome,
      ano: atual.cargo.eleicao.ano,
      cargo: atual.cargo.nome,
      partido: atual.partido.sigla,
      votos: votosDecisivos(atual.resultados),
      temMunicipios: atual.resultados.some((r) => r.turno === 1),
    },
    ...anteriores.map((c) => ({
      id: c.id,
      nome: c.nome,
      ano: c.cargo.eleicao.ano,
      cargo: c.cargo.nome,
      partido: c.partido.sigla,
      votos: c.totalVotos,
      temMunicipios: c.resultados.some((r) => r.turno === 1),
    })),
  ].sort((x, y) => y.ano - x.ano);

  const comparaveis = candidaturas.filter((c) => c.temMunicipios);
  const idB = sp.b && comparaveis.some((c) => c.id === sp.b) ? sp.b : comparaveis[0]?.id;
  const idA =
    sp.a && comparaveis.some((c) => c.id === sp.a) && sp.a !== idB
      ? sp.a
      : comparaveis.find((c) => c.id !== idB)?.id;

  const comp = idA && idB ? await compararPorMunicipio(idA, idB) : null;
  const cresceu = comp ? [...comp.linhas].sort((x, y) => y.delta - x.delta).slice(0, 10) : [];
  const caiu = comp
    ? [...comp.linhas].sort((x, y) => x.delta - y.delta).filter((l) => l.delta < 0).slice(0, 10)
    : [];

  const rotulo = (c: (typeof candidaturas)[number]) =>
    `${c.ano} · ${c.cargo} · ${c.partido} · ${c.votos.toLocaleString("pt-BR")} votos`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <div>
          <p className="text-xs text-neutral-500">
            <Link href="/comparativos" className="hover:text-amber-400">
              Comparativos
            </Link>{" "}
            / candidato
          </p>
          <h1 className="text-lg font-semibold">{atual.nome}</h1>
          <p className="text-sm text-neutral-500">
            {candidaturas.length} candidatura{candidaturas.length === 1 ? "" : "s"} encontradas ·{" "}
            <Link href={`/candidatos/${atual.id}`} className="text-amber-400 hover:underline">
              ver ficha completa
            </Link>
          </p>
        </div>
      </div>

      {comparaveis.length < 2 && (
        <p className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm text-neutral-400">
          Esta pessoa só tem {comparaveis.length === 0 ? "nenhuma" : "uma"} candidatura com votos
          por município registrados — não há o que comparar ainda.
        </p>
      )}

      {comparaveis.length >= 2 && (
        <>
          <form className="flex flex-wrap items-end gap-2">
            <label className="flex flex-col gap-1 text-xs text-neutral-500">
              De
              <select
                name="a"
                defaultValue={idA}
                className="max-w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
              >
                {comparaveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {rotulo(c)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-xs text-neutral-500">
              Para
              <select
                name="b"
                defaultValue={idB}
                className="max-w-full rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
              >
                {comparaveis.map((c) => (
                  <option key={c.id} value={c.id}>
                    {rotulo(c)}
                  </option>
                ))}
              </select>
            </label>
            <button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
              Comparar
            </button>
          </form>

          {comp && (
            <>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                <CardResumo
                  titulo={`${comp.a.ano} · ${comp.a.cargo}`}
                  valor={comp.a.total.toLocaleString("pt-BR")}
                  detalhe={`${comp.a.partido}${comp.a.eleito ? " · eleito" : ""}`}
                />
                <CardResumo
                  titulo={`${comp.b.ano} · ${comp.b.cargo}`}
                  valor={comp.b.total.toLocaleString("pt-BR")}
                  detalhe={`${comp.b.partido}${comp.b.eleito ? " · eleito" : ""}`}
                />
                <CardResumo
                  titulo="Variação total"
                  valor={`${comp.b.total - comp.a.total >= 0 ? "+" : ""}${(
                    comp.b.total - comp.a.total
                  ).toLocaleString("pt-BR")}`}
                  detalhe={
                    comp.a.total > 0
                      ? `${(((comp.b.total - comp.a.total) / comp.a.total) * 100).toFixed(1)}%`
                      : "—"
                  }
                  destaque={comp.b.total - comp.a.total >= 0 ? "alta" : "queda"}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ListaVariacao
                  titulo="Onde mais cresceu"
                  icone={<ArrowUpRight size={14} className="text-emerald-400" />}
                  linhas={cresceu.filter((l) => l.delta > 0)}
                />
                <ListaVariacao
                  titulo="Onde mais caiu"
                  icone={<ArrowDownRight size={14} className="text-red-400" />}
                  linhas={caiu}
                />
              </div>

              <details className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
                <summary className="cursor-pointer text-sm font-medium text-neutral-300">
                  Todos os municípios ({comp.linhas.length})
                </summary>
                <div className="mt-2 flex flex-col gap-0.5">
                  {comp.linhas.map((l) => (
                    <div
                      key={l.municipio}
                      className="flex flex-wrap items-center justify-between gap-x-3 rounded px-2 py-1 text-xs odd:bg-neutral-950/50"
                    >
                      <span className="text-neutral-300">
                        {l.municipio}
                        <span className="ml-1.5 text-neutral-600">{l.regiao}</span>
                      </span>
                      <span className="tabular-nums text-neutral-400">
                        {l.a.toLocaleString("pt-BR")} → {l.b.toLocaleString("pt-BR")}
                        <span
                          className={`ml-2 font-semibold ${
                            l.delta > 0
                              ? "text-emerald-400"
                              : l.delta < 0
                                ? "text-red-400"
                                : "text-neutral-600"
                          }`}
                        >
                          {l.delta > 0 ? `+${l.delta.toLocaleString("pt-BR")}` : l.delta.toLocaleString("pt-BR")}
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </details>
            </>
          )}
        </>
      )}
    </div>
  );
}

function CardResumo({
  titulo,
  valor,
  detalhe,
  destaque,
}: {
  titulo: string;
  valor: string;
  detalhe: string;
  destaque?: "alta" | "queda";
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
      <p
        className={`text-xl font-bold ${
          destaque === "alta"
            ? "text-emerald-400"
            : destaque === "queda"
              ? "text-red-400"
              : "text-amber-400"
        }`}
      >
        {valor}
      </p>
      <p className="text-xs text-neutral-500">{detalhe}</p>
    </div>
  );
}

function ListaVariacao({
  titulo,
  icone,
  linhas,
}: {
  titulo: string;
  icone: React.ReactNode;
  linhas: { municipio: string; regiao: string; a: number; b: number; delta: number }[];
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-3">
      <h3 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-neutral-400">
        {icone} {titulo}
      </h3>
      {linhas.length === 0 && <p className="text-xs text-neutral-600">Nenhum município.</p>}
      <div className="flex flex-col gap-1">
        {linhas.map((l) => (
          <div
            key={l.municipio}
            className="flex flex-wrap items-center justify-between gap-x-3 rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm"
          >
            <span className="text-neutral-200">{l.municipio}</span>
            <span className="tabular-nums text-xs text-neutral-500">
              {l.a.toLocaleString("pt-BR")} → {l.b.toLocaleString("pt-BR")}
              <span
                className={`ml-2 font-semibold ${l.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}
              >
                {l.delta >= 0 ? `+${l.delta.toLocaleString("pt-BR")}` : l.delta.toLocaleString("pt-BR")}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
