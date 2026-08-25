import { verifySession } from "@/lib/dal";
import { redirect } from "next/navigation";
import Link from "next/link";
import FormNovaPesquisa from "@/components/FormNovaPesquisa";

export default async function NovaPesquisaPage() {
  const session = await verifySession();
  if (session.role !== "ADMIN") redirect("/pesquisas");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Registrar pesquisa eleitoral</h1>
        <p className="text-sm text-neutral-500">
          Dados da divulgação na imprensa + registro no PesqEle/TSE.{" "}
          <Link href="/pesquisas" className="text-amber-400 hover:underline">
            ← Voltar
          </Link>
        </p>
      </div>
      <FormNovaPesquisa />
    </div>
  );
}
