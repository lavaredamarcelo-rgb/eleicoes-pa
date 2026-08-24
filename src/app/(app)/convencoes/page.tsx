import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { ConvencaoCard } from "@/components/ConvencaoCard";
import { NovaConvencaoPartido } from "@/components/NovaConvencaoPartido";
import { CandidatosTSE } from "@/components/CandidatosTSE";

export default async function ConvencoesPage() {
  const session = await verifySession();
  const podeEditar = session.role === "ADMIN";

  const [partidos, convencoes, candidatos] = await Promise.all([
    prisma.partido.findMany({ orderBy: { sigla: "asc" } }),
    prisma.convencao.findMany(),
    prisma.candidato.findMany({
      include: { partido: true, cargo: true },
    }),
  ]);

  const convencaoPorPartido = new Map(convencoes.map((c) => [c.partidoId, c]));

  // Partidos com convenção aparecem primeiro
  const comMovimento = partidos.filter((p) => convencaoPorPartido.has(p.id));
  const semMovimento = partidos.filter((p) => !convencaoPorPartido.has(p.id));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Convenções Partidárias · 2026</h1>
        <p className="text-sm text-neutral-500">
          Datas das convenções, pré-candidatos de cada partido e os nomes aprovados — que
          alimentam as simulações do Criar Cenário. A janela legal das convenções de 2026 foi de
          20/07 a 05/08 (art. 8º, Lei 9.504/97).
        </p>
      </div>


      <CandidatosTSE candidatos={candidatos} />

      <section className="flex flex-col gap-3">
        {comMovimento.map((p) => (
          <ConvencaoCard
            key={p.id}
            partido={{
              id: p.id,
              sigla: p.sigla,
              federacao: p.federacao,
              presidenteEstadualPA: p.presidenteEstadualPA,
            }}
            convencao={convencaoPorPartido.get(p.id) ?? null}
            preCandidatos={[]}
            podeEditar={podeEditar}
          />
        ))}
      </section>

      {podeEditar && (
        <NovaConvencaoPartido
          partidos={semMovimento.map((p) => ({ id: p.id, sigla: p.sigla }))}
        />
      )}

      <p className="text-xs text-neutral-600">
        Dados iniciais pesquisados na imprensa e na Wikipédia em 06/08/2026 — confira e ajuste
        pelo próprio painel; inclusões manuais têm o mesmo peso nas simulações.
      </p>
    </div>
  );
}
