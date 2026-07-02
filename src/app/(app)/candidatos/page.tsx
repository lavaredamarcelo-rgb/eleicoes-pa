import { CardLink } from "@/components/CardLink";
import { getCargos, getCandidatosPorCargo } from "@/lib/data";

export default async function CandidatosPage() {
  const cargos = await getCargos();

  const grupos = await Promise.all(
    cargos.map(async (cargo) => ({
      cargo,
      candidatos: await getCandidatosPorCargo(cargo.id),
    }))
  );

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Candidatos</h1>

      {grupos.map(({ cargo, candidatos }) => (
        <section key={cargo.id} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            {cargo.nome}
            {cargo.municipio ? ` · ${cargo.municipio.nome}` : " · PA"}
          </h2>

          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            {candidatos.map((c) => (
              <CardLink key={c.id} href={`/candidatos/${c.id}`}>
                <div>
                  <p className="font-medium">{c.nome}</p>
                  <p className="text-xs text-neutral-500">
                    {c.numero} · {c.partido.sigla}
                  </p>
                </div>
                <span className="text-sm font-semibold text-blue-400">
                  {c.totalVotos.toLocaleString("pt-BR")}
                </span>
              </CardLink>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
