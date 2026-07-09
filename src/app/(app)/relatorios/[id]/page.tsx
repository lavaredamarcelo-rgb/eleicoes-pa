import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";
import type { ConteudoRelatorio } from "@/lib/relatorios";

const TIPO_ROTULO: Record<string, string> = {
  candidato: "Desempenho de candidato",
  partido: "Desempenho de partido",
  municipio: "Raio-X de município",
  comparativo: "Comparativo de eleições",
  livre: "Pedido livre",
};

export default async function RelatorioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await verifySession();

  const relatorio = await prisma.relatorio.findUnique({ where: { id } });
  // Cada usuário vê os próprios relatórios; o admin vê todos.
  if (!relatorio || (relatorio.userId !== session.userId && session.role !== "ADMIN")) {
    notFound();
  }

  const conteudo = JSON.parse(relatorio.conteudo) as ConteudoRelatorio;

  return (
    <div className="flex flex-col gap-5">
      <Link
        href="/relatorios"
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-300"
      >
        <ArrowLeft size={15} /> Relatórios
      </Link>

      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            {TIPO_ROTULO[relatorio.tipo] ?? relatorio.tipo} ·{" "}
            {new Date(relatorio.createdAt).toLocaleString("pt-BR")}
          </p>
          <h1 className="text-lg font-semibold">{conteudo.titulo}</h1>
        </div>
        <PdfDownloadLink href={`/api/pdf/relatorio/${relatorio.id}`} />
      </div>

      {conteudo.resumo && (
        <p className="rounded-xl border border-amber-900/50 bg-amber-950/20 px-4 py-3 text-sm leading-relaxed text-amber-100">
          {conteudo.resumo}
        </p>
      )}

      {conteudo.secoes.map((s, i) => (
        <section key={i} className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-neutral-200">{s.titulo}</h2>
          {s.paragrafos?.map((p, j) => (
            <p key={j} className="text-sm leading-relaxed text-neutral-300">
              {p}
            </p>
          ))}
          {s.destaques && s.destaques.length > 0 && (
            <ul className="flex flex-col gap-1.5">
              {s.destaques.map((d, j) => (
                <li
                  key={j}
                  className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-sm text-amber-200"
                >
                  {d}
                </li>
              ))}
            </ul>
          )}
          {s.tabela && s.tabela.colunas?.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-neutral-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 bg-neutral-900">
                    {s.tabela.colunas.map((c, j) => (
                      <th key={j} className="px-3 py-2 text-left text-xs font-medium text-neutral-400">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {s.tabela.linhas.map((linha, j) => (
                    <tr key={j} className="border-b border-neutral-800/60 last:border-0">
                      {linha.map((cel, k) => (
                        <td key={k} className="px-3 py-2 text-neutral-300">
                          {cel}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ))}

      {conteudo.conclusao && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-neutral-200">Conclusão</h2>
          <p className="text-sm leading-relaxed text-neutral-300">{conteudo.conclusao}</p>
        </section>
      )}

      <p className="text-center text-[11px] text-neutral-600">
        {relatorio.modelo === "padrao"
          ? "Relatório padrão gerado automaticamente a partir dos dados oficiais do sistema (TSE/IBGE)."
          : "Relatório gerado por inteligência artificial (Claude) a partir dos dados do sistema — confira números críticos antes de decisões importantes."}
      </p>
    </div>
  );
}
