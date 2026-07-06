import { CardLink } from "@/components/CardLink";
import { getCargos } from "@/lib/data";

export default async function QuocientePage() {
  const cargos = await getCargos();

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Cálculo de quociente</h1>
        <p className="text-sm text-neutral-500">
          Selecione uma disputa para ver o cálculo detalhado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        {cargos.map((cargo) => (
          <CardLink key={cargo.id} href={`/quociente/${cargo.id}`}>
            <div>
              <p className="font-medium">{cargo.nome}</p>
              <p className="text-xs text-neutral-500">
                {cargo.municipio ? cargo.municipio.nome : "PA"} · {cargo.eleicao.ano}
              </p>
            </div>
            <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
              {cargo.tipoApuracao === "PROPORCIONAL" ? "Proporcional" : "Majoritário"}
            </span>
          </CardLink>
        ))}
      </div>
    </div>
  );
}
