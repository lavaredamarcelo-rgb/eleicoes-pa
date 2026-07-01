import { getCargos, getMapaDados } from "@/lib/data";
import { MapaParaense } from "@/components/MapaParaense";
import { CargoSelector } from "@/components/CargoSelector";

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<{ cargoId?: string }>;
}) {
  const { cargoId: cargoIdParam } = await searchParams;
  const cargos = await getCargos();
  const cargoId = cargoIdParam ?? cargos[0]?.id;
  const municipios = cargoId ? await getMapaDados(cargoId) : [];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Mapa do Pará</h1>
        <p className="text-sm text-neutral-500">Votos por município e por região</p>
      </div>

      {cargoId && (
        <CargoSelector
          cargos={cargos.map((c) => ({
            id: c.id,
            nome: c.nome,
            municipioNome: c.municipio?.nome,
          }))}
          selecionado={cargoId}
        />
      )}

      {municipios.length > 0 ? (
        <MapaParaense municipios={municipios} />
      ) : (
        <p className="text-sm text-neutral-500">Nenhum dado disponível ainda.</p>
      )}
    </div>
  );
}
