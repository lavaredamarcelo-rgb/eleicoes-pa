import { Upload } from "lucide-react";

export default function ImportacaoPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Importação de dados</h1>

      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-700 bg-neutral-900 px-6 py-10 text-center">
        <Upload className="text-neutral-500" size={28} />
        <p className="text-sm text-neutral-400">
          Em breve: importe boletins de urna e resultados oficiais do TSE
          (dadosabertos.tse.jus.br) para atualizar automaticamente os votos por
          candidato, município e cargo.
        </p>
        <button
          disabled
          className="mt-2 rounded-lg bg-neutral-800 px-4 py-2 text-sm text-neutral-500"
        >
          Selecionar arquivo (em breve)
        </button>
      </div>

      <p className="text-xs text-neutral-600">
        Por enquanto, os dados exibidos no app são de demonstração, cadastrados
        via seed. A importação automática é a próxima etapa do roadmap.
      </p>
    </div>
  );
}
