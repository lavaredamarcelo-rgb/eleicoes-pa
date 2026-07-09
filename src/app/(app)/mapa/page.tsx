import { getCargosEstaduais, getCandidatosDoCargo, getMapaDados } from "@/lib/data";
import { MapaParaense } from "@/components/MapaParaense";
import { SeletorMapa } from "@/components/SeletorMapa";

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; candidato?: string }>;
}) {
  const { cargo: cargoId, candidato: candidatoId } = await searchParams;

  const [cargos, candidatos, municipios] = await Promise.all([
    getCargosEstaduais(),
    cargoId ? getCandidatosDoCargo(cargoId) : Promise.resolve([]),
    getMapaDados({ cargoId, candidatoId }),
  ]);

  const candidatoSel = candidatoId ? candidatos.find((c) => c.id === candidatoId) : undefined;
  const cargoSel = cargoId ? cargos.find((c) => c.id === cargoId) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Mapa do Pará</h1>
        <p className="text-sm text-neutral-500">
          Escolha o cargo e o candidato para ver a votação dele em cada município — o prefeito
          eleito de cada cidade aparece sempre no detalhe.
        </p>
      </div>

      <SeletorMapa
        cargos={cargos}
        cargoSelecionado={cargoId}
        candidatos={candidatos}
        candidatoSelecionado={candidatoId}
      />

      <MapaParaense
        municipios={municipios}
        rotuloVotos={
          candidatoSel
            ? `votos de ${candidatoSel.nome}`
            : cargoSel
              ? `votos para ${cargoSel.nome} (${cargoSel.ano})`
              : undefined
        }
      />
    </div>
  );
}
