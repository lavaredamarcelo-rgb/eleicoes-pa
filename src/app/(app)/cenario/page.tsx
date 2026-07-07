import { QuocienteHierarquia } from "@/components/QuocienteHierarquia";
import { getHierarquiaCargos } from "@/lib/data";

export default async function CenarioPage() {
  const anos = await getHierarquiaCargos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Cenário Eleitoral</h1>
        <p className="text-sm text-neutral-500">
          Escolha um ano, depois o cargo e o município para ver a composição da casa (federal,
          estadual ou municipal) e simular cenários de troca de partido.
        </p>
      </div>

      <QuocienteHierarquia anos={anos} basePath="/cenario" />
    </div>
  );
}
