import { CalculadoraCenarios } from "@/components/CalculadoraCenarios";
import { SeletorSimulacao } from "@/components/simuladores/SeletorSimulacao";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SeletorCandidatoSimulacao } from "@/components/simuladores/SeletorCandidatoSimulacao";
import { SimuladorSegundoTurno } from "@/components/simuladores/SimuladorSegundoTurno";
import { SimuladorFederacao } from "@/components/simuladores/SimuladorFederacao";
import { SimuladorTransferencia } from "@/components/simuladores/SimuladorTransferencia";
import { SimuladorComparecimento } from "@/components/simuladores/SimuladorComparecimento";
import { SimuladorMeta } from "@/components/simuladores/SimuladorMeta";
import {
  getCargosParaSimulacao,
  getDadosSimulacaoCargo,
  getDistribuicaoCandidato,
} from "@/lib/data";

const DESCRICOES: Record<string, string> = {
  projecao: "Monte um cenário do zero: quociente e projeção de crescimento.",
  "segundo-turno": "Leve os dois mais votados a um 2º turno hipotético e distribua os votos dos eliminados.",
  federacao: "Una partidos em uma federação e veja o efeito na distribuição de cadeiras.",
  transferencia: "Simule uma desistência com transferência de votos e veja quem se elegeria.",
  comparecimento: "Projete o quociente eleitoral a partir do comparecimento dos eleitores.",
  meta: "Defina uma meta de votos e veja quanto falta em cada município.",
};

export default async function SimulacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ sim?: string; cargo?: string; candidato?: string }>;
}) {
  const { sim: simParam, cargo: cargoId, candidato: candidatoId } = await searchParams;
  const sim = simParam && simParam in DESCRICOES ? simParam : "projecao";

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold">Simulações</h1>
        <p className="text-sm text-neutral-500">{DESCRICOES[sim]}</p>
      </div>

      <SeletorSimulacao ativa={sim} />

      {sim === "projecao" && <CalculadoraCenarios />}
      {sim === "segundo-turno" && <SecaoSegundoTurno cargoId={cargoId} />}
      {sim === "federacao" && <SecaoFederacao cargoId={cargoId} />}
      {sim === "transferencia" && <SecaoTransferencia cargoId={cargoId} />}
      {sim === "comparecimento" && <SecaoComparecimento cargoId={cargoId} />}
      {sim === "meta" && <SecaoMeta cargoId={cargoId} candidatoId={candidatoId} />}
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

async function SecaoMeta({ cargoId, candidatoId }: { cargoId?: string; candidatoId?: string }) {
  const cargos = await getCargosParaSimulacao({ somenteEstaduais: true });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;
  const distribuicao = candidatoId ? await getDistribuicaoCandidato(candidatoId) : null;
  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="meta" />
      {dados && cargoId && (
        <SeletorCandidatoSimulacao
          candidatos={dados.candidatos}
          cargoId={cargoId}
          selecionado={candidatoId}
          sim="meta"
        />
      )}
      {distribuicao && <SimuladorMeta distribuicao={distribuicao} />}
    </div>
  );
}
