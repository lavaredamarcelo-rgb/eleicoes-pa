import { notFound } from "next/navigation";
import Link from "next/link";
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
  for (const r of candidato.resultados) {
    const regiao = r.municipio.regiao;
    const atual = votosPorRegiao.get(regiao.id);
    if (atual) {
      atual.votos += r.votos;
    } else {
      votosPorRegiao.set(regiao.id, { nome: regiao.nome, votos: r.votos });
    }
  }
  const regioesOrdenadas = Array.from(votosPorRegiao.values()).sort((a, b) => b.votos - a.votos);

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
        {regioesOrdenadas.map((r) => (
          <div
            key={r.nome}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
          >
            <span>{r.nome}</span>
            <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Votos por município</h2>
        {candidato.resultados.map((r) => (
          <Link
            key={r.id}
            href={`/municipios/${r.municipio.id}`}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
          >
            <div>
              <p>{r.municipio.nome}</p>
              <p className="text-xs text-neutral-500">{r.municipio.regiao.nome}</p>
            </div>
            <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
