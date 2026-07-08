import { CardLink } from "@/components/CardLink";
import { GraficoBarras } from "@/components/GraficoBarras";
import { getPartidosComEstatisticas } from "@/lib/data";

export default async function PartidosPage() {
  const partidos = await getPartidosComEstatisticas();
  const ultimoAno = partidos[0]?.ultimoAno;
  const top10 = partidos.filter((p) => p.votosUltimaEleicao > 0).slice(0, 10);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Partidos Políticos</h1>
        <p className="text-sm text-neutral-500">
          Dados institucionais, lideranças e desempenho eleitoral de cada partido.
        </p>
      </div>

      <GraficoBarras
        titulo={ultimoAno ? `Votos por partido na eleição de ${ultimoAno}` : "Votos por partido"}
        subtitulo="Votos nominais válidos no Pará na eleição mais recente"
        pontos={top10.map((p) => ({ rotulo: p.sigla, valor: p.votosUltimaEleicao }))}
      />

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        {partidos.map((p) => (
          <CardLink key={p.id} href={`/partidos/${p.id}`}>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">{p.sigla}</p>
                {p.federacao && (
                  <span className="rounded-full bg-orange-950 px-2 py-0.5 text-[10px] font-medium text-orange-300">
                    Federação {p.federacao}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{p.nome}</p>
              {p.presidenteNacional && (
                <p className="text-xs text-neutral-600">Pres.: {p.presidenteNacional}</p>
              )}
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-amber-400">
                {p.votosUltimaEleicao.toLocaleString("pt-BR")}
              </p>
              <p className="text-[10px] text-neutral-600">
                votos em {p.ultimoAno ?? "—"} · {p.eleitosComMandato} com mandato
              </p>
            </div>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
