import { CardLink } from "@/components/CardLink";
import { SearchBar } from "@/components/SearchBar";
import { buscarTudo } from "@/lib/data";

export default async function BuscaPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const termo = q?.trim() ?? "";
  const resultado = termo
    ? await buscarTudo(termo)
    : { candidatos: [], municipios: [], regioes: [], partidos: [] };
  const totalResultados =
    resultado.candidatos.length +
    resultado.municipios.length +
    resultado.regioes.length +
    resultado.partidos.length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold">Buscar</h1>
        <p className="text-sm text-neutral-500">
          Encontre candidatos, municípios e regiões rapidamente.
        </p>
      </div>

      <SearchBar valorInicial={termo} />

      {!termo && (
        <p className="mt-4 text-center text-sm text-neutral-600">
          Digite um nome, número de candidato ou município para começar.
        </p>
      )}

      {termo && totalResultados === 0 && (
        <p className="mt-4 text-center text-sm text-neutral-600">
          Nenhum resultado para &quot;{termo}&quot;.
        </p>
      )}

      {resultado.candidatos.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Candidatos ({resultado.candidatos.length})
          </h2>
          {resultado.candidatos.map((c) => (
            <CardLink key={c.id} href={`/candidatos/${c.id}`}>
              <div>
                <p className="font-medium">{c.nome}</p>
                <p className="text-xs text-neutral-500">
                  {c.numero} · {c.partido.sigla} · {c.cargo.nome}
                  {c.cargo.municipio ? ` (${c.cargo.municipio.nome})` : ""}
                </p>
              </div>
              <span className="text-sm font-semibold text-amber-400">
                {c.totalVotos.toLocaleString("pt-BR")}
              </span>
            </CardLink>
          ))}
        </section>
      )}

      {resultado.municipios.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Municípios ({resultado.municipios.length})
          </h2>
          {resultado.municipios.map((m) => (
            <CardLink key={m.id} href={`/municipios/${m.id}`}>
              <p className="font-medium">{m.nome}</p>
              <span className="text-xs text-neutral-500">{m.regiao.nome}</span>
            </CardLink>
          ))}
        </section>
      )}

      {resultado.regioes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Regiões ({resultado.regioes.length})
          </h2>
          {resultado.regioes.map((r) => (
            <CardLink key={r.id} href={`/municipios#regiao-${r.id}`}>
              <p className="font-medium">{r.nome}</p>
            </CardLink>
          ))}
        </section>
      )}

      {resultado.partidos.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Partidos ({resultado.partidos.length})
          </h2>
          {resultado.partidos.map((p) => (
            <CardLink key={p.id} href={`/partidos/${p.id}`}>
              <div>
                <p className="font-medium">{p.sigla}</p>
                <p className="text-xs text-neutral-500">{p.nome}</p>
              </div>
              <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                nº {p.numero}
              </span>
            </CardLink>
          ))}
        </section>
      )}
    </div>
  );
}
