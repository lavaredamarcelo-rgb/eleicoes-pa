import { CalculadoraCenarios } from "@/components/CalculadoraCenarios";
import { QuocienteHierarquia } from "@/components/QuocienteHierarquia";
import { SeletorSimulacao } from "@/components/simuladores/SeletorSimulacao";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SeletorCandidatoSimulacao } from "@/components/simuladores/SeletorCandidatoSimulacao";
import { SimuladorSegundoTurno } from "@/components/simuladores/SimuladorSegundoTurno";
import { SimuladorFederacao } from "@/components/simuladores/SimuladorFederacao";
import { SimuladorTransferencia } from "@/components/simuladores/SimuladorTransferencia";
import { SimuladorChapa } from "@/components/simuladores/SimuladorChapa";
import { SimuladorComparecimento } from "@/components/simuladores/SimuladorComparecimento";
import { SimuladorMeta } from "@/components/simuladores/SimuladorMeta";
import { BuscaCandidatoMeta } from "@/components/simuladores/BuscaCandidatoMeta";
import {
  getCargosParaSimulacao,
  getDadosSimulacaoCargo,
  getDistribuicaoMeta,
  getHierarquiaCargos,
  type BaseMeta,
} from "@/lib/data";

const DESCRICOES: Record<string, string> = {
  projecao: "Monte um cenário do zero: quociente e projeção de crescimento.",
  "segundo-turno": "Leve os dois mais votados a um 2º turno hipotético e distribua os votos dos eliminados.",
  federacao: "Una partidos em uma federação e veja o efeito na distribuição de cadeiras.",
  transferencia: "Simule uma desistência com transferência de votos e veja quem se elegeria.",
  chapa: "Ajuste os votos de vários candidatos ao mesmo tempo e veja quem se elege no cenário.",
  comparecimento: "Projete o quociente eleitoral a partir do comparecimento dos eleitores.",
  meta: "Defina uma meta de votos e veja quanto falta em cada município.",
};

export default async function SimulacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ sim?: string; cargo?: string; candidato?: string; base?: string }>;
}) {
  const { sim: simParam, cargo: cargoId, candidato: candidatoId, base } = await searchParams;
  const sim = simParam && simParam in DESCRICOES ? simParam : "projecao";
  const anosQuociente = await getHierarquiaCargos();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Quociente e Simulações</h1>
        <p className="text-sm text-neutral-500">
          Cálculo oficial do quociente eleitoral e simuladores de cenários.
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

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-medium text-neutral-400">
          Cálculo por disputa — escolha o ano, o cargo e o município
        </h2>
        <QuocienteHierarquia anos={anosQuociente} />
      </section>

      <section id="simuladores" className="flex scroll-mt-20 flex-col gap-4 border-t border-neutral-800 pt-6">
        <div>
          <h2 className="text-base font-semibold">Simulações</h2>
          <p className="text-sm text-neutral-500">{DESCRICOES[sim]}</p>
        </div>

        <SeletorSimulacao ativa={sim} />

        {sim === "projecao" && <SecaoProjecao cargoId={cargoId} />}
        {sim === "segundo-turno" && <SecaoSegundoTurno cargoId={cargoId} />}
        {sim === "federacao" && <SecaoFederacao cargoId={cargoId} />}
        {sim === "transferencia" && <SecaoTransferencia cargoId={cargoId} />}
        {sim === "chapa" && <SecaoChapa cargoId={cargoId} />}
        {sim === "comparecimento" && <SecaoComparecimento cargoId={cargoId} />}
        {sim === "meta" && <SecaoMeta candidatoId={candidatoId} base={base} />}
      </section>
    </div>
  );
}

async function SecaoProjecao({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="projecao" />
      <CalculadoraCenarios
        key={cargoId ?? "livre"}
        vagasIniciais={dados?.vagas}
        votosValidosIniciais={dados?.votosValidos}
        rotuloReferencia={
          dados
            ? `${dados.cargoNome} · ${dados.municipioNome ?? "PA"} · ${dados.ano}`
            : undefined
        }
      />
    </div>
  );
}

async function SecaoSegundoTurno({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "MAJORITARIO" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="segundo-turno" />
      {dados && <SimuladorSegundoTurno candidatos={dados.candidatos} />}
    </div>
  );
}

async function SecaoFederacao({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="federacao" />
      {dados && (
        <SimuladorFederacao
          partidos={dados.partidos}
          vagas={dados.vagas}
          quocienteEleitoral={dados.quocienteEleitoral}
        />
      )}
    </div>
  );
}

async function SecaoTransferencia({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="transferencia" />
      {dados && (
        <SimuladorTransferencia
          candidatos={dados.candidatos}
          partidos={dados.partidos}
          vagas={dados.vagas}
        />
      )}
    </div>
  );
}

async function SecaoChapa({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="chapa" />
      {dados && (
        <SimuladorChapa candidatos={dados.candidatos} partidos={dados.partidos} vagas={dados.vagas} />
      )}
    </div>
  );
}

async function SecaoComparecimento({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="comparecimento" />
      {dados &&
        (dados.eleitores ? (
          <SimuladorComparecimento
            eleitores={dados.eleitores.eleitores}
            anoEleitorado={dados.eleitores.ano}
            vagas={dados.vagas}
            votosValidosReais={dados.votosValidos}
            quocienteReal={dados.quocienteEleitoral}
          />
        ) : (
          <p className="text-sm text-neutral-500">Sem dado de eleitorado para esse recorte.</p>
        ))}
    </div>
  );
}

async function SecaoMeta({ candidatoId, base }: { candidatoId?: string; base?: string }) {
  const baseEscolhida: BaseMeta =
    base === "partido" || base === "eleitorado" ? base : "candidato";
  const distribuicao = candidatoId
    ? await getDistribuicaoMeta(candidatoId, baseEscolhida)
    : null;
  return (
    <div className="flex flex-col gap-4">
      <BuscaCandidatoMeta base={baseEscolhida} />
      {distribuicao && <SimuladorMeta distribuicao={distribuicao} />}
    </div>
  );
}
