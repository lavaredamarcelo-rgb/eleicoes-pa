import { CardLink } from "@/components/CardLink";
import { getRegioes } from "@/lib/data";

export default async function RegioesPage() {
  const regioes = await getRegioes();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Regiões</h1>

      <div className="flex flex-col gap-2">
        {regioes.map((r) => (
          <CardLink key={r.id} href={`/regioes/${r.id}`}>
            <div>
              <p className="font-medium">{r.nome}</p>
              <p className="text-xs text-neutral-500">{r.totalMunicipios} municípios</p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {r.totalVotos.toLocaleString("pt-BR")}
            </span>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
