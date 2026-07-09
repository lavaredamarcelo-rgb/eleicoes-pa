import Link from "next/link";
import { notFound } from "next/navigation";
import { getLocalVotacao } from "@/lib/data";

const LIMITE_POR_CARGO = 30;

export default async function LocalVotacaoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const local = await getLocalVotacao(id);
  if (!local) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Local de votação
        </p>
        <h1 className="text-lg font-semibold">{local.nome}</h1>
        <Link
          href={`/municipios/${local.municipioId}`}
          className="text-sm text-amber-400 hover:underline"
        >
          {local.municipioNome}
        </Link>
      </div>

      {local.grupos.map((g) => (
        <section key={`${g.ano}-${g.cargoNome}-${g.turno}`} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            {g.cargoNome} · {g.ano}
            {g.turno > 1 ? ` · ${g.turno}º turno` : ""} —{" "}
            {g.candidatos.reduce((s, c) => s + c.votos, 0).toLocaleString("pt-BR")} votos aqui
          </h2>
          {g.candidatos.slice(0, LIMITE_POR_CARGO).map((c, i) => (
            <Link
              key={c.id}
              href={`/candidatos/${c.id}`}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 text-right text-xs text-neutral-600">{i + 1}º</span>
                <div>
                  <p className="text-sm">
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
          {g.candidatos.length > LIMITE_POR_CARGO && (
            <p className="text-xs text-neutral-600">
              Mostrando os {LIMITE_POR_CARGO} mais votados de {g.candidatos.length} candidatos
              com voto neste local.
            </p>
          )}
        </section>
      ))}
      {local.grupos.length === 0 && (
        <p className="text-sm text-neutral-500">Sem votação detalhada importada para este local.</p>
      )}
    </div>
  );
}
