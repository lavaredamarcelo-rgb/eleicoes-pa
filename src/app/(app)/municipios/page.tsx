import { CardLink } from "@/components/CardLink";
import { getMunicipios, getRegioes } from "@/lib/data";

export default async function MunicipiosPage() {
  const [municipios, regioes] = await Promise.all([getMunicipios(), getRegioes()]);

  const regiaoInfoPorId = new Map(regioes.map((r) => [r.id, r]));

  const porRegiao = new Map<string, typeof municipios>();
  for (const m of municipios) {
    const atual = porRegiao.get(m.regiao.id);
    if (atual) {
      atual.push(m);
    } else {
      porRegiao.set(m.regiao.id, [m]);
    }
  }
  const regioesOrdenadas = Array.from(porRegiao.entries()).sort((a, b) => {
    const nomeA = regiaoInfoPorId.get(a[0])?.nome ?? "";
    const nomeB = regiaoInfoPorId.get(b[0])?.nome ?? "";
    return nomeA.localeCompare(nomeB, "pt-BR");
  });

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Municípios e regiões</h1>
        <p className="text-sm text-neutral-500">
          {municipios.length} municípios em {regioesOrdenadas.length} mesorregiões do Pará
        </p>
      </div>

      {regioesOrdenadas.map(([regiaoId, lista]) => {
        const regiaoInfo = regiaoInfoPorId.get(regiaoId);
        return (
          <details
            key={regiaoId}
            id={`regiao-${regiaoId}`}
            className="group scroll-mt-20"
            open={regioesOrdenadas.length <= 1}
          >
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
              <span className="font-medium">{regiaoInfo?.nome}</span>
              <span className="flex items-center gap-2 text-xs text-neutral-500">
                <span>{lista.length} municípios</span>
                <span className="font-semibold text-blue-400">
                  {(regiaoInfo?.totalVotos ?? 0).toLocaleString("pt-BR")} votos
                </span>
              </span>
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
        );
      })}
    </div>
  );
}
