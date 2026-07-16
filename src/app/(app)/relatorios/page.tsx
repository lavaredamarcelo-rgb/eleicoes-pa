import { FileText, KeyRound } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { NovoRelatorio } from "@/components/NovoRelatorio";
import { BotaoExcluir } from "@/components/BotaoExcluir";
import { excluirRelatorio } from "@/app/actions/relatorios";
import { relatoriosDisponiveis } from "@/lib/relatorios";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const TIPO_ROTULO: Record<string, string> = {
  candidato: "Candidato",
  partido: "Partido",
  municipio: "Município",
  comparativo: "Comparativo",
  cenario: "Cenário simulado",
  livre: "Pedido livre",
};

export default async function RelatoriosPage() {
  const session = await verifySession();
  const disponivel = relatoriosDisponiveis();

  const [partidos, municipios, eleicoes, historico] = await Promise.all([
    prisma.partido.findMany({ orderBy: { sigla: "asc" }, select: { id: true, sigla: true } }),
    prisma.municipio.findMany({ orderBy: { nome: "asc" }, select: { id: true, nome: true } }),
    prisma.eleicao.findMany({ orderBy: { ano: "desc" }, select: { ano: true, tipo: true } }),
    prisma.relatorio.findMany({
      where: { userId: String(session.userId) },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { id: true, titulo: true, tipo: true, createdAt: true },
    }),
  ]);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-lg font-semibold">Relatórios</h1>
        <p className="text-sm text-neutral-500">
          Relatórios prontos a partir dos dados oficiais do sistema (TSE, IBGE, Câmara e
          Senado): números, tabelas e destaques — com análise escrita por IA quando ativada.
        </p>
      </div>

      {session.role !== "ADMIN" ? (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4 text-sm text-neutral-400">
          A geração de relatórios está restrita ao administrador.
        </p>
      ) : (
        <>
          {!disponivel && (
            <p className="flex items-start gap-2 rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 text-xs text-neutral-400">
              <KeyRound size={14} className="mt-0.5 shrink-0 text-neutral-500" />
              <span>
                <span className="font-medium text-neutral-300">Modo padrão ativo:</span> os
                relatórios saem com números, tabelas e destaques calculados pelo sistema. Para
                adicionar análise escrita por IA e liberar o pedido livre, configure a variável{" "}
                <span className="font-mono text-amber-300">ANTHROPIC_API_KEY</span> na Railway
                (chave criada em console.anthropic.com).
              </span>
            </p>
          )}
          <NovoRelatorio
            partidos={partidos}
            municipios={municipios}
            anos={eleicoes}
            temIA={disponivel}
          />
        </>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Relatórios emitidos ({historico.length})
        </h2>
        {historico.length > 0 ? (
          historico.map((r) => (
            <div key={r.id} className="flex items-center gap-2">
              <div className="min-w-0 flex-1">
                <CardLink href={`/relatorios/${r.id}`}>
                  <div className="flex min-w-0 items-center gap-3">
                    <FileText size={16} className="shrink-0 text-amber-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{r.titulo}</p>
                      <p className="text-xs text-neutral-500">
                        {TIPO_ROTULO[r.tipo] ?? r.tipo} ·{" "}
                        {new Date(r.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                  </div>
                </CardLink>
              </div>
              <BotaoExcluir acao={excluirRelatorio.bind(null, r.id)} nome={r.titulo} />
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-4 py-6 text-center text-sm text-neutral-500">
            Nenhum relatório emitido ainda.
          </p>
        )}
      </section>
    </div>
  );
}
