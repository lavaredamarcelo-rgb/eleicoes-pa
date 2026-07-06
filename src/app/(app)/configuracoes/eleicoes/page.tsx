import { redirect } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getEleicoes } from "@/lib/data";
import { CriarEleicaoForm } from "@/components/CriarEleicaoForm";

export default async function EleicoesPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") {
    redirect("/configuracoes");
  }

  const eleicoes = await getEleicoes();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Eleições</h1>
        <p className="text-sm text-neutral-500">
          Cadastre aqui os pleitos que existirão no sistema — inclusive anteriores, para receber
          dados históricos do TSE. Cargos e candidatos são criados automaticamente ao importar os
          arquivos em "Importação de dados".
        </p>
      </div>

      <CriarEleicaoForm />

      <div className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">
          Eleições cadastradas ({eleicoes.length})
        </h2>
        {eleicoes.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {e.tipo === "ESTADUAL" ? "Estadual" : "Municipal"} · {e.ano} · {e.uf}
              </p>
              <p className="text-xs text-neutral-500">
                {e.cargos.length} cargo(s) cadastrado(s)
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
