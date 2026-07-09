import Link from "next/link";
import { SeletorComparacao } from "@/components/SeletorComparacao";
import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";

async function dadosMunicipio(id: string) {
  const m = await prisma.municipio.findUnique({
    where: { id },
    include: { regiao: true, eleitorado: true },
  });
  if (!m) return null;

  const anoEleitorado = m.eleitorado.length ? Math.max(...m.eleitorado.map((e) => e.ano)) : null;
  const eleitores = m.eleitorado.find((e) => e.ano === anoEleitorado)?.total ?? 0;

  const anoMunicipal = await prisma.eleicao.findFirst({
    where: { tipo: "MUNICIPAL", cargos: { some: { municipioId: id, candidatos: { some: { eleito: true } } } } },
    orderBy: { ano: "desc" },
  });

  let prefeito: { nome: string; partido: string; votos: number } | null = null;
  let bancada: { sigla: string; cadeiras: number }[] = [];
  if (anoMunicipal) {
    const cargoPrefeito = await prisma.cargo.findFirst({
      where: { nome: "Prefeito", municipioId: id, eleicaoId: anoMunicipal.id },
      include: { candidatos: { where: { eleito: true }, include: { partido: true, resultados: true } } },
    });
    const p = cargoPrefeito?.candidatos[0];
    if (p) prefeito = { nome: p.nome, partido: p.partido.sigla, votos: votosDecisivos(p.resultados) };

    const cargoVereador = await prisma.cargo.findFirst({
      where: { nome: "Vereador", municipioId: id, eleicaoId: anoMunicipal.id },
      include: { candidatos: { where: { eleito: true }, include: { partido: true } } },
    });
    const porPartido = new Map<string, number>();
    for (const v of cargoVereador?.candidatos ?? []) {
      porPartido.set(v.partido.sigla, (porPartido.get(v.partido.sigla) ?? 0) + 1);
    }
    bancada = Array.from(porPartido.entries())
      .map(([sigla, cadeiras]) => ({ sigla, cadeiras }))
      .sort((a, b) => b.cadeiras - a.cadeiras);
  }

  return {
    id: m.id,
    nome: m.nome,
    regiao: m.regiao.nome,
    populacao: m.populacao,
    eleitores,
    anoEleitorado,
    anoMunicipal: anoMunicipal?.ano ?? null,
    prefeito,
    bancada,
  };
}

export default async function CompararPage({
  searchParams,
}: {
  searchParams: Promise<{ m?: string }>;
}) {
  const { m } = await searchParams;
  const ids = (m ?? "").split(",").filter(Boolean).slice(0, 6);

  const [municipios, colunas] = await Promise.all([
    prisma.municipio.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    Promise.all(ids.map(dadosMunicipio)),
  ]);
  const dados = colunas.filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Comparar municípios</h1>
        <p className="text-sm text-neutral-500">
          Escolha de 2 a 6 municípios para ver os números lado a lado.
        </p>
      </div>

      <SeletorComparacao municipios={municipios} selecionados={ids} />

      {dados.length >= 2 && (
        <div className="overflow-x-auto">
          <div
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${dados.length}, minmax(0, 1fr))`,
              minWidth: `${dados.length * 190}px`,
            }}
          >
            {dados.map((d) => (
              <div key={d.id} className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <Link href={`/municipios/${d.id}`} className="font-semibold text-amber-400 hover:underline">
                  {d.nome}
                </Link>
                <p className="text-xs text-neutral-500">{d.regiao}</p>

                <Linha rotulo={`Eleitores${d.anoEleitorado ? ` (${d.anoEleitorado})` : ""}`} valor={d.eleitores.toLocaleString("pt-BR")} />
                <Linha rotulo="Habitantes (2022)" valor={d.populacao?.toLocaleString("pt-BR") ?? "—"} />
                <Linha
                  rotulo="% eleitores/habitantes"
                  valor={
                    d.populacao
                      ? `${((d.eleitores / d.populacao) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%`
                      : "—"
                  }
                />
                <Linha
                  rotulo={`Prefeito eleito${d.anoMunicipal ? ` (${d.anoMunicipal})` : ""}`}
                  valor={d.prefeito ? `${d.prefeito.nome} (${d.prefeito.partido})` : "—"}
                />
                <Linha
                  rotulo="Votos do prefeito"
                  valor={d.prefeito ? d.prefeito.votos.toLocaleString("pt-BR") : "—"}
                />

                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-500">
                  Câmara por partido
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {d.bancada.map((b) => (
                    <span
                      key={b.sigla}
                      className="rounded-full border border-neutral-800 bg-neutral-950 px-2 py-0.5 text-[11px] text-neutral-300"
                    >
                      {b.sigla} <span className="text-amber-400">{b.cadeiras}</span>
                    </span>
                  ))}
                  {d.bancada.length === 0 && <span className="text-xs text-neutral-600">—</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Linha({ rotulo, valor }: { rotulo: string; valor: string }) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-neutral-800/60 pb-1.5 text-sm">
      <span className="text-xs text-neutral-500">{rotulo}</span>
      <span className="text-right font-medium">{valor}</span>
    </div>
  );
}
