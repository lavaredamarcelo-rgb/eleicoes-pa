import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { GraficoBarras } from "@/components/GraficoBarras";
import { getPartido } from "@/lib/data";

const LIMITE_CANDIDATOS = 24;

export default async function PartidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partido = await getPartido(id);
  if (!partido) notFound();

  const figuras = partido.figurasNotaveis
    ? partido.figurasNotaveis.split(",").map((s) => s.trim()).filter(Boolean)
    : [];
  const anosComVotos = partido.desempenhoPorAno.filter((d) => d.votos > 0);
  const ultimaEleicao = anosComVotos[anosComVotos.length - 1];
  const totalMandatos = partido.ambitos.federal + partido.ambitos.estadual + partido.ambitos.municipal;
  const maisVotados = partido.candidatos.slice(0, LIMITE_CANDIDATOS);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">{partido.sigla}</h1>
          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
            nº {partido.numero}
          </span>
          {partido.federacao && (
            <span className="rounded-full bg-orange-950 px-2 py-0.5 text-xs font-medium text-orange-300">
              Federação {partido.federacao}
            </span>
          )}
        </div>
        <p className="text-sm text-neutral-500">{partido.nome}</p>
        {ultimaEleicao && (
          <p className="mt-2 text-xl font-bold text-amber-400">
            {ultimaEleicao.votos.toLocaleString("pt-BR")} votos em {ultimaEleicao.ano}
          </p>
        )}
      </section>

      <section className="grid grid-cols-2 gap-3">
        <InfoCard label="Presidente nacional" value={partido.presidenteNacional} />
        <InfoCard label="Presidente estadual (PA)" value={partido.presidenteEstadualPA} />
        <InfoCard label="Espectro ideológico" value={partido.espectro} />
        <InfoCard label="Fundação" value={partido.fundacao ? String(partido.fundacao) : null} />
      </section>

      {partido.federacao && partido.membrosFederacao.length > 0 && (
        <section className="rounded-xl border border-orange-900/50 bg-orange-950/10 px-4 py-3">
          <p className="text-sm font-medium text-orange-300">Federação {partido.federacao}</p>
          <p className="mt-1 text-xs text-neutral-400">
            Atua nas eleições como um único partido, unindo: {partido.membrosFederacao.join(", ")}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Representatividade com mandato vigente ({totalMandatos} eleito{totalMandatos !== 1 ? "s" : ""})
        </h2>
        <div className="grid grid-cols-3 gap-3">
          <AmbitoCard label="Federal" qtd={partido.ambitos.federal} descricao="Senador e Dep. Federal" />
          <AmbitoCard label="Estadual" qtd={partido.ambitos.estadual} descricao="Governador e Dep. Estadual" />
          <AmbitoCard label="Municipal" qtd={partido.ambitos.municipal} descricao="Prefeitos e Vereadores" />
        </div>
        {partido.detalheAmbito.length > 0 && (
          <p className="text-xs text-neutral-600">
            {partido.detalheAmbito
              .map((d) => `${d.qtd} ${d.cargo}${d.qtd !== 1 && !d.cargo.endsWith("l") ? "s" : ""}`)
              .join(" · ")}
          </p>
        )}
      </section>

      {anosComVotos.length > 0 && (
        <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
          <GraficoBarras
            titulo="Votos por eleição"
            subtitulo="Votos nominais válidos do partido no Pará"
            pontos={anosComVotos.map((d) => ({ rotulo: String(d.ano), valor: d.votos }))}
          />
          <GraficoBarras
            titulo="Eleitos por eleição"
            subtitulo="Candidatos do partido eleitos em cada ano"
            pontos={partido.desempenhoPorAno
              .filter((d) => d.candidatos > 0)
              .map((d) => ({ rotulo: String(d.ano), valor: d.eleitos }))}
          />
        </section>
      )}

      {partido.desempenhoPorAno.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Desempenho por eleição</h2>
          {[...partido.desempenhoPorAno].reverse().map((d) => (
            <div
              key={d.ano}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5"
            >
              <span className="font-medium">{d.ano}</span>
              <span className="text-xs text-neutral-500">
                {d.candidatos.toLocaleString("pt-BR")} candidato{d.candidatos !== 1 ? "s" : ""} ·{" "}
                {d.eleitos} eleito{d.eleitos !== 1 ? "s" : ""}
              </span>
              <span className="text-sm font-semibold text-amber-400">
                {d.votos.toLocaleString("pt-BR")} votos
              </span>
            </div>
          ))}
        </section>
      )}

      {figuras.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Figuras políticas notáveis</h2>
          <div className="flex flex-wrap gap-2">
            {figuras.map((f) => (
              <span
                key={f}
                className="rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1.5 text-sm text-neutral-200"
              >
                {f}
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Candidatos mais votados
          {partido.candidatos.length > LIMITE_CANDIDATOS
            ? ` (${LIMITE_CANDIDATOS} de ${partido.candidatos.length.toLocaleString("pt-BR")})`
            : ` (${partido.candidatos.length})`}
        </h2>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
          {maisVotados.map((c) => (
            <CardLink key={c.id} href={`/candidatos/${c.id}`}>
              <div>
                <p className="flex items-center gap-2 font-medium">
                  {c.nome}
                  {c.eleito && (
                    <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Eleito
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-500">
                  {c.numero} · {c.cargo.nome}
                  {c.cargo.municipio ? ` · ${c.cargo.municipio.nome}` : " · PA"} ·{" "}
                  {c.cargo.eleicao.ano}
                </p>
              </div>
              <span className="text-sm font-semibold text-amber-400">
                {c.votos.toLocaleString("pt-BR")}
              </span>
            </CardLink>
          ))}
          {partido.candidatos.length === 0 && (
            <p className="text-sm text-neutral-500">Nenhum candidato importado ainda.</p>
          )}
        </div>
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3">
      <p className="text-[11px] text-neutral-500">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-neutral-200">
        {value ?? <span className="text-neutral-600">Não disponível</span>}
      </p>
    </div>
  );
}

function AmbitoCard({ label, qtd, descricao }: { label: string; qtd: number; descricao: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
      <p className="text-lg font-semibold text-amber-400">{qtd}</p>
      <p className="text-[11px] font-medium text-neutral-300">{label}</p>
      <p className="text-[10px] text-neutral-600">{descricao}</p>
    </div>
  );
}
