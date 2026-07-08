import { AnoSelector } from "@/components/AnoSelector";
import { EleitosPorCargo } from "@/components/EleitosPorCargo";
import { getAnosComEleitos, getEleitosOficiais } from "@/lib/data";

export default async function EleitosPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const anosDisponiveis = await getAnosComEleitos();
  const { ano: anoParam } = await searchParams;
  const anoSelecionado =
    anoParam && anosDisponiveis.includes(Number(anoParam))
      ? Number(anoParam)
      : anosDisponiveis[0];

  const cargos = anoSelecionado ? await getEleitosOficiais(anoSelecionado) : [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Eleitos</h1>
          <p className="text-sm text-neutral-500">
            Situação oficial do TSE · escolha o cargo e o município
          </p>
        </div>
        {anoSelecionado && (
          <div className="w-32">
            <AnoSelectorSimples anos={anosDisponiveis} selecionado={anoSelecionado} />
          </div>
        )}
      </div>

      {cargos.length > 0 ? (
        <EleitosPorCargo cargos={cargos} />
      ) : (
        <p className="text-sm text-neutral-500">
          Nenhum eleito importado ainda. Importe os dados do TSE em Configurações.
        </p>
      )}
    </div>
  );
}

function AnoSelectorSimples({ anos, selecionado }: { anos: number[]; selecionado: number }) {
  return <AnoSelector anos={anos} selecionado={selecionado} basePath="/candidatos" somenteAnos />;
}
