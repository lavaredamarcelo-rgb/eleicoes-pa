import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, TrendingUp, ExternalLink } from "lucide-react";
import BotaoExcluirPesquisa from "@/components/BotaoExcluirPesquisa";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

const DISPUTAS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
  "Presidente",
];

export default async function PesquisasPage({
  searchParams,
}: {
  searchParams: Promise<{ disputa?: string; turno?: string }>;
}) {
  const session = await verifySession();
  const podeEditar = session.role === "ADMIN";
  const { disputa, turno } = await searchParams;

  const where: any = {};
  if (disputa) where.disputa = disputa;
  if (turno) where.turno = Number(turno);

  const pesquisas = await prisma.pesquisaEleitoral.findMany({
    where,
    include: { resultados: { orderBy: { percentual: "desc" } } },
    orderBy: { dataDivulgacao: "desc" },
  });

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Pesquisas Eleitorais · 2026</h1>
          <p className="text-sm text-neutral-500">
            Pesquisas de intenção de voto do Pará e para Presidente, registradas
            no PesqEle/TSE e divulgadas na imprensa.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <PdfDownloadLink
            href={`/api/pdf/pesquisas${
              disputa
                ? `?disputa=${encodeURIComponent(disputa)}${turno ? `&turno=${turno}` : ""}`
                : ""
            }`}
            label={disputa ? `PDF · ${disputa}` : "PDF geral"}
          />
          <Link
            href="/pesquisas/evolucao"
            className="flex items-center gap-1.5 rounded-lg border border-neutral-800 px-3 py-2 text-sm text-neutral-200 transition hover:bg-neutral-900"
          >
            <TrendingUp size={15} /> Evolução
          </Link>
          {podeEditar && (
            <Link
              href="/pesquisas/nova"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-3 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-amber-400"
            >
              <Plus size={15} /> Nova pesquisa
            </Link>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/pesquisas"
          className={`rounded-lg px-3 py-1.5 text-xs transition ${
            !disputa
              ? "bg-amber-500 font-semibold text-neutral-950"
              : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"
          }`}
        >
          Todas
        </Link>
        {DISPUTAS.map((d) => (
          <Link
            key={d}
            href={`/pesquisas?disputa=${encodeURIComponent(d)}${turno ? `&turno=${turno}` : ""}`}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              disputa === d
                ? "bg-amber-500 font-semibold text-neutral-950"
                : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"
            }`}
          >
            {d}
          </Link>
        ))}
        <span className="mx-1 border-l border-neutral-800" />
        {["1", "2"].map((t) => (
          <Link
            key={t}
            href={`/pesquisas?${disputa ? `disputa=${encodeURIComponent(disputa)}&` : ""}${
              turno === t ? "" : `turno=${t}`
            }`}
            className={`rounded-lg px-3 py-1.5 text-xs transition ${
              turno === t
                ? "bg-amber-500 font-semibold text-neutral-950"
                : "border border-neutral-800 text-neutral-300 hover:bg-neutral-900"
            }`}
          >
            {t}º turno
          </Link>
        ))}
      </div>

      {pesquisas.length === 0 ? (
        <div className="rounded-lg border border-neutral-800 py-12 text-center text-sm text-neutral-500">
          <p>Nenhuma pesquisa registrada{disputa ? ` para ${disputa}` : ""}.</p>
          {podeEditar && (
            <Link
              href="/pesquisas/nova"
              className="mt-2 inline-block text-amber-400 hover:underline"
            >
              Registrar a primeira →
            </Link>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {pesquisas.map((p) => (
            <div
              key={p.id}
              className="rounded-lg border border-neutral-800 bg-neutral-950 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-neutral-100">
                      {p.instituto}
                    </span>
                    <span className="rounded bg-amber-950/60 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                      {p.disputa} · {p.turno}º turno
                    </span>
                    <span className="rounded bg-neutral-900 px-2 py-0.5 text-[11px] text-neutral-400">
                      {p.tipo === "espontanea" ? "Espontânea" : "Estimulada"}
                    </span>
                    {p.cenario && (
                      <span className="rounded bg-neutral-900 px-2 py-0.5 text-[11px] text-neutral-400">
                        {p.cenario}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-neutral-500">
                    Divulgada em {fmt(p.dataDivulgacao)}
                    {p.amostra ? ` · ${p.amostra.toLocaleString("pt-BR")} entrevistados` : ""}
                    {p.margemErro != null ? ` · margem ±${p.margemErro} p.p.` : ""}
                    {p.registroTSE ? ` · ${p.registroTSE}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {p.linkMateria && (
                    <a
                      href={p.linkMateria}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-amber-400 hover:underline"
                    >
                      matéria <ExternalLink size={11} />
                    </a>
                  )}
                  {podeEditar && <BotaoExcluirPesquisa id={p.id} />}
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {p.resultados.map((r) => (
                  <span
                    key={r.id}
                    className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-xs text-neutral-300"
                  >
                    <span className="font-semibold text-neutral-100">
                      {r.percentual.toLocaleString("pt-BR")}%
                    </span>{" "}
                    {r.nome}
                    {r.partido ? (
                      <span className="text-neutral-500"> ({r.partido})</span>
                    ) : null}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
