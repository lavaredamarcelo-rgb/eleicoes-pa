import { verifySession } from "@/lib/dal";
import { ImportadorCandidatos } from "@/components/ImportadorCandidatos";
import { redirect } from "next/navigation";

export default async function ImportarPage() {
  const session = await verifySession();

  if (session.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Importar Candidatos</h1>
        <p className="text-sm text-neutral-500">
          Importe candidatos do TSE através de arquivos Excel. Cada arquivo deve
          conter candidatos de um cargo específico.
        </p>
      </div>

      <ImportadorCandidatos />

      <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4">
        <h2 className="mb-3 text-sm font-semibold text-neutral-300">Guia</h2>
        <ul className="space-y-2 text-xs text-neutral-400">
          <li>
            • Exporte os candidatos do TSE em formato Excel (.xlsx)
          </li>
          <li>
            • Selecionadores o cargo correspondente ao arquivo
          </li>
          <li>
            • Clique em Importar
          </li>
          <li>
            • Os candidatos serão adicionados ao sistema
          </li>
        </ul>
      </div>
    </div>
  );
}
