import Link from "next/link";
import { notFound } from "next/navigation";
import { School } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { getMunicipioFicha, getEleitosDoMunicipio, getLocaisDoMunicipio } from "@/lib/data";

export default async function MunicipioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const municipio = await getMunicipioFicha(id);
  if (!municipio) notFound();
  const [eleitos, locaisInfo] = await Promise.all([
    getEleitosDoMunicipio(id),
    getLocaisDoMunicipio(id),
  ]);
  const { referencia, locais } = locaisInfo;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{municipio.nome}</h1>
            <p className="text-sm text-neutral-500">
              {municipio.regiao.nome}
              {municipio.gentilico ? ` · gentílico: ${municipio.gentilico}` : ""}
            </p>
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

      {(municipio.historia || municipio.areaKm2 != null || municipio.anoCriacao != null) && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Sobre o município</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {municipio.anoCriacao != null && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
                <p className="text-lg font-semibold">{municipio.anoCriacao}</p>
                <p className="text-[11px] text-neutral-500">Criação do município</p>
              </div>
            )}
            {municipio.areaKm2 != null && (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
                <p className="text-lg font-semibold">
                  {municipio.areaKm2.toLocaleString("pt-BR", { maximumFractionDigits: 0 })} km²
                </p>
                <p className="text-[11px] text-neutral-500">Área territorial</p>
              </div>
            )}
            {municipio.areaKm2 != null && municipio.populacao != null && (
              <div className="col-span-2 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center sm:col-span-1">
                <p className="text-lg font-semibold">
                  {(municipio.populacao / municipio.areaKm2).toLocaleString("pt-BR", {
                    maximumFractionDigits: 1,
                  })}
                </p>
                <p className="text-[11px] text-neutral-500">hab./km² (densidade)</p>
              </div>
            )}
          </div>
          {municipio.historia && (
            <p className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-sm leading-relaxed text-neutral-300">
              {municipio.historia}
            </p>
          )}
          <p className="text-right text-[10px] text-neutral-600">Fonte: IBGE Cidades</p>
        </section>
      )}

      {eleitos?.prefeito && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Prefeito eleito · {eleitos.ano}
          </h2>
          <CardLink href={`/candidatos/${eleitos.prefeito.id}`}>
            <div>
              <p className="font-medium">{eleitos.prefeito.nome}</p>
              <p className="text-xs text-neutral-500">
                {eleitos.prefeito.numero} · {eleitos.prefeito.partidoSigla}
                {eleitos.prefeito.viceNome ? ` · Vice: ${eleitos.prefeito.viceNome}` : ""}
              </p>
            </div>
            <span className="text-sm font-semibold text-amber-400">
              {eleitos.prefeito.votos.toLocaleString("pt-BR")}
            </span>
          </CardLink>
        </section>
      )}

      {eleitos && eleitos.vereadores.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-neutral-400">
              Vereadores eleitos · {eleitos.ano} ({eleitos.vereadores.length})
            </h2>
            {eleitos.cargoVereadorId && (
              <Link
                href={`/disputas/${eleitos.cargoVereadorId}`}
                className="text-xs text-amber-400 hover:underline"
              >
                Ver todos os candidatos
              </Link>
            )}
          </div>
          {eleitos.vereadores.map((v, i) => (
            <CardLink key={v.id} href={`/candidatos/${v.id}`}>
              <div className="flex items-center gap-3">
                <span className="w-6 text-right text-xs text-neutral-600">{i + 1}º</span>
                <div>
                  <p className="text-sm font-medium">{v.nome}</p>
                  <p className="text-xs text-neutral-500">
                    {v.numero} · {v.partidoSigla}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-amber-400">
                {v.votos.toLocaleString("pt-BR")}
              </span>
            </CardLink>
          ))}
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Locais de votação ({locais.length})
        </h2>
        {locais.length > 0 ? (
          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
              <span className="text-sm font-medium">Ver votação por local (escola/colégio)</span>
              <span className="text-xs text-neutral-500">
                {locais.reduce((s, l) => s + l.votos, 0).toLocaleString("pt-BR")} votos
                {referencia ? ` para ${referencia.cargo} (${referencia.ano})` : " detalhados"}
              </span>
            </summary>
            <div className="mt-2 flex max-h-96 flex-col gap-1.5 overflow-y-auto pr-1">
              {locais.map((l) => (
                <CardLink key={l.id} href={`/locais/${l.id}`}>
                  <p className="min-w-0 flex-1 truncate text-sm">{l.nome}</p>
                  <span className="ml-2 shrink-0 text-sm font-semibold text-amber-400">
                    {l.votos.toLocaleString("pt-BR")}
                  </span>
                </CardLink>
              ))}
            </div>
          </details>
        ) : (
          <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-6 py-8 text-center">
            <School className="text-neutral-600" size={22} />
            <p className="text-sm text-neutral-400">
              Ainda não há votação por local importada para este município.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
