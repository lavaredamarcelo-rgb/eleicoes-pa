import { notFound } from "next/navigation";
import Link from "next/link";
import { getMunicipio } from "@/lib/data";

export default async function MunicipioDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const municipio = await getMunicipio(id);
  if (!municipio) notFound();

  const totalVotos = municipio.resultados.reduce((sum, r) => sum + r.votos, 0);

  const porCargo = new Map<string, { nome: string; resultados: typeof municipio.resultados }>();
  for (const r of municipio.resultados) {
    const atual = porCargo.get(r.candidato.cargo.id);
    if (atual) {
      atual.resultados.push(r);
    } else {
      porCargo.set(r.candidato.cargo.id, { nome: r.candidato.cargo.nome, resultados: [r] });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold">{municipio.nome}</h1>
        <p className="text-sm text-neutral-500">{municipio.regiao.nome}</p>
        <p className="mt-2 text-2xl font-bold text-blue-400">
          {totalVotos.toLocaleString("pt-BR")} votos
        </p>
      </section>

      {Array.from(porCargo.values()).map((grupo) => (
        <section key={grupo.nome} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">{grupo.nome}</h2>
          {grupo.resultados.map((r) => (
            <Link
              key={r.id}
              href={`/candidatos/${r.candidato.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
            >
              <div>
                <p>{r.candidato.nome}</p>
                <p className="text-xs text-neutral-500">
                  {r.candidato.numero} · {r.candidato.partido.sigla}
                </p>
              </div>
              <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
            </Link>
          ))}
        </section>
      ))}
    </div>
  );
}
