import { CardLink } from "@/components/CardLink";
import { getMunicipios } from "@/lib/data";

export default async function MunicipiosPage() {
  const municipios = await getMunicipios();

  const porRegiao = new Map<string, typeof municipios>();
  for (const m of municipios) {
    const atual = porRegiao.get(m.regiao.nome);
    if (atual) {
      atual.push(m);
    } else {
      porRegiao.set(m.regiao.nome, [m]);
    }
  }
  const regioesOrdenadas = Array.from(porRegiao.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Municípios</h1>
        <p className="text-sm text-neutral-500">{municipios.length} municípios do Pará</p>
      </div>

      {regioesOrdenadas.map(([regiaoNome, lista]) => (
        <details key={regiaoNome} className="group" open={regioesOrdenadas.length <= 1}>
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
            <span className="font-medium">{regiaoNome}</span>
            <span className="text-xs text-neutral-500">{lista.length} municípios</span>
          </summary>

          <div className="mt-2 grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            {lista.map((m) => (
              <CardLink key={m.id} href={`/municipios/${m.id}`}>
                <p className="font-medium">{m.nome}</p>
                <span className="text-sm font-semibold text-blue-400">
                  {m.totalVotos.toLocaleString("pt-BR")}
                </span>
              </CardLink>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
