import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { CountUp } from "@/components/CountUp";
import { getPartido } from "@/lib/data";

export default async function PartidoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const partido = await getPartido(id);
  if (!partido) notFound();

  const totalVotos = partido.candidatos.reduce((s, c) => s + c.votos, 0);
  const figuras = partido.figurasNotaveis
    ? partido.figurasNotaveis.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

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
        <p className="mt-2 text-xl font-bold text-amber-400">
          <CountUp value={totalVotos} /> votos no total
        </p>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <InfoCard label="Presidente nacional" value={partido.presidenteNacional} />
        <InfoCard label="Presidente estadual (PA)" value={partido.presidenteEstadualPA} />
        <InfoCard label="Espectro ideológico" value={partido.espectro} />
        <InfoCard label="Fundação" value={partido.fundacao ? String(partido.fundacao) : null} />
      </section>

      {partido.federacao && partido.membrosFederacao.length > 0 && (
        <section className="rounded-xl border border-orange-900/50 bg-orange-950/10 px-4 py-3">
          <p className="text-sm font-medium text-orange-300">
            Federação {partido.federacao}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            Atua nas eleições como um único partido, unindo:{" "}
            {partido.membrosFederacao.join(", ")}
          </p>
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
          Candidatos no sistema ({partido.candidatos.length})
        </h2>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
          {partido.candidatos.map((c) => (
            <CardLink key={c.id} href={`/candidatos/${c.id}`}>
              <div>
                <p className="font-medium">{c.nome}</p>
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
