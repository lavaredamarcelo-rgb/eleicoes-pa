import { QuocienteHierarquia } from "@/components/QuocienteHierarquia";
import { getHierarquiaCargos } from "@/lib/data";

export default async function QuocientePage() {
  const anos = await getHierarquiaCargos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Quociente eleitoral</h1>
        <p className="text-sm text-neutral-500">
          Escolha um ano, depois o cargo e o município para ver o cálculo detalhado.
        </p>
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-4">
        <h2 className="text-sm font-medium text-neutral-300">Base legal</h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          Código Eleitoral (Lei 4.737/65). O <strong className="text-neutral-300">quociente eleitoral</strong>{" "}
          (art. 106) é o número de votos válidos dividido pelas vagas em disputa — ele define quantos
          votos um partido precisa para conquistar uma cadeira. O{" "}
          <strong className="text-neutral-300">quociente partidário</strong> (art. 107) é o total de
          votos do partido dividido pelo quociente eleitoral, arredondado para baixo: esse número de
          vagas é preenchido diretamente pelos candidatos mais votados da legenda.
        </p>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          As vagas que sobram após a distribuição direta (as <strong className="text-neutral-300">sobras</strong>)
          são preenchidas pela regra da <strong className="text-neutral-300">maior média</strong> (art.
          109): a cada rodada, calcula-se para cada partido apto (que atingiu o quociente eleitoral)
          a média entre seus votos e o número de vagas que já teria +1; quem tiver a maior média leva
          a próxima sobra, repetindo até esgotar as cadeiras.
        </p>
      </section>

      <QuocienteHierarquia anos={anos} />
    </div>
  );
}
