import Link from "next/link";
import { getMunicipios } from "@/lib/data";

export default async function MunicipiosPage() {
  const municipios = await getMunicipios();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Municípios</h1>

      <div className="flex flex-col gap-2">
        {municipios.map((m) => (
          <Link
            key={m.id}
            href={`/municipios/${m.id}`}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          >
            <div>
              <p className="font-medium">{m.nome}</p>
              <p className="text-xs text-neutral-500">{m.regiao.nome}</p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {m.totalVotos.toLocaleString("pt-BR")}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
