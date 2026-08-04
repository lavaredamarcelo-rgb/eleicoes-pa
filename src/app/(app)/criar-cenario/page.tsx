import Link from "next/link";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SimuladorMetaManual } from "@/components/simuladores/SimuladorMetaManual";
import { CriadorCenario } from "@/components/CriadorCenario";
import { CriadorCenarioMajoritario } from "@/components/CriadorCenarioMajoritario";
import {
  getCargosParaSimulacao,
  getDadosSimulacaoCargoOuProjetado,
  getMunicipiosParaMeta,
  getPartidos,
  getReferenciaisViabilidade,
} from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { verifySession } from "@/lib/dal";

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
  const cargosReais = await getCargosParaSimulacao({});

  // Disputas futuras: para cada cargo estadual do ano mais recente
  // (proporcionais E majoritários), uma entrada projetada ("proj:<id>")
  // escalada pelo eleitorado da próxima eleição (oficial do TSE quando
  // publicado) — ex.: Dep. Estadual, Governador e Senador 2026.
  const anoEstadualMax = Math.max(
    0,
    ...cargosReais.filter((c) => !c.municipioNome).map((c) => c.ano)
  );
  const anoFuturo = anoEstadualMax % 2 === 0 ? anoEstadualMax + 4 : anoEstadualMax + 3;
  const cargosFuturos = cargosReais
    .filter((c) => !c.municipioNome && c.ano === anoEstadualMax)
    .map((c) => ({
      id: `proj:${c.id}`,
      nome: `${c.nome} (projeção)`,
      ano: anoFuturo,
      municipioNome: null,
    }));
  const cargos = [...cargosFuturos, ...cargosReais];

  const carga = cargoId ? await getDadosSimulacaoCargoOuProjetado(cargoId) : null;
  const dados = carga?.dados ?? null;
  const votosLegenda = carga?.votosLegenda ?? {};

  const partidos = dados ? await getPartidos() : [];

  const session = await verifySession();
  const [municipios, referenciais, cenariosSalvos] =
    dados && carga && modo === "meta"
      ? await Promise.all([
          getMunicipiosParaMeta(),
          getReferenciaisViabilidade(carga.baseCargoId),
          prisma.cenarioMeta.findMany({
            where: { userId: String(session.userId), cargoId: carga.baseCargoId },
            orderBy: { updatedAt: "desc" },
          }),
        ])
      : [null, null, null];

  const rotuloDisputa = dados
    ? `${dados.cargoNome} · ${dados.municipioNome ?? "PA"} · ${dados.ano}${carga?.projetado ? " (projeção)" : ""}`
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
          {carga?.projetado && (
            <p className="rounded-lg border border-sky-900/60 bg-sky-950/20 px-3 py-2 text-xs text-sky-300">
              🔮 Disputa <strong>projetada para {dados.ano}</strong>: parte dos resultados reais de{" "}
              {carga.anoBase} com os votos {dados.tipoApuracao === "PROPORCIONAL" ? "nominais e de legenda " : ""}
              escalados pelo eleitorado {dados.ano} (oficial do TSE).
              {dados.tipoApuracao === "PROPORCIONAL"
                ? ` QE projetado: ${dados.quocienteEleitoral.toLocaleString("pt-BR")}.`
                : dados.cargoNome === "Senador"
                  ? ` Em ${dados.ano} o Pará elege ${dados.vagas} senadores (renovação de 2/3).`
                  : ""}{" "}
              Troque nomes, partidos e votos à vontade — é o seu cenário de {dados.ano}.
            </p>
          )}
          {dados.tipoApuracao === "PROPORCIONAL" && (
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
          )}

          {dados.tipoApuracao === "MAJORITARIO" ? (
            <CriadorCenarioMajoritario
              key={dados.cargoId}
              rotulo={rotuloDisputa}
              cargoNome={dados.cargoNome}
              ano={dados.ano}
              candidatos={dados.candidatos}
              partidos={partidos}
              vagas={dados.vagas}
              projetado={carga?.projetado ?? false}
              anoBase={carga?.anoBase ?? dados.ano}
            />
          ) : modo === "chapa" ? (
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
                cenariosSalvos={(cenariosSalvos ?? []).map((c) => {
                  const votos = JSON.parse(c.votos) as Record<string, number>;
                  return {
                    id: c.id,
                    titulo: c.titulo,
                    candidatoNome: c.candidatoNome,
                    partidoId: c.partidoId,
                    votos,
                    total: Object.values(votos).reduce((s, v) => s + v, 0),
                    atualizadoEm: c.updatedAt.toLocaleString("pt-BR"),
                  };
                })}
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
