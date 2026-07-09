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

  let pedido: string;
  let dados: unknown;

  switch (tipo) {
    case "candidato": {
      const d = await dadosCandidato(params.candidatoId);
      if (!d) throw new Error("Candidato não encontrado.");
      pedido = `Relatório de desempenho eleitoral do candidato ${d.nome}: trajetória, evolução de votação, base territorial (regiões e municípios fortes), filiações e leitura estratégica para 2026.`;
      dados = d;
      break;
    }
    case "partido": {
      const d = await dadosPartido(params.partidoId);
      if (!d) throw new Error("Partido não encontrado.");
      pedido = `Relatório de desempenho do partido ${d.sigla} no Pará: evolução de votos e eleitos por eleição (2012-2024), presença municipal, bancadas e leitura estratégica para 2026.`;
      dados = d;
      break;
    }
    case "municipio": {
      const d = await dadosMunicipio(params.municipioId);
      if (!d) throw new Error("Município não encontrado.");
      pedido = `Raio-X eleitoral do município de ${d.nome} (PA): perfil, histórico de prefeitos, forças políticas atuais, desempenho dos deputados na cidade e leitura estratégica para 2026.`;
      dados = d;
      break;
    }
    case "comparativo": {
      const anoA = Number(params.anoA);
      const anoB = Number(params.anoB);
      const [a, b] = await Promise.all([dadosAno(anoA), dadosAno(anoB)]);
      if (!a || !b) throw new Error("Eleição não encontrada.");
      pedido = `Comparativo entre as eleições de ${anoA} e ${anoB} no Pará: participação, força dos partidos, mudanças de cadeiras e o que a variação indica.`;
      dados = { eleicaoA: a, eleicaoB: b };
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

  const conteudo = await chamarClaude(pedido, dados);

  const salvo = await prisma.relatorio.create({
    data: {
      userId,
      tipo,
      titulo: conteudo.titulo,
      parametros: JSON.stringify({ ...params, pedido }),
      conteudo: JSON.stringify(conteudo),
      modelo: MODELO,
    },
  });

  return salvo;
}
