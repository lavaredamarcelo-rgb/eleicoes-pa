import Link from "next/link";
import { CalculadoraCenarios } from "@/components/CalculadoraCenarios";
import { QuocienteHierarquia } from "@/components/QuocienteHierarquia";
import { SeletorSimulacao } from "@/components/simuladores/SeletorSimulacao";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SeletorCandidatoSimulacao } from "@/components/simuladores/SeletorCandidatoSimulacao";
import { SimuladorSegundoTurno } from "@/components/simuladores/SimuladorSegundoTurno";
import { SimuladorTransferencia } from "@/components/simuladores/SimuladorTransferencia";
import { SimuladorComparecimento } from "@/components/simuladores/SimuladorComparecimento";
import { SimuladorMeta } from "@/components/simuladores/SimuladorMeta";
import { SimuladorProjecaoPercentual } from "@/components/simuladores/SimuladorProjecaoPercentual";
import { SimuladorMetaManual } from "@/components/simuladores/SimuladorMetaManual";
import { BuscaCandidatoMeta } from "@/components/simuladores/BuscaCandidatoMeta";
import {
  getCargosParaSimulacao,
  getDadosSimulacaoCargo,
  getDistribuicaoCandidato,
  getDistribuicaoMeta,
  getEleitoradoProjecao,
  getHierarquiaCargos,
  getMunicipiosParaMeta,
  type BaseMeta,
} from "@/lib/data";

const DESCRICOES: Record<string, string> = {
  projecao: "Monte um cenário do zero: quociente e projeção de crescimento.",
  "segundo-turno": "Leve os dois mais votados a um 2º turno hipotético e distribua os votos dos eliminados.",
  transferencia: "Simule uma desistência com transferência de votos e veja quem se elegeria.",
  comparecimento: "Projete o quociente eleitoral a partir do comparecimento dos eleitores.",
  meta: "Projete votos por município: percentual sobre a última eleição, meta distribuída ou cenário alimentado à mão.",
};

export default async function SimulacoesPage({
  searchParams,
}: {
  searchParams: Promise<{ sim?: string; cargo?: string; candidato?: string; base?: string; modo?: string }>;
}) {
  const { sim: simParam, cargo: cargoId, candidato: candidatoId, base, modo } = await searchParams;
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
        {sim === "transferencia" && <SecaoTransferencia cargoId={cargoId} />}
        {sim === "comparecimento" && <SecaoComparecimento cargoId={cargoId} />}
        {sim === "meta" && <SecaoMeta candidatoId={candidatoId} base={base} modo={modo} />}
      </section>
    </div>
  );
}

async function SecaoProjecao({ cargoId }: { cargoId?: string }) {
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;

  // Votos válidos projetados para a próxima eleição: eleitorado projetado do
  // recorte × a proporção votos válidos/aptos observada na disputa escolhida.
  let projecao: { ano: number; votosValidos: number } | undefined;
  if (dados?.eleitores && dados.eleitores.eleitores > 0) {
    const projecoes = await getEleitoradoProjecao();
    const entradas = dados.municipioId
      ? [projecoes.get(dados.municipioId)].filter((e) => e !== undefined)
      : Array.from(projecoes.values());
    const aptosProjetados = entradas.reduce((s, e) => s + e.projecao, 0);
    const anoProjecao = entradas.reduce((max, e) => Math.max(max, e.anoProjecao), 0);
    if (aptosProjetados > 0 && anoProjecao > 0) {
      projecao = {
        ano: anoProjecao,
        votosValidos: Math.round(aptosProjetados * (dados.votosValidos / dados.eleitores.eleitores)),
      };
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} sim="projecao" />
      <CalculadoraCenarios
        key={cargoId ?? "livre"}
        vagasIniciais={dados?.vagas}
        votosValidosIniciais={dados?.votosValidos}
        projecao={projecao}
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

const MODOS_META = [
  { chave: "percentual", rotulo: "Projeção percentual", precisaCandidato: true },
  { chave: "meta", rotulo: "Meta de votos", precisaCandidato: true },
  { chave: "manual", rotulo: "Distribuição manual", precisaCandidato: false },
] as const;

async function SecaoMeta({
  candidatoId,
  base,
  modo,
}: {
  candidatoId?: string;
  base?: string;
  modo?: string;
}) {
  const baseEscolhida: BaseMeta =
    base === "partido" || base === "eleitorado" ? base : "candidato";
  const modoEscolhido =
    modo === "meta" || modo === "manual" || modo === "percentual"
      ? modo
      : candidatoId
        ? "percentual"
        : "manual";

  const [distribuicaoCandidato, distribuicaoMeta, municipios] = await Promise.all([
    candidatoId && modoEscolhido !== "meta" ? getDistribuicaoCandidato(candidatoId) : null,
    candidatoId && modoEscolhido === "meta" ? getDistribuicaoMeta(candidatoId, baseEscolhida) : null,
    modoEscolhido === "manual" ? getMunicipiosParaMeta() : null,
  ]);

  return (
    <div className="flex flex-col gap-4">
      <BuscaCandidatoMeta base={baseEscolhida} modo={modoEscolhido} />

      <div className="flex flex-wrap gap-2">
        {MODOS_META.map((m) => {
          const desabilitado = m.precisaCandidato && !candidatoId;
          if (desabilitado) {
            return (
              <span
                key={m.chave}
                title="Escolha um candidato na busca acima"
                className="cursor-not-allowed rounded-full border border-neutral-800 px-3 py-1.5 text-xs text-neutral-600"
              >
                {m.rotulo}
              </span>
            );
          }
          return (
            <Link
              key={m.chave}
              href={`/simulacoes?sim=meta${candidatoId ? `&candidato=${candidatoId}` : ""}&base=${baseEscolhida}&modo=${m.chave}#simuladores`}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                modoEscolhido === m.chave
                  ? "bg-amber-400 text-neutral-950"
                  : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
              }`}
            >
              {m.rotulo}
            </Link>
          );
        })}
      </div>

      {modoEscolhido === "percentual" &&
        (distribuicaoCandidato ? (
          <SimuladorProjecaoPercentual distribuicao={distribuicaoCandidato} />
        ) : (
          <p className="text-sm text-neutral-500">
            Busque e escolha um candidato acima para projetar a votação dele, ou use a
            distribuição manual para montar um cenário do zero.
          </p>
        ))}

      {modoEscolhido === "meta" && distribuicaoMeta && (
        <SimuladorMeta distribuicao={distribuicaoMeta} />
      )}

      {modoEscolhido === "manual" && municipios && (
        <SimuladorMetaManual
          key={candidatoId ?? "zero"}
          municipios={municipios}
          nomeInicial={distribuicaoCandidato?.nome}
          votosIniciais={
            distribuicaoCandidato
              ? Object.fromEntries(
                  distribuicaoCandidato.municipios.map((m) => [m.municipioNome, m.votos])
                )
              : undefined
          }
        />
      )}
    </div>
  );
}
