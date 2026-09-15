import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { SeletorVotosMunicipio } from "@/components/SeletorVotosMunicipio";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

// Ranking completo de votos de um cargo estadual por município ou região:
// todos os candidatos, votos e % local — não só o mais votado do mapa.
export default async function VotosMunicipioPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; regiao?: string; municipio?: string }>;
}) {
  await verifySession();
  const { cargo: cargoId, regiao: regiaoId, municipio: municipioId } = await searchParams;

  const [cargos, regioes, municipios] = await Promise.all([
    prisma.cargo.findMany({
      where: { municipioId: null, candidatos: { some: { resultados: { some: {} } } } },
      include: { eleicao: { select: { ano: true } } },
      orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
    }),
    prisma.regiao.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.municipio.findMany({
      orderBy: { nome: "asc" },
      select: { id: true, nome: true, regiaoId: true },
    }),
  ]);

  const cargoSel = cargos.find((c) => c.id === cargoId);
  const municipioSel = municipios.find((m) => m.id === municipioId);
  const regiaoSel = regioes.find((r) => r.id === regiaoId);
  const temEscopo = !!cargoSel && (!!municipioSel || !!regiaoSel);

  let ranking: {
    nome: string;
    numero: number;
    partido: string;
    votos: number;
    eleito: boolean;
  }[] = [];
  let totalLocal = 0;

  if (temEscopo) {
    const grupos = await prisma.resultado.groupBy({
      by: ["candidatoId"],
      where: {
        turno: 1,
        candidato: { cargoId: cargoSel!.id },
        ...(municipioSel
          ? { municipioId: municipioSel.id }
          : { municipio: { regiaoId: regiaoSel!.id } }),
      },
      _sum: { votos: true },
    });
    const ids = grupos.map((g) => g.candidatoId);
    const candidatos = await prisma.candidato.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        nome: true,
        numero: true,
        eleito: true,
        partido: { select: { sigla: true } },
      },
    });
    const porId = new Map(candidatos.map((c) => [c.id, c]));
    ranking = grupos
      .map((g) => {
        const c = porId.get(g.candidatoId);
        return {
          nome: c?.nome ?? "?",
          numero: c?.numero ?? 0,
          partido: c?.partido.sigla ?? "?",
          votos: g._sum.votos ?? 0,
          eleito: c?.eleito ?? false,
        };
      })
      .filter((r) => r.votos > 0)
      .sort((a, b) => b.votos - a.votos);
    totalLocal = ranking.reduce((s, r) => s + r.votos, 0);
  }

  const rotuloLocal = municipioSel
    ? municipioSel.nome
    : regiaoSel
      ? `Região ${regiaoSel.nome} (somada)`
      : "";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Votos por município</h1>
          <p className="text-sm text-neutral-500">
            Ranking completo de um cargo em um município ou região — todos os
            candidatos, com votos e percentual local (1º turno, dados oficiais).
          </p>
        </div>
        {temEscopo && ranking.length > 0 && (
          <PdfDownloadLink
            href={`/api/pdf/votos-municipio?cargo=${cargoSel!.id}${
              municipioSel ? `&municipio=${municipioSel.id}` : `&regiao=${regiaoSel!.id}`
            }`}
            label={`PDF · ${rotuloLocal}`}
          />
        )}
      </div>

      <SeletorVotosMunicipio
        cargos={cargos.map((c) => ({ id: c.id, nome: c.nome, ano: c.eleicao.ano }))}
        regioes={regioes}
        municipios={municipios}
        cargoSel={cargoId ?? ""}
        regiaoSel={regiaoId ?? ""}
        municipioSel={municipioId ?? ""}
      />

      {!cargoSel ? (
        <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
          Escolha o cargo acima (ex.: Deputado Estadual · 2022) e depois um
          município — ou uma região para ver a soma de todos os municípios dela.
        </p>
      ) : !temEscopo ? (
        <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
          Agora escolha um município ou uma região.
        </p>
      ) : ranking.length === 0 ? (
        <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
          Nenhum voto registrado para {cargoSel.nome} em {rotuloLocal}.
        </p>
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 px-4 py-2.5">
            <p className="text-sm font-medium text-neutral-200">
              {cargoSel.nome} · {cargoSel.eleicao.ano} — {rotuloLocal}
            </p>
            <p className="text-xs text-neutral-500">
              {ranking.length} candidatos ·{" "}
              <span className="font-semibold text-amber-400">
                {totalLocal.toLocaleString("pt-BR")}
              </span>{" "}
              votos
            </p>
          </div>
          <div className="max-h-[32rem] overflow-y-auto">
            {ranking.map((r, i) => (
              <div
                key={`${r.numero}-${i}`}
                className="grid items-center gap-2 border-b border-neutral-800/50 px-4 py-1.5 text-xs last:border-0"
                style={{ gridTemplateColumns: "2.2rem minmax(0,1fr) 5.5rem 3.5rem" }}
              >
                <span className="text-right text-neutral-600">{i + 1}º</span>
                <span className="min-w-0 truncate text-neutral-300">
                  <span className="font-medium">{r.nome}</span>{" "}
                  <span className="text-neutral-600">
                    {r.numero} · {r.partido}
                  </span>
                  {r.eleito && (
                    <span className="ml-1.5 rounded bg-emerald-950/60 px-1.5 py-0.5 text-[10px] text-emerald-400">
                      Eleito
                    </span>
                  )}
                </span>
                <span className="text-right font-semibold tabular-nums text-amber-400">
                  {r.votos.toLocaleString("pt-BR")}
                </span>
                <span className="text-right tabular-nums text-neutral-500">
                  {totalLocal > 0 ? `${((r.votos / totalLocal) * 100).toFixed(1)}%` : "—"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
