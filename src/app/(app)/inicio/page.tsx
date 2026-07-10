import { Map } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { CountUp } from "@/components/CountUp";
import { DisputasPorAno } from "@/components/DisputasPorAno";
import { GraficoBarras } from "@/components/GraficoBarras";
import {
  getHierarquiaDisputas,
  getVotosValidosPorAno,
  getEleitoradoEstadoPorAno,
  getEleitoradoAtual,
  getTotalEleitosComMandato,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function InicioPage() {
  const [hierarquia, votosPorAno, eleitoradoPorAno, eleitoradoAtual, eleitosComMandato, totalMunicipios] =
    await Promise.all([
      getHierarquiaDisputas(),
      getVotosValidosPorAno(),
      getEleitoradoEstadoPorAno(),
      getEleitoradoAtual(),
      getTotalEleitosComMandato(),
      prisma.municipio.count(),
    ]);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold">Resumo geral</h1>
        <p className="text-sm text-neutral-500">Pará</p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard
          label={eleitoradoAtual ? `Eleitores aptos (${eleitoradoAtual.ano})` : "Eleitores aptos"}
          value={<CountUp value={eleitoradoAtual?.total ?? 0} />}
        />
        <StatCard label="Municípios" value={<CountUp value={totalMunicipios} />} />
        <StatCard label="Eleitos com mandato" value={<CountUp value={eleitosComMandato} />} />
      </section>

      <CardLink href="/mapa" className="bg-gradient-to-r from-amber-950/60 to-neutral-900">
        <div className="flex items-center gap-3">
          <Map className="text-amber-400" size={20} />
          <div>
            <p className="font-medium">Ver mapa do Pará</p>
            <p className="text-xs text-neutral-500">Projeção de eleitores por município e região</p>
          </div>
        </div>
      </CardLink>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-400">Disputas cadastradas</h2>
        <DisputasPorAno anos={hierarquia} />
      </section>

      <section className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <GraficoBarras
          titulo="Eleitorado do Pará"
          subtitulo={`Total de eleitores por ano, com projeção para a próxima eleição${
            eleitoradoPorAno.find((p) => p.projetado)
              ? ` (${eleitoradoPorAno.find((p) => p.projetado)!.ano})`
              : ""
          }`}
          pontos={eleitoradoPorAno.map((p) => ({ rotulo: String(p.ano), valor: p.total, projetado: p.projetado }))}
        />
        <GraficoBarras
          titulo="Votos válidos por eleição"
          subtitulo="Votos nominais válidos no Pará (referência: Vereador/Dep. Estadual)"
          pontos={votosPorAno.map((p) => ({ rotulo: String(p.ano), valor: p.total }))}
        />
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center transition-colors duration-150 hover:border-neutral-700">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}
