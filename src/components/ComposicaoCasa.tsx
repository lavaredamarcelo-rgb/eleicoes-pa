import Link from "next/link";

type CandidatoSituacao = {
  id: string;
  nome: string;
  numero: number;
  votos: number;
  situacao: "eleito" | "suplente";
  ordemSuplencia: number | null;
  partidoId: string;
  partidoSigla: string;
};

type Partido = { partidoId: string; sigla: string; cadeiras: number };

const LIMITE_SUPLENTES = 10;

// Composição da casa: barra por partido; abrir o partido mostra eleitos e
// suplentes em ordem de votação. Usa <details> nativo (sem JS).
export function ComposicaoCasa({
  partidos,
  candidatos,
}: {
  partidos: Partido[];
  candidatos: CandidatoSituacao[];
}) {
  const comCadeira = partidos.filter((p) => p.cadeiras > 0).sort((a, b) => b.cadeiras - a.cadeiras);
  const max = Math.max(...comCadeira.map((p) => p.cadeiras), 1);

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      {comCadeira.map((p) => {
        const doPartido = candidatos
          .filter((c) => c.partidoId === p.partidoId)
          .sort((a, b) => b.votos - a.votos);
        const eleitos = doPartido.filter((c) => c.situacao === "eleito");
        const suplentes = doPartido.filter((c) => c.situacao === "suplente");

        return (
          <details key={p.partidoId} className="group">
            <summary className="flex cursor-pointer list-none flex-col gap-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="text-neutral-500 transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {p.sigla}
                </span>
                <span className="text-neutral-400">
                  {p.cadeiras} {p.cadeiras === 1 ? "cadeira" : "cadeiras"}
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                <div
                  className="h-1.5 rounded-full bg-amber-400"
                  style={{ width: `${(p.cadeiras / max) * 100}%` }}
                />
              </div>
            </summary>

            <div className="mb-1 mt-2 flex flex-col gap-1.5 rounded-lg border border-neutral-800 bg-neutral-950 p-2.5">
              {eleitos.map((c) => (
                <LinhaCandidato key={c.id} c={c} destaque />
              ))}
              {suplentes.length > 0 && (
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-neutral-600">
                  Suplentes
                </p>
              )}
              {suplentes.slice(0, LIMITE_SUPLENTES).map((c) => (
                <LinhaCandidato key={c.id} c={c} />
              ))}
              {suplentes.length > LIMITE_SUPLENTES && (
                <p className="text-[11px] text-neutral-600">
                  + {suplentes.length - LIMITE_SUPLENTES} suplentes com menos votos.
                </p>
              )}
            </div>
          </details>
        );
      })}
      {comCadeira.length === 0 && (
        <p className="text-xs text-neutral-500">Nenhuma cadeira distribuída ainda.</p>
      )}
    </div>
  );
}

function LinhaCandidato({ c, destaque = false }: { c: CandidatoSituacao; destaque?: boolean }) {
  return (
    <Link
      href={`/candidatos/${c.id}`}
      className="flex items-center justify-between rounded-md px-2 py-1 text-xs transition-colors hover:bg-neutral-900"
    >
      <span className={destaque ? "text-neutral-100" : "text-neutral-400"}>
        {c.nome}
        {c.situacao === "eleito" ? (
          <span className="ml-2 rounded-full bg-emerald-950 px-1.5 py-0.5 text-[10px] font-medium text-emerald-300">
            Eleito
          </span>
        ) : (
          <span className="ml-2 text-[10px] text-neutral-600">{c.ordemSuplencia}º supl.</span>
        )}
      </span>
      <span className={`font-medium ${destaque ? "text-amber-400" : "text-neutral-500"}`}>
        {c.votos.toLocaleString("pt-BR")}
      </span>
    </Link>
  );
}
