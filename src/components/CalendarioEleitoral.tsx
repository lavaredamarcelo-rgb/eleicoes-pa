import { CalendarClock, Check } from "lucide-react";
import { classificarMarcos } from "@/lib/calendario2026";

const MESES = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

function dataCurta(iso: string) {
  const [, m, d] = iso.split("-");
  return `${Number(d)} ${MESES[Number(m) - 1]}`;
}

// Linha do tempo do calendário eleitoral 2026 (Res. TSE 23.760/2026):
// prazos passados ficam esmaecidos com ✓, o período em curso e o próximo
// prazo ganham destaque.
export function CalendarioEleitoral() {
  const marcos = classificarMarcos();
  const destaque = marcos.find((m) => m.status === "emCurso") ?? marcos.find((m) => m.status === "proximo");

  return (
    <section className="flex flex-col gap-2 rounded-2xl border border-neutral-800 bg-neutral-900 p-4">
      <div className="flex items-center gap-2">
        <CalendarClock size={16} className="text-amber-400" />
        <h2 className="text-sm font-medium text-neutral-200">Calendário eleitoral 2026</h2>
      </div>

      {destaque && (
        <div className="rounded-xl border border-amber-800/60 bg-amber-950/30 px-3 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-400">
            {destaque.status === "emCurso" ? "Em curso" : "Próximo prazo"} ·{" "}
            {dataCurta(destaque.inicio)}
            {destaque.fim ? ` a ${dataCurta(destaque.fim)}` : ""}
          </p>
          <p className="text-sm font-medium text-amber-100">{destaque.titulo}</p>
          <p className="text-xs text-neutral-400">{destaque.descricao}</p>
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer list-none py-1 text-xs text-neutral-500 hover:text-neutral-300">
          Ver todas as datas ▾
        </summary>
        <div className="mt-1 flex flex-col">
          {marcos.map((m) => (
            <div
              key={m.inicio + m.titulo}
              className={`flex gap-3 border-l-2 py-2 pl-3 ${
                m.status === "passado"
                  ? "border-neutral-800 opacity-50"
                  : m.status === "futuro"
                    ? "border-neutral-700"
                    : "border-amber-500"
              }`}
            >
              <span className="w-20 shrink-0 text-xs font-semibold text-neutral-400">
                {dataCurta(m.inicio)}
                {m.fim ? ` –${dataCurta(m.fim)}` : ""}
              </span>
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-medium text-neutral-200">
                  {m.titulo}
                  {m.status === "passado" && <Check size={12} className="text-neutral-600" />}
                </p>
                <p className="text-[11px] text-neutral-500">{m.descricao}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-1 text-right text-[10px] text-neutral-600">
          Fonte: Resolução TSE nº 23.760/2026
        </p>
      </details>
    </section>
  );
}
