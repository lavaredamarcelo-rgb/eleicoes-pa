import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

// Página enxuta acessada pelo drill-down da Início: mostra só a votação de
// cada candidato daquele cargo no município escolhido, separada por turno.
export default async function DisputaMunicipioPage({
  params,
  searchParams,
}: {
  params: Promise<{ cargoId: string }>;
  searchParams: Promise<{ municipio?: string }>;
}) {
  const { cargoId } = await params;
  const { municipio: municipioId } = await searchParams;

  const cargo = await prisma.cargo.findUnique({
    where: { id: cargoId },
    include: { eleicao: true, municipio: true },
  });
  if (!cargo) notFound();

  const municipioFiltro = cargo.municipioId ?? municipioId ?? null;
  const municipio = municipioFiltro
    ? await prisma.municipio.findUnique({ where: { id: municipioFiltro } })
    : null;

  const candidatos = await prisma.candidato.findMany({
    where: { cargoId },
    include: {
      partido: true,
      resultados: municipioFiltro ? { where: { municipioId: municipioFiltro } } : true,
    },
  });

  const turnosPresentes = Array.from(
    new Set(candidatos.flatMap((c) => c.resultados.map((r) => r.turno)))
  ).sort();

  const porTurno = turnosPresentes.map((turno) => {
    const ranking = candidatos
      .map((c) => ({
        id: c.id,
        nome: c.nome,
        numero: c.numero,
        partidoSigla: c.partido.sigla,
        eleito: c.eleito,
        votos: c.resultados.filter((r) => r.turno === turno).reduce((s, r) => s + r.votos, 0),
      }))
      .filter((c) => c.votos > 0)
      .sort((a, b) => b.votos - a.votos);
    return { turno, ranking, total: ranking.reduce((s, c) => s + c.votos, 0) };
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Votação por candidato
        </p>
        <h1 className="text-lg font-semibold">
          {cargo.nome} <span className="text-neutral-500">· {cargo.eleicao.ano}</span>
        </h1>
        <p className="text-sm text-neutral-500">{municipio ? municipio.nome : "Pará (estadual)"}</p>
      </div>

      {porTurno.map(({ turno, ranking, total }) => (
        <section key={turno} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            {porTurno.length > 1 ? `${turno}º turno` : "Apuração"} ·{" "}
            {total.toLocaleString("pt-BR")} votos nominais
          </h2>
          {ranking.map((c, i) => (
            <Link
              key={c.id}
              href={`/candidatos/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2.5 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 text-right text-xs text-neutral-600">{i + 1}º</span>
                <div>
                  <p className="text-sm font-medium">
                    {c.nome}
                    {c.eleito && (
                      <span className="ml-2 rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                        Eleito
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {c.numero} · {c.partidoSigla}
                  </p>
                </div>
              </div>
              <span className="text-sm font-semibold text-amber-400">
                {c.votos.toLocaleString("pt-BR")}
              </span>
            </Link>
          ))}
        </section>
      ))}
      {porTurno.length === 0 && (
        <p className="text-sm text-neutral-500">Nenhum voto registrado nesse recorte.</p>
      )}
    </div>
  );
}
