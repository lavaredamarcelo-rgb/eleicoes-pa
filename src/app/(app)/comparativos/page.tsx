import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import {
  CARGOS_COMPARAVEIS,
  anosDoCargo,
  compararEleicoes,
} from "@/lib/comparativos";
import { prisma } from "@/lib/prisma";

export default async function ComparativosPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; a?: string; b?: string; q?: string }>;
}) {
  const sp = await searchParams;
  const cargo = CARGOS_COMPARAVEIS.includes(sp.cargo as (typeof CARGOS_COMPARAVEIS)[number])
    ? (sp.cargo as string)
    : "Deputado Estadual";
  const anos = await anosDoCargo(cargo);
  const anoB = sp.b && anos.includes(Number(sp.b)) ? Number(sp.b) : anos[0];
  const anoA =
    sp.a && anos.includes(Number(sp.a)) && Number(sp.a) !== anoB
      ? Number(sp.a)
      : anos.find((x) => x !== anoB);

  const comparativo =
    anoA != null && anoB != null ? await compararEleicoes(cargo, anoA, anoB) : null;

  const q = (sp.q ?? "").trim();
  const encontrados = q.length >= 3 ? await buscarCandidatos(q) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Comparativos entre eleições</h1>
        <p className="text-sm text-neutral-500">
          Saldo de cadeiras por partido, quem entrou e quem saiu — e a evolução de um candidato
          município a município entre duas eleições.
        </p>
      </div>

      {/* ===== Candidato × ele mesmo ===== */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="text-sm font-semibold text-neutral-200">
          Candidato: onde cresceu e onde caiu
        </h2>
        <p className="mb-3 text-xs text-neutral-500">
          Busque o candidato; na página dele você escolhe as duas eleições a comparar.
        </p>
        <form className="flex flex-wrap gap-2">
          <input
            type="text"
            name="q"
            defaultValue={q}
            placeholder="Nome do candidato (mín. 3 letras)…"
            className="w-72 max-w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600"
          />
          <input type="hidden" name="cargo" value={cargo} />
          {anoA != null && <input type="hidden" name="a" value={anoA} />}
          {anoB != null && <input type="hidden" name="b" value={anoB} />}
          <button className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
            <Search size={14} /> Buscar
          </button>
        </form>
        {q.length >= 3 && (
          <div className="mt-3 flex flex-col gap-1">
            {encontrados.length === 0 && (
              <p className="text-xs text-neutral-500">Nenhum candidato encontrado para “{q}”.</p>
            )}
            {encontrados.map((c) => (
              <Link
                key={c.id}
                href={`/comparativos/candidato/${c.id}`}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-neutral-800 px-3 py-2 text-sm transition-colors hover:border-amber-700"
              >
                <span>
                  <span className="font-medium text-neutral-100">{c.nome}</span>
                  <span className="ml-2 text-xs text-neutral-500">
                    {c.cargo} · {c.ano} · {c.partido}
                  </span>
                </span>
                <span className="text-xs text-amber-400">comparar →</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ===== Eleição × eleição ===== */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-200">Eleição × eleição</h2>
        <form className="mb-4 flex flex-wrap items-end gap-2">
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
            De
            <select
              name="a"
              defaultValue={anoA ?? ""}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
            >
              {anos.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Para
            <select
              name="b"
              defaultValue={anoB ?? ""}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
            >
              {anos.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <button className="rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
            Comparar
          </button>
        </form>

        {!comparativo && (
          <p className="text-sm text-neutral-500">
            É preciso ter pelo menos duas eleições com eleitos para este cargo.
          </p>
        )}

        {comparativo && (
          <div className="flex flex-col gap-5">
            {/* Cadeiras por partido */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                Cadeiras por partido — {comparativo.anoA} → {comparativo.anoB}
              </h3>
              <div className="flex flex-col gap-1">
                {comparativo.cadeiras.map((p) => (
                  <div
                    key={p.sigla}
                    className="flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm"
                  >
                    <span className="font-medium text-neutral-200">{p.sigla}</span>
                    <span className="tabular-nums text-neutral-400">
                      {p.a} → <span className="font-semibold text-neutral-100">{p.b}</span>
                      {p.delta !== 0 && (
                        <span
                          className={`ml-2 inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
                            p.delta > 0
                              ? "bg-emerald-950 text-emerald-300"
                              : "bg-red-950 text-red-300"
                          }`}
                        >
                          {p.delta > 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {p.delta > 0 ? `+${p.delta}` : p.delta}
                        </span>
                      )}
                      {p.delta === 0 && p.a > 0 && (
                        <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                          manteve
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              <ListaPessoas
                titulo={`Entraram (${comparativo.entraram.length})`}
                cor="text-emerald-300"
                pessoas={comparativo.entraram.map((e) => ({
                  id: e.id,
                  principal: e.nome,
                  detalhe: `${e.partido} · ${e.votos.toLocaleString("pt-BR")} votos`,
                }))}
              />
              <ListaPessoas
                titulo={`Saíram (${comparativo.sairam.length})`}
                cor="text-red-300"
                pessoas={comparativo.sairam.map((e) => ({
                  id: e.id,
                  principal: e.nome,
                  detalhe: `${e.partido} · tinha ${e.votos.toLocaleString("pt-BR")} votos em ${comparativo.anoA}`,
                }))}
              />
              <ListaPessoas
                titulo={`Reeleitos (${comparativo.reeleitos.length})`}
                cor="text-amber-300"
                pessoas={comparativo.reeleitos.map((e) => ({
                  id: e.id,
                  principal: e.nome,
                  detalhe: `${e.partidoAntes !== e.partido ? `${e.partidoAntes}→` : ""}${e.partido} · ${
                    e.deltaVotos >= 0 ? "+" : ""
                  }${e.deltaVotos.toLocaleString("pt-BR")} votos`,
                }))}
              />
            </div>

            <p className="text-[11px] text-neutral-600">
              Pessoas casadas entre as eleições por CPF (quando registrado) ou nome civil; sem
              esses dados, pelo nome de urna. Renovação: {comparativo.entraram.length} de{" "}
              {comparativo.totalB} cadeiras (
              {comparativo.totalB > 0
                ? Math.round((comparativo.entraram.length / comparativo.totalB) * 100)
                : 0}
              %).
            </p>
          </div>
        )}
      </section>
    </div>
  );
}

function ListaPessoas({
  titulo,
  cor,
  pessoas,
}: {
  titulo: string;
  cor: string;
  pessoas: { id: string; principal: string; detalhe: string }[];
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-3">
      <h4 className={`mb-2 text-xs font-semibold uppercase tracking-wide ${cor}`}>{titulo}</h4>
      <div className="flex max-h-80 flex-col gap-1 overflow-y-auto pr-1">
        {pessoas.length === 0 && <p className="text-xs text-neutral-600">Ninguém.</p>}
        {pessoas.map((p) => (
          <Link
            key={p.id}
            href={`/candidatos/${p.id}`}
            className="rounded-lg px-2 py-1 text-sm transition-colors hover:bg-neutral-800"
          >
            <span className="font-medium text-neutral-200">{p.principal}</span>
            <span className="block text-[11px] text-neutral-500">{p.detalhe}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Busca simples por nome de urna ou nome civil, mostrando a candidatura
// mais recente de cada pessoa (o refinamento acontece na página dela).
async function buscarCandidatos(q: string) {
  const candidatos = await prisma.candidato.findMany({
    where: {
      OR: [{ nome: { contains: q } }, { nomeCompleto: { contains: q } }],
    },
    include: { partido: true, cargo: { include: { eleicao: true } } },
    take: 120,
  });
  candidatos.sort((a, b) => b.cargo.eleicao.ano - a.cargo.eleicao.ano);
  const vistos = new Set<string>();
  const unicos: { id: string; nome: string; cargo: string; ano: number; partido: string }[] = [];
  for (const c of candidatos) {
    const chave = (c.nomeCompleto || c.nome).toUpperCase();
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    unicos.push({
      id: c.id,
      nome: c.nome,
      cargo: c.cargo.nome,
      ano: c.cargo.eleicao.ano,
      partido: c.partido.sigla,
    });
    if (unicos.length >= 15) break;
  }
  return unicos;
}
