import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { ConvencaoCard } from "@/components/ConvencaoCard";
import { NovaConvencaoPartido } from "@/components/NovaConvencaoPartido";

const ORDEM_CARGOS = ["Governador", "Vice-Governador", "Senador", "Deputado Federal", "Deputado Estadual"];

export default async function ConvencoesPage() {
  const session = await verifySession();
  const podeEditar = session.role === "ADMIN";

  const [partidos, convencoes, preCandidatos] = await Promise.all([
    prisma.partido.findMany({ orderBy: { sigla: "asc" } }),
    prisma.convencao.findMany(),
    prisma.preCandidato.findMany({ orderBy: [{ cargo: "asc" }, { nome: "asc" }] }),
  ]);

  const convencaoPorPartido = new Map(convencoes.map((c) => [c.partidoId, c]));
  const preCandidatosPorPartido = new Map<string, typeof preCandidatos>();
  for (const pc of preCandidatos) {
    const lista = preCandidatosPorPartido.get(pc.partidoId);
    if (lista) lista.push(pc);
    else preCandidatosPorPartido.set(pc.partidoId, [pc]);
  }

  // Partidos com convenção ou pré-candidatos aparecem primeiro.
  const partidoById = new Map(partidos.map((p) => [p.id, p]));
  const comMovimento = partidos.filter(
    (p) => convencaoPorPartido.has(p.id) || preCandidatosPorPartido.has(p.id)
  );
  const semMovimento = partidos.filter(
    (p) => !convencaoPorPartido.has(p.id) && !preCandidatosPorPartido.has(p.id)
  );

  const aprovados = preCandidatos.filter((pc) => pc.situacao === "APROVADO");
  const aprovadosPorCargo = ORDEM_CARGOS.map((cargo) => ({
    cargo,
    nomes: aprovados
      .filter((pc) => pc.cargo === cargo)
      .map((pc) => ({ nome: pc.nome, sigla: partidoById.get(pc.partidoId)?.sigla ?? "?" })),
  })).filter((g) => g.nomes.length > 0);

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

      {aprovadosPorCargo.length > 0 && (
        <section className="flex flex-col gap-2 rounded-xl border border-emerald-900/50 bg-emerald-950/10 p-4">
          <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-300">
            <CheckCircle2 size={15} />
            Aprovados nas convenções
          </p>
          {aprovadosPorCargo.map((g) => (
            <div key={g.cargo} className="flex flex-wrap items-center gap-1.5">
              <span className="w-36 shrink-0 text-xs text-neutral-500">{g.cargo}</span>
              {g.nomes.map((n) => (
                <span
                  key={`${n.nome}-${n.sigla}`}
                  className="rounded-full bg-neutral-900 px-2.5 py-1 text-xs text-neutral-200"
                >
                  {n.nome} <span className="text-neutral-500">({n.sigla})</span>
                </span>
              ))}
            </div>
          ))}
          <p className="text-xs text-neutral-600">
            Esses nomes aparecem como sugestões ao montar cenários no{" "}
            <Link href="/criar-cenario" className="text-amber-400 underline hover:text-amber-300">
              Criar Cenário
            </Link>
            .
          </p>
        </section>
      )}

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
            preCandidatos={(preCandidatosPorPartido.get(p.id) ?? []).map((pc) => ({
              id: pc.id,
              nome: pc.nome,
              cargo: pc.cargo,
              situacao: pc.situacao,
              origem: pc.origem,
              observacoes: pc.observacoes,
            }))}
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
