import "server-only";
import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";
import { getFiliacaoAtual, getMunicipioFicha, getEleitosDoMunicipio } from "@/lib/data";

// Relatórios analíticos gerados por IA: coletamos agregados do banco
// (somente leitura, nunca a tabela Resultado inteira), enviamos à API do
// Claude e guardamos o resultado estruturado para reexibição e PDF.

export type TipoRelatorio = "candidato" | "partido" | "municipio" | "comparativo" | "livre";

export type ConteudoRelatorio = {
  titulo: string;
  resumo: string;
  secoes: {
    titulo: string;
    paragrafos?: string[];
    destaques?: string[];
    tabela?: { colunas: string[]; linhas: string[][] } | null;
  }[];
  conclusao?: string;
};

const MODELO = process.env.RELATORIOS_MODELO ?? "claude-sonnet-5";

export function relatoriosDisponiveis() {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

// ---------------------------------------------------------------------------
// Coleta de dados por tipo de relatório

async function dadosCandidato(candidatoId: string) {
  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: { include: { municipio: { include: { regiao: true } } } },
    },
  });
  if (!candidato) return null;

  // Todas as candidaturas da pessoa (CPF ou nome completo), como na página
  // do candidato.
  const chave = candidato.cpf
    ? { cpf: candidato.cpf }
    : candidato.nomeCompleto
      ? { nomeCompleto: candidato.nomeCompleto }
      : { nome: candidato.nome };
  const candidaturas = await prisma.candidato.findMany({
    where: chave,
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: true,
    },
  });

  const filiacaoAtual = await getFiliacaoAtual(candidaturas.map((c) => c.id));

  const porRegiao = new Map<string, number>();
  for (const r of candidato.resultados.filter((r) => r.turno === 1)) {
    porRegiao.set(r.municipio.regiao.nome, (porRegiao.get(r.municipio.regiao.nome) ?? 0) + r.votos);
  }
  const topMunicipios = candidato.resultados
    .filter((r) => r.turno === 1)
    .sort((a, b) => b.votos - a.votos)
    .slice(0, 10)
    .map((r) => ({ municipio: r.municipio.nome, votos: r.votos }));

  return {
    nome: candidato.nome,
    nomeCompleto: candidato.nomeCompleto,
    filiacaoAtual: filiacaoAtual?.sigla ?? candidato.partido.sigla,
    candidaturas: candidaturas
      .map((c) => ({
        ano: c.cargo.eleicao.ano,
        cargo: c.cargo.nome,
        abrangencia: c.cargo.municipio?.nome ?? "Pará",
        partido: c.partido.sigla,
        numero: c.numero,
        votos: votosDecisivos(c.resultados),
        eleito: c.eleito,
      }))
      .sort((a, b) => a.ano - b.ano),
    ultimaEleicao: {
      ano: candidato.cargo.eleicao.ano,
      cargo: candidato.cargo.nome,
      votosPorRegiao: Array.from(porRegiao.entries()).map(([regiao, votos]) => ({ regiao, votos })),
      topMunicipios,
    },
  };
}

async function dadosPartido(partidoId: string) {
  const partido = await prisma.partido.findUnique({ where: { id: partidoId } });
  if (!partido) return null;

  const votos = await prisma.$queryRaw<{ ano: number; cargo: string; votos: bigint; eleitos: bigint }[]>`
    SELECT e.ano as ano, g.nome as cargo, SUM(r.votos) as votos,
           COUNT(DISTINCT CASE WHEN c.eleito = 1 THEN c.id END) as eleitos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE c.partidoId = ${partidoId} AND r.turno = 1
    GROUP BY e.ano, g.nome
    ORDER BY e.ano, g.nome
  `;

  const prefeituras = await prisma.candidato.findMany({
    where: {
      partidoId,
      eleito: true,
      cargo: { nome: "Prefeito", eleicao: { ano: 2024 } },
    },
    include: { cargo: { include: { municipio: true } } },
  });

  return {
    sigla: partido.sigla,
    nome: partido.nome,
    numero: partido.numero,
    fundacao: partido.fundacao,
    espectro: partido.espectro,
    federacao: partido.federacao,
    presidenteNacional: partido.presidenteNacional,
    presidenteEstadualPA: partido.presidenteEstadualPA,
    bancadaNacional: {
      senadores: partido.senadoresNacional,
      deputadosFederais: partido.deputadosNacional,
    },
    votosEEleitosPorEleicao: votos.map((v) => ({
      ano: v.ano,
      cargo: v.cargo,
      votos: Number(v.votos),
      eleitos: Number(v.eleitos),
    })),
    prefeiturasConquistadas2024: prefeituras.map((p) => p.cargo.municipio?.nome).filter(Boolean),
  };
}

