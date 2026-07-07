import { CardLink } from "@/components/CardLink";
import { AnoSelector } from "@/components/AnoSelector";
import { getTodosEleitos, getEleicoes } from "@/lib/data";

export default async function CandidatosPage({
  searchParams,
}: {
  searchParams: Promise<{ ano?: string }>;
}) {
  const { ano: anoParam } = await searchParams;
  const ano = anoParam ? Number(anoParam) : undefined;

  const [eleitos, eleicoes] = await Promise.all([getTodosEleitos(ano), getEleicoes()]);
  const anosDisponiveis = Array.from(new Set(eleicoes.map((e) => e.ano))).sort((a, b) => b - a);

  const porCargo = new Map<string, typeof eleitos>();
  for (const entrada of eleitos) {
    const lista = porCargo.get(entrada.cargoNome);
    if (lista) lista.push(entrada);
    else porCargo.set(entrada.cargoNome, [entrada]);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-semibold">Eleitos</h1>
          <p className="text-sm text-neutral-500">Organizados por cargo</p>
        </div>
        <div className="w-40">
          <AnoSelector anos={anosDisponiveis} selecionado={ano ?? "todos"} basePath="/candidatos" />
        </div>
      </div>

      {porCargo.size === 0 && (
        <p className="text-sm text-neutral-500">Nenhum eleito encontrado para esse filtro.</p>
      )}

      {Array.from(porCargo.entries()).map(([cargoNome, entradas]) => (
        <section key={cargoNome} className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">{cargoNome}</h2>
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
            {entradas.map((entrada) =>
              entrada.eleitos.map((c) => (
                <CardLink key={c.id} href={`/candidatos/${c.id}`}>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{c.nome}</p>
                    <p className="text-xs text-neutral-500">
                      {c.numero} · {c.partido.sigla}
                      {entrada.municipioNome ? ` · ${entrada.municipioNome}` : " · PA"} · {entrada.ano}
                    </p>
                    {c.viceNome && (
                      <p className="text-xs text-amber-400/80">
                        Vice: {c.viceNome} ({c.viceNumero})
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-amber-400">
                    {c.votos.toLocaleString("pt-BR")}
                  </span>
                </CardLink>
              ))
            )}
          </div>
        </section>
      ))}
    </div>
  );
}
