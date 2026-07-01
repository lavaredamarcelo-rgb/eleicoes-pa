import Link from "next/link";
import { getRegioes } from "@/lib/data";

export default async function RegioesPage() {
  const regioes = await getRegioes();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Regiões</h1>

      <div className="flex flex-col gap-2">
        {regioes.map((r) => (
          <Link
            key={r.id}
            href={`/regioes/${r.id}`}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          >
            <div>
              <p className="font-medium">{r.nome}</p>
              <p className="text-xs text-neutral-500">{r.totalMunicipios} municípios</p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {r.totalVotos.toLocaleString("pt-BR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