async function dadosMunicipio(municipioId: string) {
  const [ficha, eleitos] = await Promise.all([
    getMunicipioFicha(municipioId),
    getEleitosDoMunicipio(municipioId),
  ]);
  if (!ficha) return null;

  const prefeitosHistorico = await prisma.$queryRaw<{ ano: number; nome: string; sigla: string; votos: bigint }[]>`
    SELECT e.ano as ano, c.nome as nome, p.sigla as sigla, SUM(r.votos) as votos
    FROM Candidato c
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    LEFT JOIN Resultado r ON r.candidatoId = c.id
    WHERE g.nome = 'Prefeito' AND g.municipioId = ${municipioId} AND c.eleito = 1
    GROUP BY c.id
    ORDER BY e.ano
  `;

  const participacao = await prisma.$queryRaw<{ ano: number; votosValidos: bigint }[]>`
    SELECT e.ano as ano, SUM(r.votos) as votosValidos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE r.municipioId = ${municipioId} AND r.turno = 1
      AND g.nome IN ('Vereador', 'Deputado Estadual')
    GROUP BY e.ano ORDER BY e.ano
  `;
  const eleitorado = await prisma.eleitorado.findMany({
    where: { municipioId },
    orderBy: { ano: "asc" },
  });

  const topEstaduais2022 = await prisma.$queryRaw<{ nome: string; cargo: string; sigla: string; votos: bigint }[]>`
    SELECT c.nome as nome, g.nome as cargo, p.sigla as sigla, SUM(r.votos) as votos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    WHERE r.municipioId = ${municipioId} AND r.turno = 1 AND e.ano = 2022
      AND g.nome IN ('Deputado Estadual', 'Deputado Federal')
    GROUP BY c.id
    ORDER BY votos DESC LIMIT 10
  `;

  return {
    nome: ficha.nome,
    regiao: ficha.regiao.nome,
    populacaoCenso2022: ficha.populacao,
    areaKm2: ficha.areaKm2,
    anoCriacao: ficha.anoCriacao,
    gentilico: ficha.gentilico,
    historiaResumo: ficha.historia,
    eleitoresAptos: { total: ficha.eleitores, ano: ficha.anoEleitorado },
    eleitoradoPorAno: eleitorado.map((e) => ({ ano: e.ano, eleitores: e.total })),
    votosValidosPorAno: participacao.map((p) => ({ ano: p.ano, votosValidos: Number(p.votosValidos) })),
    prefeitosEleitos: prefeitosHistorico.map((p) => ({
      ano: p.ano,
      nome: p.nome,
      partido: p.sigla,
      votos: Number(p.votos),
    })),
    eleicao2024: eleitos
      ? {
          prefeito: eleitos.prefeito,
          vereadoresEleitos: eleitos.vereadores.map((v) => ({
            nome: v.nome,
            partido: v.partidoSigla,
            votos: v.votos,
          })),
        }
      : null,
    maisVotadosEstaduais2022: topEstaduais2022.map((t) => ({
      nome: t.nome,
      cargo: t.cargo,
      partido: t.sigla,
      votos: Number(t.votos),
    })),
  };
}

