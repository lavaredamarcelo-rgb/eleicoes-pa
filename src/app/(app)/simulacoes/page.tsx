import { CalculadoraCenarios } from "@/components/CalculadoraCenarios";

export default function SimulacoesPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Simulações</h1>
        <p className="text-sm text-neutral-500">
          Calculadora de cenários eleitorais hipotéticos.
        </p>
      </div>

      <CalculadoraCenarios />
    </div>
  );
}
