import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Search } from "lucide-react";
import {
  CARGOS_COMPARAVEIS,
  anosDoCargo,
  compararEleicoes,
} from "@/lib/comparativos";
import { prisma } from "@/lib/prisma";

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

export default async function ComparativosPage({
  searchParams,
}: {
  searchParams: Promise<{
    cargo?: string;
    a?: string;
    b?: string;
    pcargo?: string;
    pano?: string;
    q?: string;
    da?: string;
  }>;
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

  // Seção do candidato: cargo + ano escolhidos listam as pessoas (eleitos
  // primeiro); o filtro de nome ignora acentos e maiúsculas.
  const pcargo = CARGOS_COMPARAVEIS.includes(sp.pcargo as (typeof CARGOS_COMPARAVEIS)[number])
    ? (sp.pcargo as string)
    : "Deputado Estadual";
  const panos = pcargo === cargo ? anos : await anosDoCargo(pcargo);
  const pano = sp.pano && panos.includes(Number(sp.pano)) ? Number(sp.pano) : panos[0];
  const q = (sp.q ?? "").trim();
  const pessoas = pano != null ? await listarPessoas(pcargo, pano, q) : [];

  // Duelo em duas etapas: ?da=<id> guarda o primeiro escolhido; o próximo
  // clique abre o confronto.
  const desafiante = sp.da
    ? await prisma.candidato.findUnique({
        where: { id: sp.da },
        select: { id: true, nome: true },
      })
    : null;
  const paramsBase = new URLSearchParams();
  paramsBase.set("cargo", cargo);
  if (anoA != null) paramsBase.set("a", String(anoA));
  if (anoB != null) paramsBase.set("b", String(anoB));
  paramsBase.set("pcargo", pcargo);
  if (pano != null) paramsBase.set("pano", String(pano));
  if (q) paramsBase.set("q", q);

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
          Escolha o cargo e o ano para listar as pessoas (eleitos primeiro); clique em alguém
          para comparar as eleições dele. O filtro de nome ignora acentos.
        </p>
        <form className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Cargo
            <select
              name="pcargo"
              defaultValue={pcargo}
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
              name="pano"
              defaultValue={pano ?? ""}
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-2 py-2 text-sm text-neutral-100"
            >
              {panos.map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-neutral-500">
            Filtrar por nome (opcional)
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="ex.: carlos vinicius"
              className="w-56 max-w-full rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-100 placeholder:text-neutral-600"
            />
          </label>
          <input type="hidden" name="cargo" value={cargo} />
          {anoA != null && <input type="hidden" name="a" value={anoA} />}
          {anoB != null && <input type="hidden" name="b" value={anoB} />}
          {desafiante && <input type="hidden" name="da" value={desafiante.id} />}
          <button className="flex items-center gap-1.5 rounded-lg bg-amber-400 px-4 py-2 text-sm font-semibold text-neutral-950">
            <Search size={14} /> Listar
          </button>
        </form>

        {desafiante && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-sky-800 bg-sky-950/40 px-3 py-2 text-sm">
            <span className="text-sky-200">
              ⚔ Duelo: <span className="font-semibold">{desafiante.nome}</span> ×{" "}
              <span className="text-sky-400">escolha o adversário na lista</span>
            </span>
            <Link
              href={`/comparativos?${paramsBase.toString()}`}
              className="rounded-full border border-neutral-700 px-2.5 py-0.5 text-xs text-neutral-300 hover:border-neutral-500"
            >
              cancelar
            </Link>
          </div>
        )}

        {pano != null && (
          <div className="mt-3">
            {pessoas.length === 0 && (
              <p className="text-xs text-neutral-500">
                Nenhum candidato de {pcargo} em {pano}
                {q ? ` com “${q}” no nome` : ""}.
              </p>
            )}
            <div className="flex max-h-96 flex-col gap-1 overflow-y-auto pr-1">
              {pessoas.map((c) => (
                <div
                  key={c.id}
                  className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                    c.eleito ? "border-emerald-900 bg-emerald-950/20" : "border-neutral-800"
                  }`}
                >
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate font-medium text-neutral-100">{c.nome}</span>
                    <span className="shrink-0 text-xs text-neutral-500">
                      {c.numero} · {c.partido}
                    </span>
                    {c.eleito && (
                      <span className="shrink-0 rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        Eleito
                      </span>
                    )}
                  </span>
                  <span className="flex shrink-0 items-center gap-2 text-xs tabular-nums text-neutral-400">
                    {c.votos.toLocaleString("pt-BR")} votos
                    {desafiante ? (
                      desafiante.id !== c.id && (
                        <Link
                          href={`/comparativos/duelo?a=${desafiante.id}&b=${c.id}`}
                          className="rounded-full border border-sky-700 px-2.5 py-0.5 text-sky-300 hover:border-sky-500"
                        >
                          ⚔ desafiar
                        </Link>
                      )
                    ) : (
                      <>
                        <Link
                          href={`/comparativos/candidato/${c.id}`}
                          className="text-amber-400 hover:underline"
                        >
                          evolução →
                        </Link>
                        <Link
                          href={`/comparativos?${paramsBase.toString()}&da=${c.id}`}
                          className="rounded-full border border-sky-800 px-2.5 py-0.5 text-sky-300 hover:border-sky-600"
                        >
                          ⚔ duelo
                        </Link>
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
            {pessoas.length > 0 && (
              <p className="mt-1.5 text-[11px] text-neutral-600">
                {pessoas.length} candidato{pessoas.length === 1 ? "" : "s"} · eleitos primeiro,
                depois por votação.
              </p>
            )}
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
          <input type="hidden" name="pcargo" value={pcargo} />
          {pano != null && <input type="hidden" name="pano" value={pano} />}
          {q && <input type="hidden" name="q" value={q} />}
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

// Pessoas de um cargo/ano: eleitos primeiro, depois por votação. O filtro
// de nome é aplicado DEPOIS de normalizar (sem acento, sem caixa), por
// isso "carlos vinicius" encontra "CARLOS VINÍCIUS".
async function listarPessoas(cargoNome: string, ano: number, q: string) {
  const candidatos = await prisma.candidato.findMany({
    where: { cargo: { nome: cargoNome, eleicao: { ano } } },
    include: { partido: true },
  });
  const votosPorCandidato = await prisma.resultado.groupBy({
    by: ["candidatoId"],
    where: { turno: 1, candidato: { cargo: { nome: cargoNome, eleicao: { ano } } } },
    _sum: { votos: true },
  });
  const votos = new Map(votosPorCandidato.map((v) => [v.candidatoId, v._sum.votos ?? 0]));

  const alvo = q ? normalizar(q) : "";
  const vistos = new Set<string>();
  const lista: {
    id: string;
    nome: string;
    numero: number;
    partido: string;
    eleito: boolean;
    votos: number;
  }[] = [];
  const ordenados = candidatos
    .map((c) => ({ c, v: votos.get(c.id) ?? 0 }))
    .sort((x, y) => Number(y.c.eleito) - Number(x.c.eleito) || y.v - x.v);
  for (const { c, v } of ordenados) {
    if (alvo && !normalizar(`${c.nome} ${c.nomeCompleto ?? ""}`).includes(alvo)) continue;
    // Duplicatas herdadas de seeds antigos: fica a cópia mais votada.
    const chave = `${c.numero}:${normalizar(c.nome)}`;
    if (vistos.has(chave)) continue;
    vistos.add(chave);
    lista.push({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partido: c.partido.sigla,
      eleito: c.eleito,
      votos: v,
    });
  }
  return lista;
}
