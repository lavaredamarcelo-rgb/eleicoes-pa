import Link from "next/link";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SimuladorMetaManual } from "@/components/simuladores/SimuladorMetaManual";
import { CriadorCenario } from "@/components/CriadorCenario";
import {
  getCargosParaSimulacao,
  getDadosSimulacaoCargo,
  getMunicipiosParaMeta,
  getPartidos,
  getReferenciaisViabilidade,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";

const MODOS = [
  { chave: "chapa", rotulo: "Trocar chapa de partido" },
  { chave: "meta", rotulo: "Meta por município (manual)" },
] as const;

export default async function CriarCenarioPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; modo?: string }>;
}) {
  const { cargo: cargoId, modo: modoParam } = await searchParams;
  const modo = modoParam === "meta" ? "meta" : "chapa";
  const cargos = await getCargosParaSimulacao({ tipoApuracao: "PROPORCIONAL" });
  const dados = cargoId ? await getDadosSimulacaoCargo(cargoId) : null;

  const [partidos, legendaLinhas] = dados
    ? await Promise.all([
        getPartidos(),
        prisma.votoLegenda.findMany({ where: { cargoId: dados.cargoId, turno: 1 } }),
      ])
    : [[], []];
  const votosLegenda: Record<string, number> = {};
  for (const vl of legendaLinhas) {
    votosLegenda[vl.partidoId] = (votosLegenda[vl.partidoId] ?? 0) + vl.votos;
  }

  const [municipios, referenciais] =
    dados && modo === "meta"
      ? await Promise.all([getMunicipiosParaMeta(), getReferenciaisViabilidade(dados.cargoId)])
      : [null, null];

  const rotuloDisputa = dados
    ? `${dados.cargoNome} · ${dados.municipioNome ?? "PA"} · ${dados.ano}`
    : "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Criar Cenário</h1>
        <p className="text-sm text-neutral-500">
          Monte um cenário eleitoral completo a partir de uma eleição real: troque os nomes de um
          partido inteiro (misturando pessoas reais e fictícias), acompanhe a quota de gênero,
          planeje a convenção partidária ou distribua votos município a município com estudo de
          viabilidade. Nada aqui altera os dados oficiais.
        </p>
      </div>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-4">
        <h2 className="text-sm font-medium text-neutral-300">
          Regras para a convenção (Lei 9.504/97, art. 10)
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-neutral-500">
          Cada partido ou federação pode registrar candidatos até{" "}
          <strong className="text-neutral-300">150% do número de vagas</strong> em disputa. Do total
          de candidaturas lançadas, o partido deve reservar o{" "}
          <strong className="text-neutral-300">mínimo de 30% e o máximo de 70% para cada gênero</strong>{" "}
          (§3º) — a fração do mínimo arredonda <strong className="text-neutral-300">para cima</strong>.
          São exigidas pelo menos 2 candidaturas para que os percentuais possam ser cumpridos.
        </p>
      </section>

      <SeletorCargoSimulacao cargos={cargos} selecionado={cargoId} basePath="/criar-cenario" />

      {dados ? (
        <>
          <div className="flex flex-wrap gap-2">
            {MODOS.map((m) => (
              <Link
                key={m.chave}
                href={`/criar-cenario?cargo=${dados.cargoId}&modo=${m.chave}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  modo === m.chave
                    ? "bg-amber-400 text-neutral-950"
                    : "border border-neutral-800 bg-neutral-900 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                }`}
              >
                {m.rotulo}
              </Link>
            ))}
          </div>

          {modo === "chapa" ? (
            <CriadorCenario
              key={dados.cargoId}
              cargoId={dados.cargoId}
              rotulo={rotuloDisputa}
              candidatos={dados.candidatos}
              partidos={partidos}
              vagas={dados.vagas}
              quocienteOficial={dados.quocienteEleitoral}
              votosLegenda={votosLegenda}
            />
          ) : (
            municipios &&
            referenciais && (
              <SimuladorMetaManual
                key={dados.cargoId}
                municipios={municipios}
                estudo={{
                  cargoId: dados.cargoId,
                  rotulo: rotuloDisputa,
                  vagas: dados.vagas,
                  candidatos: dados.candidatos,
                  partidos,
                  votosLegenda,
                  referencias: referenciais.referencias,
                  projecao: referenciais.projecao,
                }}
              />
            )
          )}
        </>
      ) : (
        <p className="text-sm text-neutral-500">
          Escolha acima a disputa que servirá de base para o cenário (ex.: Deputado Estadual 2022).
        </p>
      )}
    </div>
  );
}
