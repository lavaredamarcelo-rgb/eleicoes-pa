import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import { federacaoDe } from "@/lib/eleitoral";
import { distribuirVagas } from "@/lib/simulacaoPartido";
import { votosDecisivos } from "@/lib/turnos";

// CENÁRIO SALVO × RESULTADO REAL: quão perto a simulação chegou do que
// as urnas disseram em 2026 — votos candidato a candidato, cadeiras por
// partido/federação e a taxa de acerto dos eleitos.
export default async function CenarioRealPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await verifySession();
  const { id } = await params;

  const cenario = await prisma.cenarioEleicao.findUnique({ where: { id } });
  if (!cenario || (cenario.userId !== String(session.userId) && session.role !== "ADMIN"))
    notFound();

  const cargo = await prisma.cargo.findFirst({
    where: { nome: cenario.cargoNome, eleicao: { ano: 2026 } },
    include: { eleicao: true },
  });
  if (!cargo) notFound();

  const bruto = JSON.parse(cenario.votos) as Record<string, number>;
  const votosCenario = new Map<number, number>();
  const legendaCenario = new Map<string, number>();
  for (const [k, v] of Object.entries(bruto)) {
    if (k.startsWith("legenda:")) legendaCenario.set(k.slice(8), v);
    else votosCenario.set(Number(k), v);
  }

  const candidatos = await prisma.candidato.findMany({
    where: { cargoId: cargo.id },
    include: { partido: true, resultados: true },
  });
  // Duplicatas de seed: fica a cópia com mais votos reais por número.
  const porNumero = new Map<number, (typeof candidatos)[number] & { votosReais: number }>();
  for (const c of candidatos) {
    const votosReais = votosDecisivos(c.resultados);
    const atual = porNumero.get(c.numero);
    if (!atual || votosReais > atual.votosReais || (c.eleito && !atual.eleito)) {
      porNumero.set(c.numero, { ...c, votosReais });
    }
  }

  const ano = cargo.eleicao.ano;
  const grupoDe = (sigla: string) => federacaoDe(ano, sigla) ?? sigla;

  // Cadeiras PREVISTAS pelo cenário: QE sobre os votos simulados
  // (nominais + legenda), agrupados por federação/partido.
  const partidos = await prisma.partido.findMany({ select: { id: true, sigla: true } });
  const siglaPorId = new Map(partidos.map((p) => [p.id, p.sigla]));
  const siglaValida = new Set(partidos.map((p) => p.sigla.toUpperCase()));

  const votosGrupoCenario = new Map<string, number>();
  for (const [numero, v] of votosCenario) {
    const cand = porNumero.get(numero);
    if (!cand) continue;
    const g = grupoDe(cand.partido.sigla);
    votosGrupoCenario.set(g, (votosGrupoCenario.get(g) ?? 0) + v);
  }
  for (const [chave, v] of legendaCenario) {
    const sigla = siglaValida.has(chave.toUpperCase()) ? chave : siglaPorId.get(chave);
    if (!sigla) continue;
    const g = grupoDe(sigla);
    votosGrupoCenario.set(g, (votosGrupoCenario.get(g) ?? 0) + v);
  }
  const totalCenario = [...votosGrupoCenario.values()].reduce((s, v) => s + v, 0);
  const qeCenario = cargo.vagas > 0 ? Math.floor(totalCenario / cargo.vagas) : 0;
  const cadeirasCenario = distribuirVagas(
    [...votosGrupoCenario.entries()].map(([partidoId, votos]) => ({ partidoId, votos })),
    cargo.vagas,
    qeCenario
  );

  // Eleitos PREVISTOS: os N mais votados (no cenário) de cada grupo.
  const candidatosPorGrupo = new Map<string, { numero: number; votos: number }[]>();
  for (const [numero, v] of votosCenario) {
    const cand = porNumero.get(numero);
    if (!cand) continue;
    const g = grupoDe(cand.partido.sigla);
    const lista = candidatosPorGrupo.get(g) ?? [];
    lista.push({ numero, votos: v });
    candidatosPorGrupo.set(g, lista);
  }
  const previstos = new Set<number>();
  for (const [g, lista] of candidatosPorGrupo) {
    lista
      .sort((x, y) => y.votos - x.votos)
      .slice(0, cadeirasCenario.get(g) ?? 0)
      .forEach((c) => previstos.add(c.numero));
  }

  const reais = new Set([...porNumero.values()].filter((c) => c.eleito).map((c) => c.numero));
  const acertos = [...previstos].filter((n) => reais.has(n));

  // Cadeiras reais por grupo (contagem oficial).
  const cadeirasReais = new Map<string, number>();
  for (const c of porNumero.values()) {
    if (!c.eleito) continue;
    const g = grupoDe(c.partido.sigla);
    cadeirasReais.set(g, (cadeirasReais.get(g) ?? 0) + 1);
  }
  const linhasGrupos = [...new Set([...cadeirasCenario.keys(), ...cadeirasReais.keys()])]
    .map((g) => ({
      grupo: g,
      previsto: cadeirasCenario.get(g) ?? 0,
      real: cadeirasReais.get(g) ?? 0,
    }))
    .filter((l) => l.previsto > 0 || l.real > 0)
    .sort((x, y) => y.real - x.real || y.previsto - x.previsto);

  // Candidato a candidato (só quem tem voto no cenário ou é eleito real).
  const linhasCand = [...porNumero.values()]
    .map((c) => ({
      numero: c.numero,
      nome: c.nome,
      partido: c.partido.sigla,
      cenarioVotos: votosCenario.get(c.numero) ?? 0,
      reais: c.votosReais,
      eleitoReal: c.eleito,
      previstoEleito: previstos.has(c.numero),
    }))
    .filter((c) => c.cenarioVotos > 0 || c.eleitoReal)
    .sort((x, y) => y.reais - x.reais);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-xs text-neutral-500">
          <Link href="/cenario" className="hover:text-amber-400">
            Cenários
          </Link>{" "}
          / × resultado real
        </p>
        <h1 className="text-lg font-semibold">“{cenario.titulo}” × urnas de 2026</h1>
        <p className="text-sm text-neutral-500">
          {cenario.cargoNome} · cenário salvo em {cenario.updatedAt.toLocaleDateString("pt-BR")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card
          titulo="Acerto dos eleitos"
          valor={`${acertos.length} de ${cargo.vagas}`}
          cor={acertos.length >= cargo.vagas * 0.7 ? "text-emerald-400" : "text-amber-400"}
          detalhe={`${Math.round((acertos.length / Math.max(cargo.vagas, 1)) * 100)}% da bancada prevista`}
        />
        <Card
          titulo="Votos simulados"
          valor={totalCenario.toLocaleString("pt-BR")}
          cor="text-neutral-200"
          detalhe={`QE do cenário: ${qeCenario.toLocaleString("pt-BR")}`}
        />
        <Card
          titulo="Grupos com cadeira"
          valor={String(linhasGrupos.filter((l) => l.real > 0).length)}
          cor="text-neutral-200"
          detalhe="partidos/federações eleitos de fato"
        />
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Cadeiras: previsto × real
        </h2>
        <div className="flex flex-col gap-1">
          {linhasGrupos.map((l) => (
            <div
              key={l.grupo}
              className="flex flex-wrap items-center justify-between gap-x-3 rounded-lg bg-neutral-950/60 px-3 py-1.5 text-sm"
            >
              <span className="font-medium text-neutral-200">{l.grupo}</span>
              <span className="tabular-nums text-neutral-400">
                previu <span className="font-semibold text-neutral-100">{l.previsto}</span> · saiu{" "}
                <span className="font-semibold text-neutral-100">{l.real}</span>
                {l.previsto !== l.real && (
                  <span
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      l.real > l.previsto
                        ? "bg-emerald-950 text-emerald-300"
                        : "bg-red-950 text-red-300"
                    }`}
                  >
                    {l.real > l.previsto ? "+" : ""}
                    {l.real - l.previsto}
                  </span>
                )}
                {l.previsto === l.real && (
                  <span className="ml-2 rounded-full bg-neutral-800 px-2 py-0.5 text-xs text-neutral-400">
                    cravou
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Candidato a candidato ({linhasCand.length})
        </h2>
        <div className="flex max-h-[32rem] flex-col gap-0.5 overflow-y-auto pr-1">
          {linhasCand.map((c) => (
            <div
              key={c.numero}
              className={`flex flex-wrap items-center justify-between gap-x-3 rounded px-2 py-1 text-xs ${
                c.eleitoReal ? "bg-emerald-950/20" : "odd:bg-neutral-950/50"
              }`}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate text-neutral-200">{c.nome}</span>
                <span className="shrink-0 text-neutral-600">
                  {c.numero} · {c.partido}
                </span>
                {c.eleitoReal && (
                  <span className="shrink-0 rounded-full bg-emerald-950 px-1.5 py-px text-[9px] text-emerald-300">
                    eleito
                  </span>
                )}
                {c.previstoEleito && (
                  <span className="shrink-0 rounded-full bg-amber-950 px-1.5 py-px text-[9px] text-amber-300">
                    você previu
                  </span>
                )}
              </span>
              <span className="shrink-0 tabular-nums text-neutral-400">
                previu {c.cenarioVotos.toLocaleString("pt-BR")} · teve{" "}
                <span className="text-neutral-200">{c.reais.toLocaleString("pt-BR")}</span>
                <span
                  className={`ml-1.5 ${
                    c.reais - c.cenarioVotos >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  ({c.reais - c.cenarioVotos >= 0 ? "+" : ""}
                  {(c.reais - c.cenarioVotos).toLocaleString("pt-BR")})
                </span>
              </span>
            </div>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-neutral-600">
          “Você previu” = estava dentro das cadeiras do grupo no seu cenário (quociente + sobras
          com federações). Verde = eleito de fato.
        </p>
      </section>
    </div>
  );
}

function Card({ titulo, valor, cor, detalhe }: { titulo: string; valor: string; cor: string; detalhe: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
      <p className="text-[11px] uppercase tracking-wide text-neutral-500">{titulo}</p>
      <p className={`text-xl font-bold ${cor}`}>{valor}</p>
      <p className="text-xs text-neutral-500">{detalhe}</p>
    </div>
  );
}
