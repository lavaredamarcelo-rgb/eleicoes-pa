import { getCargosMapa, getCandidatosDoCargo, getMapaDados } from "@/lib/data";
import { MapaParaense } from "@/components/MapaParaense";
import { SeletorMapa } from "@/components/SeletorMapa";

// Cargos municipais (Prefeito/Vereador têm um Cargo por município) chegam
// como valor sintético "mun:Nome:ano"; os estaduais, como o cargoId real.
function parseCargoParam(valor?: string) {
  if (!valor) return { cargoId: undefined, cargoMunicipal: undefined };
  const mun = valor.match(/^mun:(Prefeito|Vereador):(\d{4})$/);
  if (mun) return { cargoId: undefined, cargoMunicipal: { nome: mun[1], ano: Number(mun[2]) } };
  return { cargoId: valor, cargoMunicipal: undefined };
}

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; candidato?: string }>;
}) {
  const { cargo: cargoParam, candidato: candidatoId } = await searchParams;
  const { cargoId, cargoMunicipal } = parseCargoParam(cargoParam);

  const [cargos, candidatos, municipios] = await Promise.all([
    getCargosMapa(),
    cargoId ? getCandidatosDoCargo(cargoId) : Promise.resolve([]),
    getMapaDados({ cargoId, candidatoId, cargoMunicipal }),
  ]);

  const candidatoSel = candidatoId ? candidatos.find((c) => c.id === candidatoId) : undefined;
  const cargoSel = cargoParam ? cargos.find((c) => c.valor === cargoParam) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Mapa do Pará</h1>
        <p className="text-sm text-neutral-500">
          Escolha o cargo e o candidato para ver a votação dele em cada município
        </p>
      </div>

      <SeletorMapa
        cargos={cargos}
        cargoSelecionado={cargoParam}
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