async function dadosAno(ano: number) {
  const eleicao = await prisma.eleicao.findFirst({ where: { ano } });
  if (!eleicao) return null;
  const referencia = eleicao.tipo === "MUNICIPAL" ? "Vereador" : "Deputado Estadual";
  const majoritario = eleicao.tipo === "MUNICIPAL" ? "Prefeito" : "Governador";

  const porPartido = await prisma.$queryRaw<{ sigla: string; votos: bigint; eleitos: bigint }[]>`
    SELECT p.sigla as sigla, SUM(r.votos) as votos,
           COUNT(DISTINCT CASE WHEN c.eleito = 1 THEN c.id END) as eleitos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    WHERE e.ano = ${ano} AND g.nome = ${referencia} AND r.turno = 1
    GROUP BY p.sigla ORDER BY votos DESC
  `;
  const majoritarios = await prisma.$queryRaw<{ nome: string; sigla: string; abrangencia: string | null }[]>`
    SELECT c.nome as nome, p.sigla as sigla, m.nome as abrangencia
    FROM Candidato c
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    LEFT JOIN Municipio m ON g.municipioId = m.id
    WHERE e.ano = ${ano} AND g.nome = ${majoritario} AND c.eleito = 1
  `;
  const aptos = await prisma.eleitorado.aggregate({ where: { ano }, _sum: { total: true } });
  const votosValidos = porPartido.reduce((s, p) => s + Number(p.votos), 0);

  // Prefeituras por partido (municipal); no estadual, o governador eleito.
  const chefiaExecutivo =
    eleicao.tipo === "MUNICIPAL"
      ? Object.entries(
          majoritarios.reduce<Record<string, number>>((acc, m) => {
            acc[m.sigla] = (acc[m.sigla] ?? 0) + 1;
            return acc;
          }, {})
        )
          .map(([sigla, prefeituras]) => ({ sigla, prefeituras }))
          .sort((a, b) => b.prefeituras - a.prefeituras)
      : majoritarios.map((m) => ({ governadorEleito: m.nome, partido: m.sigla }));

  return {
    ano,
    tipo: eleicao.tipo,
    cargoProporcionalReferencia: referencia,
    votosValidosProporcional: votosValidos,
    eleitoresAptos: aptos._sum.total,
    votosEEleitosPorPartido: porPartido.slice(0, 25).map((p) => ({
      partido: p.sigla,
      votos: Number(p.votos),
      eleitos: Number(p.eleitos),
    })),
    chefiaExecutivo,
  };
}

async function dadosGerais() {
  const anos = await prisma.eleicao.findMany({ orderBy: { ano: "asc" } });
  const bancadaEstadual = await prisma.$queryRaw<{ sigla: string; eleitos: bigint }[]>`
    SELECT p.sigla as sigla, COUNT(*) as eleitos
    FROM Candidato c
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    WHERE e.ano = 2022 AND g.nome = 'Deputado Estadual' AND c.eleito = 1
    GROUP BY p.sigla ORDER BY eleitos DESC
  `;
  const prefeituras2024 = await prisma.$queryRaw<{ sigla: string; prefeituras: bigint }[]>`
    SELECT p.sigla as sigla, COUNT(*) as prefeituras
    FROM Candidato c
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Partido p ON c.partidoId = p.id
    WHERE e.ano = 2024 AND g.nome = 'Prefeito' AND c.eleito = 1
    GROUP BY p.sigla ORDER BY prefeituras DESC
  `;
  const aptos = await prisma.eleitorado.groupBy({ by: ["ano"], _sum: { total: true } });

  return {
    eleicoesDisponiveis: anos.map((e) => ({ ano: e.ano, tipo: e.tipo })),
    eleitoresAptosPorAno: aptos
      .map((a) => ({ ano: a.ano, aptos: a._sum.total }))
      .sort((a, b) => a.ano - b.ano),
    bancadaAssembleiaLegislativa2022: bancadaEstadual.map((b) => ({
      partido: b.sigla,
      cadeiras: Number(b.eleitos),
    })),
    prefeiturasPorPartido2024: prefeituras2024.map((p) => ({
      partido: p.sigla,
      prefeituras: Number(p.prefeituras),
    })),
  };
}

// ---------------------------------------------------------------------------
// Modo padrão (sem IA): monta o relatório deterministicamente a partir dos
// mesmos dados — tabelas, destaques e variações calculadas pelo sistema.

