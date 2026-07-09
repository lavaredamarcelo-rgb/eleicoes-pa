import { FileText, KeyRound } from "lucide-react";
import { CardLink } from "@/components/CardLink";
import { NovoRelatorio } from "@/components/NovoRelatorio";
import { relatoriosDisponiveis } from "@/lib/relatorios";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

const TIPO_ROTULO: Record<string, string> = {
  candidato: "Candidato",
  partido: "Partido",
  municipio: "Município",
  comparativo: "Comparativo",
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
          Análises geradas por inteligência artificial a partir dos dados oficiais do sistema
          (TSE, IBGE, Câmara e Senado). Escolha um modelo guiado ou faça um pedido livre.
        </p>
      </div>

      {session.role !== "ADMIN" ? (
        <p className="rounded-2xl border border-neutral-800 bg-neutral-900 px-4 py-4 text-sm text-neutral-400">
          A geração de relatórios está restrita ao administrador.
        </p>
      ) : disponivel ? (
        <NovoRelatorio partidos={partidos} municipios={municipios} anos={eleicoes} />
      ) : (
        <div className="flex flex-col gap-2 rounded-2xl border border-amber-900/60 bg-amber-950/20 p-4">
          <p className="flex items-center gap-2 text-sm font-medium text-amber-300">
            <KeyRound size={16} /> Falta configurar a chave da API
          </p>
          <p className="text-sm text-neutral-400">
            Para ativar os relatórios, crie uma chave em{" "}
            <span className="text-neutral-200">console.anthropic.com</span> (Settings → API keys)
            e adicione na Railway: projeto <span className="text-neutral-200">eleicoes-pa</span> →
            serviço → aba <span className="text-neutral-200">Variables</span> → nova variável{" "}
            <span className="rounded bg-neutral-900 px-1.5 py-0.5 font-mono text-xs text-amber-300">
              ANTHROPIC_API_KEY
            </span>{" "}
            com o valor da chave. O serviço reinicia sozinho e esta página passa a funcionar.
          </p>
          <p className="text-xs text-neutral-600">
            Custo estimado: centavos de dólar por relatório, sem mensalidade.
          </p>
        </div>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Relatórios emitidos ({historico.length})
        </h2>
        {historico.length > 0 ? (
          historico.map((r) => (
            <CardLink key={r.id} href={`/relatorios/${r.id}`}>
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
