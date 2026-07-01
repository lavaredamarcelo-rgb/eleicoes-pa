import { Map } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { getCargos } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export default async function InicioPage() {
  const [cargos, totalMunicipios, totalCandidatos, totalVotosRow] = await Promise.all([
    getCargos(),
    prisma.municipio.count(),
    prisma.candidato.count(),
    prisma.resultado.aggregate({ _sum: { votos: true } }),
  ]);

  const totalVotos = totalVotosRow._sum.votos ?? 0;

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold">Resumo geral</h1>
        <p className="text-sm text-neutral-500">Pará · dados de demonstração</p>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <StatCard label="Votos apurados" value={totalVotos.toLocaleString("pt-BR")} />
        <StatCard label="Municípios" value={String(totalMunicipios)} />
        <StatCard label="Candidatos" value={String(totalCandidatos)} />
      </section>

      <CardLink href="/mapa" className="bg-gradient-to-r from-blue-950/60 to-neutral-900">
        <div className="flex items-center gap-3">
          <Map className="text-blue-400" size={20} />
          <div>
            <p className="font-medium">Ver mapa do Pará</p>
            <p className="text-xs text-neutral-500">Votos por município e por região</p>
          </div>
        </div>
      </CardLink>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-400">Disputas cadastradas</h2>
        {cargos.map((cargo) => (
          <CardLink key={cargo.id} href={`/quociente/${cargo.id}`}>
            <div>
              <p className="font-medium">{cargo.nome}</p>
              <p className="text-xs text-neutral-500">
                {cargo.eleicao.tipo === "ESTADUAL" ? "Estadual" : "Municipal"} · {cargo.eleicao.ano}
                {cargo.municipio ? ` · ${cargo.municipio.nome}` : " · PA"}
              </p>
            </div>
            <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
              {cargo.tipoApuracao === "PROPORCIONAL" ? `${cargo.vagas} vagas` : "Majoritário"}
            </span>
          </CardLink>
        ))}
      </section>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center transition-colors duration-150 hover:border-neutral-700">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}