const f = (n: number | null | undefined) => (n ?? 0).toLocaleString("pt-BR");
const pct = (parte: number, todo: number) =>
  todo > 0 ? `${((parte / todo) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "—";

function padraoCandidato(d: NonNullable<Awaited<ReturnType<typeof dadosCandidato>>>): ConteudoRelatorio {
  const cands = d.candidaturas;
  const eleicoes = cands.length;
  const vitorias = cands.filter((c) => c.eleito).length;
  const ultima = cands[cands.length - 1];
  const anterioresMesmoCargo = cands.filter((c) => c.cargo === ultima.cargo && c.ano < ultima.ano);
  const anterior = anterioresMesmoCargo[anterioresMesmoCargo.length - 1];
  const variacao =
    anterior && anterior.votos > 0
      ? ` Em relação a ${anterior.ano} (mesmo cargo), a votação ${ultima.votos >= anterior.votos ? "cresceu" : "caiu"} ${pct(Math.abs(ultima.votos - anterior.votos), anterior.votos)}.`
      : "";

  const totalUltima = d.ultimaEleicao.votosPorRegiao.reduce((s, r) => s + r.votos, 0);
  const topMun = d.ultimaEleicao.topMunicipios[0];
  const maiorVotacao = [...cands].sort((a, b) => b.votos - a.votos)[0];

  const secoes: ConteudoRelatorio["secoes"] = [
    {
      titulo: "Trajetória eleitoral",
      paragrafos: [
        `${d.nome} disputou ${eleicoes} eleição(ões) entre ${cands[0].ano} e ${ultima.ano}, com ${vitorias} vitória(s). A maior votação foi em ${maiorVotacao.ano} (${maiorVotacao.cargo}), com ${f(maiorVotacao.votos)} votos.`,
      ],
      tabela: {
        colunas: ["Ano", "Cargo", "Abrangência", "Partido", "Votos", "Situação"],
        linhas: cands.map((c) => [
          String(c.ano),
          c.cargo,
          c.abrangencia,
          c.partido,
          f(c.votos),
          c.eleito ? "Eleito" : "Não eleito",
        ]),
      },
    },
  ];

  if (d.ultimaEleicao.votosPorRegiao.length > 0) {
    secoes.push({
      titulo: `Base territorial (${d.ultimaEleicao.ano})`,
      paragrafos: topMun
        ? [
            `O município mais forte foi ${topMun.municipio}, com ${f(topMun.votos)} votos (${pct(topMun.votos, totalUltima)} do total).`,
          ]
        : [],
      destaques: d.ultimaEleicao.topMunicipios
        .slice(0, 3)
        .map((m) => `${m.municipio}: ${f(m.votos)} votos`),
      tabela: {
        colunas: ["Região", "Votos", "% do total"],
        linhas: [...d.ultimaEleicao.votosPorRegiao]
          .sort((a, b) => b.votos - a.votos)
          .map((r) => [r.regiao, f(r.votos), pct(r.votos, totalUltima)]),
      },
    });
  }

  const sequencia = cands.map((c) => `${c.partido} (${c.ano})`).join(" → ");
  secoes.push({
    titulo: "Filiações partidárias",
    paragrafos: [
      `Histórico das urnas: ${sequencia}.`,
      d.filiacaoAtual !== ultima.partido
        ? `Filiação atual registrada: ${d.filiacaoAtual}.`
        : `Permanece filiado ao ${d.filiacaoAtual}.`,
    ],
  });

  return {
    titulo: `Desempenho eleitoral — ${d.nome}`,
    resumo: `${d.nome} (${d.filiacaoAtual}) disputou ${eleicoes} eleição(ões) e foi eleito ${vitorias} vez(es). Na última disputa (${ultima.cargo}, ${ultima.ano}), obteve ${f(ultima.votos)} votos e ${ultima.eleito ? "foi eleito" : "não se elegeu"}.${variacao}`,
    secoes,
  };
}

function padraoPartido(d: NonNullable<Awaited<ReturnType<typeof dadosPartido>>>): ConteudoRelatorio {
  const linhas = d.votosEEleitosPorEleicao;
  const maisEleitos = [...linhas].sort((a, b) => b.eleitos - a.eleitos)[0];
  const secoes: ConteudoRelatorio["secoes"] = [
    {
      titulo: "Votos e eleitos por eleição (2012–2024)",
      tabela: {
        colunas: ["Ano", "Cargo", "Votos", "Eleitos"],
        linhas: linhas.map((l) => [String(l.ano), l.cargo, f(l.votos), String(l.eleitos)]),
      },
      destaques: maisEleitos
        ? [`Melhor resultado: ${maisEleitos.eleitos} eleitos para ${maisEleitos.cargo} em ${maisEleitos.ano}`]
        : [],
    },
  ];

  if (d.prefeiturasConquistadas2024.length > 0) {
    secoes.push({
      titulo: "Prefeituras conquistadas em 2024",
      paragrafos: [
        `${d.prefeiturasConquistadas2024.length} prefeitura(s): ${d.prefeiturasConquistadas2024.slice(0, 40).join(", ")}${d.prefeiturasConquistadas2024.length > 40 ? "…" : ""}.`,
      ],
    });
  }

  secoes.push({
    titulo: "Ficha do partido",
    tabela: {
      colunas: ["Indicador", "Valor"],
      linhas: [
        ["Número", String(d.numero)],
        ["Fundação", d.fundacao ? String(d.fundacao) : "—"],
        ["Espectro", d.espectro ?? "—"],
        ["Federação", d.federacao ?? "—"],
        ["Presidente nacional", d.presidenteNacional ?? "—"],
        ["Presidente estadual (PA)", d.presidenteEstadualPA ?? "—"],
        ["Senadores (Brasil)", d.bancadaNacional.senadores != null ? String(d.bancadaNacional.senadores) : "—"],
        ["Deputados federais (Brasil)", d.bancadaNacional.deputadosFederais != null ? String(d.bancadaNacional.deputadosFederais) : "—"],
      ],
    },
  });

  return {
    titulo: `Desempenho do ${d.sigla} no Pará`,
    resumo: `O ${d.sigla} (${d.nome}) conquistou ${d.prefeiturasConquistadas2024.length} prefeitura(s) em 2024 e tem ${d.bancadaNacional.senadores ?? 0} senador(es) e ${d.bancadaNacional.deputadosFederais ?? 0} deputado(s) federal(is) no Congresso. A tabela abaixo mostra a evolução de votos e eleitos no estado desde 2012.`,
    secoes,
  };
}

function padraoMunicipio(d: NonNullable<Awaited<ReturnType<typeof dadosMunicipio>>>): ConteudoRelatorio {
  const aptosPorAno = new Map(d.eleitoradoPorAno.map((e) => [e.ano, e.eleitores]));
  const densidade =
    d.areaKm2 && d.populacaoCenso2022
      ? (d.populacaoCenso2022 / d.areaKm2).toLocaleString("pt-BR", { maximumFractionDigits: 1 })
      : "—";

  const secoes: ConteudoRelatorio["secoes"] = [
    {
      titulo: "Perfil",
      paragrafos: d.historiaResumo ? [d.historiaResumo] : [],
      tabela: {
        colunas: ["Indicador", "Valor"],
        linhas: [
          ["Região", d.regiao],
          ["Criação do município", d.anoCriacao ? String(d.anoCriacao) : "—"],
          ["População (Censo 2022)", f(d.populacaoCenso2022)],
          ["Área territorial", d.areaKm2 ? `${f(Math.round(d.areaKm2))} km²` : "—"],
          ["Densidade", `${densidade} hab./km²`],
          ["Gentílico", d.gentilico ?? "—"],
          [
            `Eleitores aptos${d.eleitoresAptos.ano ? ` (${d.eleitoresAptos.ano})` : ""}`,
            f(d.eleitoresAptos.total),
          ],
        ],
      },
    },
    {
      titulo: "Prefeitos eleitos (histórico)",
      tabela: {
        colunas: ["Ano", "Prefeito", "Partido", "Votos"],
        linhas: d.prefeitosEleitos.map((p) => [String(p.ano), p.nome, p.partido, f(p.votos)]),
      },
    },
  ];

  if (d.eleicao2024?.prefeito) {
    const pref = d.eleicao2024.prefeito;
    secoes.push({
      titulo: "Forças políticas atuais (eleição de 2024)",
      paragrafos: [
        `Prefeito eleito: ${pref.nome} (${pref.partidoSigla})${pref.viceNome ? `, com ${pref.viceNome} de vice` : ""}, com ${f(pref.votos)} votos.`,
      ],
      tabela: {
        colunas: ["Vereador eleito", "Partido", "Votos"],
        linhas: d.eleicao2024.vereadoresEleitos.map((v) => [v.nome, v.partido, f(v.votos)]),
      },
    });
  }

  if (d.maisVotadosEstaduais2022.length > 0) {
    secoes.push({
      titulo: "Deputados mais votados na cidade (2022)",
      tabela: {
        colunas: ["Candidato", "Cargo", "Partido", "Votos"],
        linhas: d.maisVotadosEstaduais2022.map((m) => [m.nome, m.cargo, m.partido, f(m.votos)]),
      },
    });
  }

  if (d.votosValidosPorAno.length > 0) {
    secoes.push({
      titulo: "Participação por eleição",
      paragrafos: [
        "Votos nominais do cargo proporcional (Vereador/Deputado Estadual) em relação aos eleitores aptos do ano, quando disponível.",
      ],
      tabela: {
        colunas: ["Ano", "Votos válidos", "Eleitores aptos", "Proporção"],
        linhas: d.votosValidosPorAno.map((v) => {
          const aptos = aptosPorAno.get(v.ano);
          return [String(v.ano), f(v.votosValidos), aptos ? f(aptos) : "—", aptos ? pct(v.votosValidos, aptos) : "—"];
        }),
      },
    });
  }

  return {
    titulo: `Raio-X eleitoral — ${d.nome}`,
    resumo: `${d.nome} (${d.regiao}) tem ${f(d.populacaoCenso2022)} habitantes e ${f(d.eleitoresAptos.total)} eleitores aptos${d.eleitoresAptos.ano ? ` (${d.eleitoresAptos.ano})` : ""}${d.populacaoCenso2022 ? ` — ${pct(d.eleitoresAptos.total, d.populacaoCenso2022)} da população` : ""}. ${d.eleicao2024?.prefeito ? `O prefeito eleito em 2024 é ${d.eleicao2024.prefeito.nome} (${d.eleicao2024.prefeito.partidoSigla}).` : ""}`,
    secoes,
  };
}

function padraoComparativo(
  a: NonNullable<Awaited<ReturnType<typeof dadosAno>>>,
  b: NonNullable<Awaited<ReturnType<typeof dadosAno>>>
): ConteudoRelatorio {
  const partB = new Map(b.votosEEleitosPorPartido.map((p) => [p.partido, p]));
  const linhasPartidos = a.votosEEleitosPorPartido.slice(0, 15).map((pa) => {
    const pb = partB.get(pa.partido);
    return [pa.partido, f(pa.votos), String(pa.eleitos), pb ? f(pb.votos) : "—", pb ? String(pb.eleitos) : "—"];
  });

  const mesmoTipo = a.tipo === b.tipo;
  const destaques: string[] = [];
  if (mesmoTipo) {
    const deltas = a.votosEEleitosPorPartido
      .map((pa) => ({ partido: pa.partido, delta: (partB.get(pa.partido)?.eleitos ?? 0) - pa.eleitos }))
      .filter((d) => d.delta !== 0)
      .sort((x, y) => y.delta - x.delta);
    if (deltas[0]) destaques.push(`Maior ganho de eleitos (${a.cargoProporcionalReferencia}): ${deltas[0].partido} (${deltas[0].delta > 0 ? "+" : ""}${deltas[0].delta})`);
    const pior = deltas[deltas.length - 1];
    if (pior && pior.delta < 0) destaques.push(`Maior perda: ${pior.partido} (${pior.delta})`);
  }

  const execLinhas = (d: NonNullable<Awaited<ReturnType<typeof dadosAno>>>) =>
    d.chefiaExecutivo
      .map((c) =>
        "prefeituras" in c ? `${c.sigla}: ${c.prefeituras}` : `${c.governadorEleito} (${c.partido})`
      )
      .slice(0, 12)
      .join(" · ");

  return {
    titulo: `Comparativo ${a.ano} × ${b.ano}`,
    resumo: `Em ${a.ano} (${a.tipo === "MUNICIPAL" ? "municipal" : "estadual"}), o cargo proporcional de referência (${a.cargoProporcionalReferencia}) somou ${f(a.votosValidosProporcional)} votos nominais para ${f(a.eleitoresAptos)} eleitores aptos (${pct(a.votosValidosProporcional, a.eleitoresAptos ?? 0)}); em ${b.ano}, ${f(b.votosValidosProporcional)} votos para ${f(b.eleitoresAptos)} aptos (${pct(b.votosValidosProporcional, b.eleitoresAptos ?? 0)}).${mesmoTipo ? "" : " Atenção: as eleições são de tipos diferentes (municipal × estadual), então os cargos comparados não são os mesmos."}`,
    secoes: [
      {
        titulo: "Números gerais",
        tabela: {
          colunas: ["Indicador", String(a.ano), String(b.ano)],
          linhas: [
            ["Tipo", a.tipo === "MUNICIPAL" ? "Municipal" : "Estadual", b.tipo === "MUNICIPAL" ? "Municipal" : "Estadual"],
            ["Cargo de referência", a.cargoProporcionalReferencia, b.cargoProporcionalReferencia],
            ["Votos nominais (referência)", f(a.votosValidosProporcional), f(b.votosValidosProporcional)],
            ["Eleitores aptos", f(a.eleitoresAptos), f(b.eleitoresAptos)],
          ],
        },
      },
      {
        titulo: `Partidos — votos e eleitos (${a.cargoProporcionalReferencia} ${a.ano} × ${b.cargoProporcionalReferencia} ${b.ano})`,
        destaques,
        tabela: {
          colunas: ["Partido", `Votos ${a.ano}`, `Eleitos ${a.ano}`, `Votos ${b.ano}`, `Eleitos ${b.ano}`],
          linhas: linhasPartidos,
        },
      },
      {
        titulo: "Chefia do Executivo",
        paragrafos: [`${a.ano}: ${execLinhas(a) || "—"}.`, `${b.ano}: ${execLinhas(b) || "—"}.`],
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// Geração

const SISTEMA = `Você é um analista político-eleitoral especializado no estado do Pará, escrevendo para uma equipe de campanha. Receberá um pedido e um conjunto de DADOS OFICIAIS (TSE/IBGE/Câmara/Senado) em JSON.

