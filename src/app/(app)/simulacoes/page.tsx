import { CardLink } from "@/components/CardLink";
import { getCargos } from "@/lib/data";

export default async function SimulacoesPage() {
  const cargos = await getCargos();
  const proporcionais = cargos.filter((c) => c.tipoApuracao === "PROPORCIONAL");

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Simulações</h1>
        <p className="text-sm text-neutral-500">
          Cenários hipotéticos de troca de partido e crescimento de votos — veja se um candidato
          se elegeria em outro partido, com mais votos, ou os dois combinados. Disponível para
          cargos proporcionais (vereador, deputado estadual/federal), onde a distribuição de
          vagas depende do quociente partidário.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-3">
        {proporcionais.map((cargo) => (
          <CardLink key={cargo.id} href={`/quociente/${cargo.id}#simulador`}>
            <div>
              <p className="font-medium">{cargo.nome}</p>
              <p className="text-xs text-neutral-500">
                {cargo.municipio ? cargo.municipio.nome : "PA"} · {cargo.eleicao.ano}
              </p>
            </div>
          </CardLink>
        ))}
        {proporcionais.length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-4 py-6 text-center text-sm text-neutral-500">
            Nenhuma disputa proporcional cadastrada ainda.
          </p>
        )}
      </div>
    </div>
  );
}
