import { notFound } from "next/navigation";
import { School } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { getMunicipio } from "@/lib/data";

export default async function MunicipioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const municipio = await getMunicipio(id);
  if (!municipio) notFound();

  const porCargo = new Map<string, { nome: string; ano: number; resultados: typeof municipio.resultados }>();
  for (const r of municipio.resultados) {
    const atual = porCargo.get(r.candidato.cargo.id);
    if (atual) {
      atual.resultados.push(r);
    } else {
      porCargo.set(r.candidato.cargo.id, {
        nome: r.candidato.cargo.nome,
        ano: r.candidato.cargo.eleicao.ano,
        resultados: [r],
      });
    }
  }
  const cargosOrdenados = Array.from(porCargo.values()).sort(
    (a, b) => b.ano - a.ano || a.nome.localeCompare(b.nome, "pt-BR")
  );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{municipio.nome}</h1>
            <p className="text-sm text-neutral-500">{municipio.regiao.nome}</p>
          </div>
          <PdfDownloadLink href={`/api/pdf/municipio/${municipio.id}`} />
        </div>
        <p className="mt-2 text-2xl font-bold text-amber-400">
          {municipio.eleitores.toLocaleString("pt-BR")} eleitores aptos
          {municipio.anoEleitorado ? ` (${municipio.anoEleitorado})` : ""}
        </p>
        {municipio.populacao != null && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
              <p className="text-lg font-semibold">{municipio.populacao.toLocaleString("pt-BR")}</p>
              <p className="text-[11px] text-neutral-500">Habitantes (Censo 2022)</p>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
              <p className="text-lg font-semibold">
                {((municipio.eleitores / municipio.populacao) * 100).toLocaleString("pt-BR", {
                  maximumFractionDigits: 1,
                })}
                %
              </p>
              <p className="text-[11px] text-neutral-500">da população é eleitora</p>
            </div>
          </div>
        )}
      </section>

      {cargosOrdenados.map((grupo) => (
        <section key={`${grupo.nome}-${grupo.ano}`} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            {grupo.nome} · {grupo.ano}
          </h2>
          {grupo.resultados.map((r) => (
            <CardLink key={r.id} href={`/candidatos/${r.candidato.id}`}>
              <div>
                <p>{r.candidato.nome}</p>
                <p className="text-xs text-neutral-500">
                  {r.candidato.numero} · {r.candidato.partido.sigla}
                </p>
              </div>
              <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
            </CardLink>
          ))}
        </section>
      ))}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Distribuição por colégio eleitoral</h2>
        {municipio.colegiosEleitorais.length > 0 ? (
          municipio.colegiosEleitorais.map((c) => (
            <div
              key={c.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              {c.nome}
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-6 py-8 text-center">
            <School className="text-neutral-600" size={22} />
            <p className="text-sm text-neutral-400">
              Ainda não há dados por colégio eleitoral neste município.
            </p>
            <p className="text-xs text-neutral-600">
              Essa granularidade chega com a importação oficial do TSE.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