Regras obrigatórias:
- Use SOMENTE os números fornecidos nos dados; nunca invente ou estime valores que não estejam lá.
- Se os dados não cobrirem parte do pedido, diga isso explicitamente na seção final.
- Escreva em português do Brasil, tom profissional e direto; números no formato brasileiro (1.234.567).
- Traga análise de verdade: tendências, comparações e implicações práticas para 2026 quando fizer sentido — não apenas repetição dos números.

Responda APENAS com um JSON válido (sem markdown, sem texto fora do JSON) neste formato:
{
  "titulo": "...",
  "resumo": "parágrafo único com as conclusões principais",
  "secoes": [
    {
      "titulo": "...",
      "paragrafos": ["...", "..."],
      "destaques": ["ponto curto e forte", "..."],
      "tabela": { "colunas": ["..."], "linhas": [["...", "..."]] }
    }
  ],
  "conclusao": "fechamento com recomendações"
}
Os campos "destaques" e "tabela" são opcionais por seção. Use de 3 a 6 seções.`;

async function chamarClaude(pedido: string, dados: unknown): Promise<ConteudoRelatorio> {
  const chave = process.env.ANTHROPIC_API_KEY;
  if (!chave) throw new Error("ANTHROPIC_API_KEY não configurada.");

  const resp = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": chave,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: MODELO,
      max_tokens: 4096,
      system: SISTEMA,
      messages: [
        {
          role: "user",
          content: `PEDIDO: ${pedido}\n\nDADOS OFICIAIS (JSON):\n${JSON.stringify(dados)}`,
        },
      ],
    }),
  });
  if (!resp.ok) {
    const corpo = await resp.text();
    throw new Error(`API da Anthropic respondeu ${resp.status}: ${corpo.slice(0, 300)}`);
  }
  const d = (await resp.json()) as { content: { type: string; text?: string }[] };
  const texto = d.content.find((c) => c.type === "text")?.text ?? "";

  // O modelo é instruído a devolver só JSON; ainda assim, toleramos cercas
  // de código ou texto ao redor.
  const inicio = texto.indexOf("{");
  const fim = texto.lastIndexOf("}");
  try {
    const json = JSON.parse(texto.slice(inicio, fim + 1)) as ConteudoRelatorio;
    if (!json.titulo || !Array.isArray(json.secoes)) throw new Error("estrutura inesperada");
    return json;
  } catch {
    return {
      titulo: "Relatório",
      resumo: "",
      secoes: [{ titulo: "Análise", paragrafos: [texto.trim()] }],
    };
  }
}

export async function gerarRelatorio(opts: {
  userId: string;
  tipo: TipoRelatorio;
  params: Record<string, string>;
}) {
  const { userId, tipo, params } = opts;

  const usarIA = relatoriosDisponiveis();
  if (tipo === "livre" && !usarIA) {
    throw new Error("O pedido livre precisa da análise por IA (configure a ANTHROPIC_API_KEY).");
  }

  let pedido: string;
  let dados: unknown;
  let conteudoPadrao: ConteudoRelatorio | null = null;

  switch (tipo) {
    case "candidato": {
      const d = await dadosCandidato(params.candidatoId);
      if (!d) throw new Error("Candidato não encontrado.");
      pedido = `Relatório de desempenho eleitoral do candidato ${d.nome}: trajetória, evolução de votação, base territorial (regiões e municípios fortes), filiações e leitura estratégica para 2026.`;
      dados = d;
      if (!usarIA) conteudoPadrao = padraoCandidato(d);
      break;
    }
    case "partido": {
      const d = await dadosPartido(params.partidoId);
      if (!d) throw new Error("Partido não encontrado.");
      pedido = `Relatório de desempenho do partido ${d.sigla} no Pará: evolução de votos e eleitos por eleição (2012-2024), presença municipal, bancadas e leitura estratégica para 2026.`;
      dados = d;
      if (!usarIA) conteudoPadrao = padraoPartido(d);
      break;
    }
    case "municipio": {
      const d = await dadosMunicipio(params.municipioId);
      if (!d) throw new Error("Município não encontrado.");
      pedido = `Raio-X eleitoral do município de ${d.nome} (PA): perfil, histórico de prefeitos, forças políticas atuais, desempenho dos deputados na cidade e leitura estratégica para 2026.`;
      dados = d;
      if (!usarIA) conteudoPadrao = padraoMunicipio(d);
      break;
    }
    case "comparativo": {
      const anoA = Number(params.anoA);
      const anoB = Number(params.anoB);
      const [a, b] = await Promise.all([dadosAno(anoA), dadosAno(anoB)]);
      if (!a || !b) throw new Error("Eleição não encontrada.");
      pedido = `Comparativo entre as eleições de ${anoA} e ${anoB} no Pará: participação, força dos partidos, mudanças de cadeiras e o que a variação indica.`;
      dados = { eleicaoA: a, eleicaoB: b };
      if (!usarIA) conteudoPadrao = padraoComparativo(a, b);
      break;
    }
    case "livre": {
      const texto = (params.pedido ?? "").trim();
      if (texto.length < 10) throw new Error("Descreva o que você quer no relatório.");
      pedido = texto;
      dados = await dadosGerais();
      break;
    }
    default:
      throw new Error("Tipo de relatório inválido.");
  }

  const conteudo = conteudoPadrao ?? (await chamarClaude(pedido, dados));

  const salvo = await prisma.relatorio.create({
    data: {
      userId,
      tipo,
      titulo: conteudo.titulo,
      parametros: JSON.stringify({ ...params, pedido }),
      conteudo: JSON.stringify(conteudo),
      modelo: conteudoPadrao ? "padrao" : MODELO,
    },
  });

  return salvo;
}
