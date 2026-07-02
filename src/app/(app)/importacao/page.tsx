import { redirect } from "next/navigation";
import { RadioTower } from "lucide-react";
import { verifySession } from "@/lib/dal";
import { getEleicoes } from "@/lib/data";
import { ImportacaoTseForm } from "@/components/ImportacaoTseForm";

export default async function ImportacaoPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/configuracoes");
  }

  const eleicoes = await getEleicoes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Importação de dados</h1>
        <p className="text-sm text-neutral-500">
          Dados oficiais do TSE, em arquivos CSV publicados em dadosabertos.tse.jus.br
        </p>
      </div>

      <ImportacaoTseForm eleicoes={eleicoes} />

      <section className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
        <div className="flex items-center gap-2">
          <RadioTower size={16} className="text-neutral-500" />
          <p className="text-sm font-medium text-neutral-300">Sincronização em tempo real</p>
        </div>
        <p className="text-xs text-neutral-500">
          O TSE disponibiliza um sistema de divulgação de resultados apenas durante a apuração —
          poucas horas, na noite da eleição. Fora desse período não há nada para sincronizar. Essa
          integração ainda não está configurada: o endpoint oficial de divulgação muda a cada
          pleito e só pode ser confirmado próximo à data da eleição.
        </p>
        <button
          disabled
          className="self-start rounded-lg bg-neutral-800 px-4 py-2 text-sm text-neutral-500"
        >
          Configuração pendente
        </button>
      </section>
    </div>
  );
}
