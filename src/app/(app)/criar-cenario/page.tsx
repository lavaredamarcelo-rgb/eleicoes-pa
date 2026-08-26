import Link from "next/link";
import { SeletorCargoSimulacao } from "@/components/simuladores/SeletorCargoSimulacao";
import { SimuladorMetaManual } from "@/components/simuladores/SimuladorMetaManual";
import { CriadorCenario } from "@/components/CriadorCenario";
import { CriadorCenarioMajoritario } from "@/components/CriadorCenarioMajoritario";
import {
  CriadorEleicaoCompleta,
  type CandidatoEleicao,
} from "@/components/CriadorEleicaoCompleta";
import candidatosTSE from "@/data/candidatos-tse-2026.json";
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
  { chave: "eleicao", rotulo: "Eleição completa (todos os candidatos)" },
] as const;

export default async function CriarCenarioPage({
  searchParams,
}: {
  searchParams: Promise<{ cargo?: string; modo?: string }>;
}) {
  const { cargo: cargoId, modo: modoParam } = await searchParams;
  const modo =
    modoParam === "meta" ? "meta" : modoParam === "eleicao" ? "eleicao" : "chapa";
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

  // Aprovados nas convenções (aba Convenções) — viram sugestões nos
  // construtores de cenário.
  const aprovados = dados
    ? await prisma.preCandidato.findMany({
        where: { situacao: "APROVADO" },
        include: { partido: true },
        orderBy: { nome: "asc" },
      })
    : [];
  const aprovadosPorPartido: Record<string, { nome: string; cargo: string }[]> = {};
  for (const pc of aprovados) {
    (aprovadosPorPartido[pc.partidoId] ??= []).push({ nome: pc.nome, cargo: pc.cargo });
  }

  // Eleição completa: candidatos TSE 2026 da disputa + histórico real de
  // cada um (melhor votação anterior, mandato) e sugestão de total por
  // partido a partir de 2022 escalado (dados já vêm escalados no "proj:").
  const suportaEleicao =
    !!dados &&
    dados.tipoApuracao === "PROPORCIONAL" &&
    ["Deputado Estadual", "Deputado Federal"].includes(dados.cargoNome);
  let candidatosEleicao: CandidatoEleicao[] = [];
  let sugestoesEleicao: Record<string, number> = {};
  let pesquisaEleicao: Record<string, number> = {};
  let rotuloPesquisaEleicao: string | null = null;
  let cenariosEleicaoSalvos: {
    id: string;
    titulo: string;
    atualizadoEm: string;
    votos: Record<string, number>;
  }[] = [];
  if (modo === "eleicao" && suportaEleicao && dados) {
    const tse = (candidatosTSE as any[]).filter((c) => c.cargo === dados.cargoNome);
    const nomes = [...new Set(tse.map((c) => c.nome))];
    const historicos = await prisma.candidato.findMany({
      where: { nome: { in: nomes }, cargo: { eleicao: { ano: { lt: 2026 } } } },
      select: {
        nome: true,
        eleito: true,
        partido: { select: { sigla: true } },
        cargo: {
          select: { nome: true, eleicao: { select: { ano: true } } },
        },
        resultados: { select: { votos: true } },
      },
    });
    const melhorPorNome = new Map<
      string,
      { votos: number; eleito: boolean; resumo: string }
    >();
    for (const h of historicos) {
      const votosH = h.resultados.reduce((s, r) => s + r.votos, 0);
      const atual = melhorPorNome.get(h.nome);
      if (!atual || votosH > atual.votos || (h.eleito && !atual.eleito)) {
        melhorPorNome.set(h.nome, {
          votos: Math.max(votosH, atual?.votos ?? 0),
          eleito: h.eleito || (atual?.eleito ?? false),
          resumo: `${h.cargo.eleicao.ano} · ${h.cargo.nome} · ${h.partido.sigla} · ${votosH.toLocaleString("pt-BR")} votos${h.eleito ? " (eleito)" : ""}`,
        });
      }
    }
    candidatosEleicao = tse.map((c) => {
      const h = melhorPorNome.get(c.nome);
      return {
        nome: c.nome,
        numero: c.numero,
        partido: c.partido,
        situacao: c.situacao,
        histVotos: h?.votos ?? 0,
        histEleito: h?.eleito ?? false,
        histResumo: h?.resumo ?? null,
      };
    });
    // Sugestão por sigla: soma dos votos 2022 escalados (nominais + legenda)
    // dos partidos de mesma sigla.
    const siglaPorId = new Map(partidos.map((p: any) => [p.id, p.sigla]));
    const porSigla: Record<string, number> = {};
    for (const c of dados.candidatos) {
      porSigla[c.partidoSigla] = (porSigla[c.partidoSigla] ?? 0) + c.votos;
    }
    for (const [pid, v] of Object.entries(votosLegenda)) {
      const sigla = siglaPorId.get(pid);
      if (sigla) porSigla[sigla] = (porSigla[sigla] ?? 0) + (v as number);
    }
    const siglas2026 = new Set(tse.map((c) => c.partido));
    for (const sigla of siglas2026) {
      sugestoesEleicao[sigla] = Math.round(porSigla[sigla] ?? 0);
    }

    // Pesquisa mais recente da disputa entra como peso extra na geração:
    // quem pontua bem na pesquisa puxa mais votos na distribuição.
    const ultimaPesquisa = await prisma.pesquisaEleitoral.findFirst({
      where: { disputa: dados.cargoNome, turno: 1, tipo: "estimulada" },
      orderBy: { dataDivulgacao: "desc" },
      include: { resultados: true },
    });
    if (ultimaPesquisa) {
      rotuloPesquisaEleicao = `${ultimaPesquisa.instituto} (${ultimaPesquisa.dataDivulgacao.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" })}${ultimaPesquisa.cenario ? ` · ${ultimaPesquisa.cenario}` : ""})`;
      for (const r of ultimaPesquisa.resultados) {
        pesquisaEleicao[r.nome.trim().toUpperCase()] = r.percentual;
      }
    }

    const sessaoEleicao = await verifySession();
    cenariosEleicaoSalvos = (
      await prisma.cenarioEleicao.findMany({
        where: { userId: String(sessaoEleicao.userId), cargoNome: dados.cargoNome },
        orderBy: { updatedAt: "desc" },
      })
    ).map((c) => ({
      id: c.id,
      titulo: c.titulo,
      atualizadoEm: c.updatedAt.toLocaleDateString("pt-BR"),
      votos: JSON.parse(c.votos) as Record<string, number>,
    }));
  }

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
              aprovadosConvencao={aprovados
                .filter((pc) => pc.cargo === dados.cargoNome)
                .map((pc) => ({ nome: pc.nome, partidoSigla: pc.partido.sigla }))}
            />
          ) : modo === "eleicao" ? (
            suportaEleicao ? (
              <CriadorEleicaoCompleta
                key={dados.cargoId}
                rotulo={rotuloDisputa}
                cargoNome={dados.cargoNome}
                vagas={dados.vagas}
                candidatos={candidatosEleicao}
                sugestoes={sugestoesEleicao}
                pesquisa={pesquisaEleicao}
                rotuloPesquisa={rotuloPesquisaEleicao}
                cenariosSalvos={cenariosEleicaoSalvos}
              />
            ) : (
              <p className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-xs text-neutral-500">
                A Eleição Completa está disponível para Deputado Estadual e Deputado Federal
                (candidatos registrados no TSE 2026). Selecione uma dessas disputas acima —
                de preferência a projeção 2026.
              </p>
            )
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
              aprovadosPorPartido={aprovadosPorPartido}
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
