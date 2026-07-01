import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { getCandidato } from "@/lib/data";

export default async function CandidatoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  const totalVotos = candidato.resultados.reduce((sum, r) => sum + r.votos, 0);

  const votosPorRegiao = new Map<string, { nome: string; votos: number }>();
  const resultadosPorRegiao = new Map<string, typeof candidato.resultados>();
  for (const r of candidato.resultados) {
    const regiao = r.municipio.regiao;
    const atual = votosPorRegiao.get(regiao.id);
    if (atual) {
      atual.votos += r.votos;
      resultadosPorRegiao.get(regiao.id)!.push(r);
    } else {
      votosPorRegiao.set(regiao.id, { nome: regiao.nome, votos: r.votos });
      resultadosPorRegiao.set(regiao.id, [r]);
    }
  }
  const regioesOrdenadas = Array.from(votosPorRegiao.entries()).sort(
    (a, b) => b[1].votos - a[1].votos
  );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold">{candidato.nome}</h1>
        <p className="text-sm text-neutral-500">
          {candidato.numero} · {candidato.partido.sigla} · {candidato.cargo.nome}
          {candidato.cargo.municipio ? ` (${candidato.cargo.municipio.nome})` : " (PA)"}
        </p>
        <p className="mt-2 text-2xl font-bold text-blue-400">
          {totalVotos.toLocaleString("pt-BR")} votos
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Votos por região</h2>
        {regioesOrdenadas.map(([regiaoId, r]) => (
          <div
            key={regiaoId}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
          >
            <span>{r.nome}</span>
            <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Votos por município</h2>
        {regioesOrdenadas.map(([regiaoId, r]) => (
          <details key={regiaoId} className="group" open={regioesOrdenadas.length <= 1}>
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
              <span className="font-medium">{r.nome}</span>
              <span className="text-xs text-neutral-500">
                {resultadosPorRegiao.get(regiaoId)!.length} municípios
              </span>
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              {resultadosPorRegiao.get(regiaoId)!.map((res) => (
                <CardLink key={res.id} href={`/municipios/${res.municipio.id}`}>
                  <p>{res.municipio.nome}</p>
                  <span className="text-sm font-medium">
                    {res.votos.toLocaleString("pt-BR")}
                  </span>
                </CardLink>
              ))}
            </div>
          </details>
        ))}
      </section>
    </div>
  );
}
