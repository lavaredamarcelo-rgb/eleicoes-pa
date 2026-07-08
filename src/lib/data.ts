import "server-only";
import { prisma } from "@/lib/prisma";
import { votosTurno, votosDecisivos } from "@/lib/turnos";

// Anos de eleição que têm eleitos oficiais (flag do TSE) — alimenta o
// seletor da aba "Eleitos" e exclui naturalmente eleições futuras.
export async function getAnosComEleitos() {
  const anos = await prisma.eleicao.findMany({
    where: { cargos: { some: { candidatos: { some: { eleito: true } } } } },
    select: { ano: true },
    orderBy: { ano: "desc" },
  });
  return anos.map((a) => a.ano);
}

// Eleitos oficiais de um ano (situação DS_SIT_TOT_TURNO do TSE), agrupados
// por cargo e, dentro do cargo, por município quando for disputa municipal.
export async function getEleitosOficiais(ano: number) {
  const candidatos = await prisma.candidato.findMany({
    where: { eleito: true, cargo: { eleicao: { ano } } },
    include: {
      partido: true,
      cargo: { include: { municipio: true } },
      resultados: true,
    },
  });

  type Eleito = {
    id: string;
    nome: string;
    numero: number;
    partidoSigla: string;
    votos: number;
    viceNome: string | null;
  };
  type GrupoMunicipio = { municipioId: string; municipioNome: string; eleitos: Eleito[] };
  type GrupoCargo = {
    cargoNome: string;
    escopo: "estadual" | "municipal";
    eleitos: Eleito[];
    municipios: Map<string, GrupoMunicipio>;
  };

  const porCargo = new Map<string, GrupoCargo>();

  for (const c of candidatos) {
    const nome = c.cargo.nome;
    let grupo = porCargo.get(nome);
    if (!grupo) {
      grupo = {
        cargoNome: nome,
        escopo: c.cargo.municipio ? "municipal" : "estadual",
        eleitos: [],
        municipios: new Map(),
      };
      porCargo.set(nome, grupo);
    }

    const eleito: Eleito = {
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partidoSigla: c.partido.sigla,
      votos: votosDecisivos(c.resultados),
      viceNome: c.viceNome,
    };

    if (c.cargo.municipio) {
      let gm = grupo.municipios.get(c.cargo.municipio.id);
      if (!gm) {
        gm = { municipioId: c.cargo.municipio.id, municipioNome: c.cargo.municipio.nome, eleitos: [] };
        grupo.municipios.set(c.cargo.municipio.id, gm);
      }
      gm.eleitos.push(eleito);
    } else {
      grupo.eleitos.push(eleito);
    }
  }

  const ordemCargos = ["Governador", "Senador", "Deputado Federal", "Deputado Estadual", "Prefeito", "Vereador"];

  return Array.from(porCargo.values())
    .sort((a, b) => {
      const ia = ordemCargos.indexOf(a.cargoNome);
      const ib = ordemCargos.indexOf(b.cargoNome);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
    })
    .map((g) => ({
      cargoNome: g.cargoNome,
      escopo: g.escopo,
      eleitos: g.eleitos.sort((a, b) => b.votos - a.votos),
      municipios: Array.from(g.municipios.values())
        .map((m) => ({ ...m, eleitos: m.eleitos.sort((a, b) => b.votos - a.votos) }))
        .sort((a, b) => a.municipioNome.localeCompare(b.municipioNome, "pt-BR")),
      totalEleitos:
        g.eleitos.length +
        Array.from(g.municipios.values()).reduce((s, m) => s + m.eleitos.length, 0),
    }));
}

export async function getEleicoes() {
  return prisma.eleicao.findMany({
    include: { cargos: { include: { municipio: true } } },
    orderBy: { ano: "desc" },
  });
}

// Estrutura em três níveis para a Início: ano -> cargo -> município, com o
// total de votos de cada município naquele cargo. Para cargos estaduais
// (um único Cargo para o estado todo), os votos são agregados a partir dos
// resultados de cada município; para cargos municipais (um Cargo por
// município), é a soma direta dos candidatos daquele Cargo.
export async function getHierarquiaDisputas() {
  // Agregação feita no banco: carregar 460k+ resultados com objetos
  // aninhados estourava a memória do container em produção.
  const linhas = await prisma.$queryRaw<
    {
      cargoId: string;
      cargoNome: string;
      tipoApuracao: string;
      ano: number;
      tipo: string;
      municipioId: string;
      municipioNome: string;
      votos: bigint;
    }[]
  >`
    SELECT g.id as cargoId, g.nome as cargoNome, g.tipoApuracao as tipoApuracao,
           e.ano as ano, e.tipo as tipo,
           r.municipioId as municipioId, m.nome as municipioNome,
           SUM(r.votos) as votos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    JOIN Municipio m ON r.municipioId = m.id
    WHERE r.turno = 1
    GROUP BY g.id, r.municipioId
  `;

  type MunicipioVoto = { municipioId: string; municipioNome: string; totalVotos: number; cargoId: string };
  type CargoGrupo = { cargoNome: string; tipoApuracao: string; municipios: MunicipioVoto[] };
  type AnoGrupo = { ano: number; tipo: string; cargos: Map<string, CargoGrupo> };

  const porAno = new Map<number, AnoGrupo>();

  for (const l of linhas) {
    let anoGrupo = porAno.get(l.ano);
    if (!anoGrupo) {
      anoGrupo = { ano: l.ano, tipo: l.tipo, cargos: new Map() };
      porAno.set(l.ano, anoGrupo);
    }
    let cargoGrupo = anoGrupo.cargos.get(l.cargoNome);
    if (!cargoGrupo) {
      cargoGrupo = { cargoNome: l.cargoNome, tipoApuracao: l.tipoApuracao, municipios: [] };
      anoGrupo.cargos.set(l.cargoNome, cargoGrupo);
    }
    cargoGrupo.municipios.push({
      municipioId: l.municipioId,
      municipioNome: l.municipioNome,
      totalVotos: Number(l.votos),
      cargoId: l.cargoId,
    });
  }

  // Eleitores aptos por ano, para mostrar o percentual de votos válidos.
  const eleitorado = await prisma.eleitorado.groupBy({ by: ["ano"], _sum: { total: true } });
  const aptosPorAno = new Map(eleitorado.map((e) => [e.ano, e._sum.total ?? 0]));

  return Array.from(porAno.values())
    .sort((a, b) => b.ano - a.ano)
    .map((anoGrupo) => {
      const referencia = anoGrupo.cargos.get(CARGO_REFERENCIA[anoGrupo.tipo]);
      const votosValidos = referencia
        ? referencia.municipios.reduce((s, m) => s + m.totalVotos, 0)
        : 0;
      const eleitoresAptos = aptosPorAno.get(anoGrupo.ano) ?? 0;
      return {
        ano: anoGrupo.ano,
        tipo: anoGrupo.tipo,
        votosValidos,
        eleitoresAptos,
        cargos: Array.from(anoGrupo.cargos.values()).map((c) => ({
          ...c,
          municipios: c.municipios.sort((a, b) =>
            a.municipioNome.localeCompare(b.municipioNome, "pt-BR")
          ),
        })),
      };
    });
}

// Votos válidos (nominais) por eleição. Como o banco não separa 1º e 2º
// turno, cargos majoritários somariam os dois turnos e inflariam o total;
// por isso a referência é o cargo proporcional do ano (Vereador nas
// municipais, Deputado Estadual nas estaduais), que sempre tem turno único.
const CARGO_REFERENCIA: Record<string, string> = {
  MUNICIPAL: "Vereador",
  ESTADUAL: "Deputado Estadual",
};

export async function getVotosValidosPorAno() {
  const linhas = await prisma.$queryRaw<{ ano: number; tipo: string; nome: string; votos: bigint }[]>`
    SELECT e.ano as ano, e.tipo as tipo, g.nome as nome, SUM(r.votos) as votos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE r.turno = 1
    GROUP BY e.ano, e.tipo, g.nome
  `;
  const legenda = await prisma.$queryRaw<{ ano: number; tipo: string; nome: string; votos: bigint }[]>`
    SELECT e.ano as ano, e.tipo as tipo, g.nome as nome, SUM(v.votos) as votos
    FROM VotoLegenda v
    JOIN Cargo g ON v.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE v.turno = 1
    GROUP BY e.ano, e.tipo, g.nome
  `;

  const porAno = new Map<number, number>();
  for (const l of [...linhas, ...legenda]) {
    if (l.nome === CARGO_REFERENCIA[l.tipo]) {
      porAno.set(l.ano, (porAno.get(l.ano) ?? 0) + Number(l.votos));
    }
  }

  return Array.from(porAno.entries())
    .filter(([, total]) => total > 0)
    .sort((a, b) => a[0] - b[0])
    .map(([ano, total]) => ({ ano, total }));
}

// Eleitorado atual do estado: soma de todos os municípios no ano mais
// recente importado do TSE.
export async function getEleitoradoAtual() {
  const registros = await prisma.eleitorado.findMany();
  if (registros.length === 0) return null;
  const ano = Math.max(...registros.map((r) => r.ano));
  const total = registros.filter((r) => r.ano === ano).reduce((s, r) => s + r.total, 0);
  return { ano, total };
}

// Anos das eleições mais recentes por tipo — definem quem está com mandato
// vigente (municipais: prefeitos/vereadores; estaduais: governador,
// deputados e senador; senadores têm mandato de 8 anos, então a eleição
// estadual anterior também conta para Senador).
export async function getAnosMandatoAtual() {
  const anos = await prisma.eleicao.findMany({
    where: { cargos: { some: { candidatos: { some: { eleito: true } } } } },
    select: { ano: true, tipo: true },
  });
  const municipais = anos.filter((a) => a.tipo === "MUNICIPAL").map((a) => a.ano);
  const estaduais = anos.filter((a) => a.tipo === "ESTADUAL").map((a) => a.ano).sort((a, b) => b - a);
  return {
    municipal: municipais.length ? Math.max(...municipais) : null,
    estadual: estaduais[0] ?? null,
    estadualAnterior: estaduais[1] ?? null,
  };
}

export async function getTotalEleitosComMandato() {
  const anos = await getAnosMandatoAtual();
  let total = 0;
  if (anos.municipal) {
    total += await prisma.candidato.count({
      where: { eleito: true, cargo: { eleicao: { ano: anos.municipal } } },
    });
  }
  if (anos.estadual) {
    total += await prisma.candidato.count({
      where: { eleito: true, cargo: { eleicao: { ano: anos.estadual } } },
    });
  }
  if (anos.estadualAnterior) {
    total += await prisma.candidato.count({
      where: { eleito: true, cargo: { nome: "Senador", eleicao: { ano: anos.estadualAnterior } } },
    });
  }
  return total;
}

// Total de eleitorado do estado por ano (soma de todos os municípios),
// incluindo a projeção para a próxima eleição municipal (2028).
export async function getEleitoradoEstadoPorAno() {
  const registros = await prisma.eleitorado.findMany({ orderBy: { ano: "asc" } });

  const porAno = new Map<number, number>();
  for (const r of registros) {
    porAno.set(r.ano, (porAno.get(r.ano) ?? 0) + r.total);
  }

  const anos = Array.from(porAno.entries()).sort((a, b) => a[0] - b[0]);
  const pontos = anos.map(([ano, total]) => ({ ano, total, projetado: false }));

  if (anos.length >= 2) {
    const [primeiroAno, primeiroTotal] = anos[0];
    const [ultimoAno, ultimoTotal] = anos[anos.length - 1];
    const anosSpan = ultimoAno - primeiroAno;
    const taxaAnual = anosSpan > 0 && primeiroTotal > 0 ? Math.pow(ultimoTotal / primeiroTotal, 1 / anosSpan) - 1 : 0;
    const anoProjecao = ANO_PROJECAO_ELEITORADO;
    if (anoProjecao > ultimoAno) {
      const projecao = Math.round(ultimoTotal * Math.pow(1 + taxaAnual, anoProjecao - ultimoAno));
      pontos.push({ ano: anoProjecao, total: projecao, projetado: true });
    }
  }

  return pontos;
}

const ANO_PROJECAO_ELEITORADO = 2028;

export async function getCargos() {
  return prisma.cargo.findMany({
    include: { eleicao: true, municipio: true },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
  });
}

// Estrutura em três níveis para a página de Quociente: ano -> cargo -> (se
// municipal) lista de municípios com o respectivo cargoId. Cargos estaduais
// (Governador, Deputado Estadual/Federal) têm um único registro por ano, sem
// nível de município.
export async function getHierarquiaCargos() {
  const cargos = await getCargos();

  const porAno = new Map<
    number,
    Map<
      string,
      {
        cargoNome: string;
        tipoApuracao: string;
        escopo: "estadual" | "municipal";
        cargoId?: string;
        municipios: { municipioId: string; municipioNome: string; cargoId: string }[];
      }
    >
  >();

  for (const cargo of cargos) {
    const ano = cargo.eleicao.ano;
    if (!porAno.has(ano)) porAno.set(ano, new Map());
    const grupoAno = porAno.get(ano)!;

    if (!grupoAno.has(cargo.nome)) {
      grupoAno.set(cargo.nome, {
        cargoNome: cargo.nome,
        tipoApuracao: cargo.tipoApuracao,
        escopo: cargo.municipio ? "municipal" : "estadual",
        cargoId: cargo.municipio ? undefined : cargo.id,
        municipios: [],
      });
    }
    if (cargo.municipio) {
      grupoAno.get(cargo.nome)!.municipios.push({
        municipioId: cargo.municipio.id,
        municipioNome: cargo.municipio.nome,
        cargoId: cargo.id,
      });
    }
  }

  return Array.from(porAno.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([ano, grupoAno]) => ({
      ano,
      cargos: Array.from(grupoAno.values())
        .map((c) => ({
          ...c,
          municipios: c.municipios.sort((a, b) => a.municipioNome.localeCompare(b.municipioNome, "pt-BR")),
        }))
        .sort((a, b) => a.cargoNome.localeCompare(b.cargoNome, "pt-BR")),
    }));
}

// Número de eleitores aptos disponível para o cargo (do município, ou soma
// estadual para cargos sem município), usando o ano de Eleitorado mais
// recente conhecido até o ano da eleição do cargo.
export async function getEleitoresCargo(municipioId: string | null, anoEleicao: number) {
  if (municipioId) {
    const registro = await prisma.eleitorado.findFirst({
      where: { municipioId, ano: { lte: anoEleicao } },
      orderBy: { ano: "desc" },
    });
    return registro ? { eleitores: registro.total, ano: registro.ano } : null;
  }

  const registros = await prisma.eleitorado.findMany({ where: { ano: { lte: anoEleicao } } });
  if (registros.length === 0) return null;
  const anoMax = Math.max(...registros.map((r) => r.ano));
  const eleitores = registros.filter((r) => r.ano === anoMax).reduce((s, r) => s + r.total, 0);
  return { eleitores, ano: anoMax };
}

// Lista compacta de cargos para os seletores da página de Simulações.
export async function getCargosParaSimulacao(opcoes: {
  tipoApuracao?: "MAJORITARIO" | "PROPORCIONAL";
  somenteEstaduais?: boolean;
}) {
  const cargos = await prisma.cargo.findMany({
    where: {
      ...(opcoes.tipoApuracao ? { tipoApuracao: opcoes.tipoApuracao } : {}),
      ...(opcoes.somenteEstaduais ? { municipioId: null } : {}),
    },
    include: { eleicao: true, municipio: true },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }, { municipio: { nome: "asc" } }],
  });
  return cargos.map((c) => ({
    id: c.id,
    nome: c.nome,
    ano: c.eleicao.ano,
    municipioNome: c.municipio?.nome ?? null,
  }));
}

// Pacote de dados de um cargo para os simuladores: candidatos com votos,
// totais por partido, quociente e eleitorado do recorte.
export async function getDadosSimulacaoCargo(cargoId: string) {
  const cargo = await prisma.cargo.findUnique({
    where: { id: cargoId },
    include: {
      eleicao: true,
      municipio: true,
      candidatos: { include: { partido: true, resultados: true } },
    },
  });
  if (!cargo) return null;

  const candidatos = cargo.candidatos
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partidoId: c.partidoId,
      partidoSigla: c.partido.sigla,
      eleito: c.eleito,
      votos: votosTurno(c.resultados, 1),
    }))
    .filter((c) => c.votos > 0)
    .sort((a, b) => b.votos - a.votos);

  const partidosMap = new Map<string, { partidoId: string; sigla: string; votos: number }>();
  for (const c of candidatos) {
    const atual = partidosMap.get(c.partidoId);
    if (atual) atual.votos += c.votos;
    else partidosMap.set(c.partidoId, { partidoId: c.partidoId, sigla: c.partidoSigla, votos: c.votos });
  }
  // Votos de legenda entram no total do partido (quociente oficial).
  const legenda = await prisma.votoLegenda.findMany({
    where: { cargoId, turno: 1 },
    include: { partido: true },
  });
  for (const vl of legenda) {
    const atual = partidosMap.get(vl.partidoId);
    if (atual) atual.votos += vl.votos;
    else partidosMap.set(vl.partidoId, { partidoId: vl.partidoId, sigla: vl.partido.sigla, votos: vl.votos });
  }
  const partidos = Array.from(partidosMap.values()).sort((a, b) => b.votos - a.votos);

  const votosValidos = partidos.reduce((s, p) => s + p.votos, 0);
  const quocienteEleitoral =
    cargo.tipoApuracao === "PROPORCIONAL" && cargo.vagas > 0
      ? Math.floor(votosValidos / cargo.vagas)
      : 0;
  const eleitores = await getEleitoresCargo(cargo.municipioId, cargo.eleicao.ano);

  return {
    cargoId: cargo.id,
    cargoNome: cargo.nome,
    tipoApuracao: cargo.tipoApuracao,
    ano: cargo.eleicao.ano,
    municipioNome: cargo.municipio?.nome ?? null,
    vagas: cargo.vagas,
    votosValidos,
    quocienteEleitoral,
    eleitores,
    candidatos,
    partidos,
  };
}

// Distribuição dos votos de um candidato por município — base do simulador
// de meta de campanha.
export async function getDistribuicaoCandidato(candidatoId: string) {
  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      partido: true,
      resultados: { include: { municipio: true }, orderBy: { votos: "desc" } },
    },
  });
  if (!candidato) return null;
  const t1 = candidato.resultados.filter((r) => r.turno === 1);
  const total = t1.reduce((s, r) => s + r.votos, 0);
  return {
    id: candidato.id,
    nome: candidato.nome,
    numero: candidato.numero,
    partidoSigla: candidato.partido.sigla,
    total,
    municipios: t1
      .filter((r) => r.votos > 0)
      .map((r) => ({ municipioNome: r.municipio.nome, votos: r.votos })),
  };
}

export async function getCandidatosPorCargo(cargoId: string) {
  const candidatos = await prisma.candidato.findMany({
    where: { cargoId },
    include: {
      partido: true,
      resultados: true,
    },
  });

  return candidatos
    .map((c) => ({
      ...c,
      totalVotos: c.resultados.reduce((sum, r) => sum + r.votos, 0),
    }))
    .sort((a, b) => b.totalVotos - a.totalVotos);
}

export async function getCandidato(id: string) {
  return prisma.candidato.findUnique({
    where: { id },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: {
        include: { municipio: { include: { regiao: true } } },
        orderBy: { votos: "desc" },
      },
      trocasPartido: {
        include: { partidoOrigem: true, partidoDestino: true },
        orderBy: { data: "desc" },
      },
    },
  });
}

// Outras candidaturas da MESMA PESSOA em anos diferentes. O nome de urna se
// repete entre pessoas distintas (ex.: vários "HELDER"), então o vínculo é
// pelo CPF do TSE — com fallback para o nome civil completo. Sem nenhum dos
// dois, não arriscamos associação.
export async function getCandidaturasAnteriores(candidato: {
  id: string;
  cpf: string | null;
  nomeCompleto: string | null;
}) {
  const filtros = [];
  if (candidato.cpf) filtros.push({ cpf: candidato.cpf });
  else if (candidato.nomeCompleto) filtros.push({ nomeCompleto: candidato.nomeCompleto });
  if (filtros.length === 0) return [];

  const candidatos = await prisma.candidato.findMany({
    where: { OR: filtros, id: { not: candidato.id } },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: true,
    },
  });

  return candidatos
    .map((c) => ({ ...c, totalVotos: votosDecisivos(c.resultados) }))
    .sort((a, b) => b.cargo.eleicao.ano - a.cargo.eleicao.ano);
}

export async function getPartidos() {
  return prisma.partido.findMany({ orderBy: { sigla: "asc" } });
}

// Votos de cada partido por ano de eleição, agregados direto no banco —
// evita carregar todos os resultados em memória.
async function votosPartidoPorAno() {
  return prisma.$queryRaw<{ partidoId: string; ano: number; votos: bigint }[]>`
    SELECT c.partidoId as partidoId, e.ano as ano, SUM(r.votos) as votos
    FROM Resultado r
    JOIN Candidato c ON r.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    GROUP BY c.partidoId, e.ano
  `;
}

// Lista de partidos com o desempenho na eleição mais recente (votos, não
// somatória histórica) e o número de eleitos com mandato vigente.
export async function getPartidosComEstatisticas() {
  const [partidos, votosAno, anosMandato] = await Promise.all([
    prisma.partido.findMany({ orderBy: { sigla: "asc" } }),
    votosPartidoPorAno(),
    getAnosMandatoAtual(),
  ]);

  const ultimoAno = votosAno.length ? Math.max(...votosAno.map((v) => v.ano)) : null;
  const votosUltimaPorPartido = new Map<string, number>();
  for (const v of votosAno) {
    if (v.ano === ultimoAno) votosUltimaPorPartido.set(v.partidoId, Number(v.votos));
  }

  const filtrosMandato = [];
  if (anosMandato.municipal)
    filtrosMandato.push({ eleito: true, cargo: { eleicao: { ano: anosMandato.municipal } } });
  if (anosMandato.estadual)
    filtrosMandato.push({ eleito: true, cargo: { eleicao: { ano: anosMandato.estadual } } });
  if (anosMandato.estadualAnterior)
    filtrosMandato.push({
      eleito: true,
      cargo: { nome: "Senador", eleicao: { ano: anosMandato.estadualAnterior } },
    });

  const mandatos = filtrosMandato.length
    ? await prisma.candidato.groupBy({
        by: ["partidoId"],
        where: { OR: filtrosMandato },
        _count: true,
      })
    : [];
  const mandatosPorPartido = new Map(mandatos.map((m) => [m.partidoId, m._count]));

  return partidos
    .map((p) => ({
      ...p,
      ultimoAno,
      votosUltimaEleicao: votosUltimaPorPartido.get(p.id) ?? 0,
      eleitosComMandato: mandatosPorPartido.get(p.id) ?? 0,
    }))
    .sort((a, b) => b.votosUltimaEleicao - a.votosUltimaEleicao);
}

export async function getPartido(id: string) {
  const partido = await prisma.partido.findUnique({
    where: { id },
    include: {
      candidatos: {
        include: {
          cargo: { include: { eleicao: true, municipio: true } },
          resultados: true,
        },
      },
    },
  });
  if (!partido) return null;

  const candidatosComVotos = partido.candidatos
    .map((c) => ({
      ...c,
      votos: c.resultados.reduce((s, r) => s + r.votos, 0),
    }))
    .sort((a, b) => b.votos - a.votos);

  const membrosFederacao = partido.federacaoMembros
    ? partido.federacaoMembros.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  // Desempenho por eleição: votos, candidaturas e eleitos em cada ano.
  const porAno = new Map<number, { ano: number; votos: number; candidatos: number; eleitos: number }>();
  for (const c of candidatosComVotos) {
    const ano = c.cargo.eleicao.ano;
    let linha = porAno.get(ano);
    if (!linha) {
      linha = { ano, votos: 0, candidatos: 0, eleitos: 0 };
      porAno.set(ano, linha);
    }
    linha.votos += c.votos;
    linha.candidatos++;
    if (c.eleito) linha.eleitos++;
  }
  const desempenhoPorAno = Array.from(porAno.values()).sort((a, b) => a.ano - b.ano);

  // Representatividade com mandato vigente, por âmbito federativo.
  const anosMandato = await getAnosMandatoAtual();
  const CARGOS_AMBITO: Record<string, "federal" | "estadual" | "municipal"> = {
    "Senador": "federal",
    "Deputado Federal": "federal",
    "Governador": "estadual",
    "Deputado Estadual": "estadual",
    "Prefeito": "municipal",
    "Vereador": "municipal",
  };
  const ambitos = { federal: 0, estadual: 0, municipal: 0 };
  const detalheAmbito = new Map<string, number>();
  for (const c of candidatosComVotos) {
    if (!c.eleito) continue;
    const ano = c.cargo.eleicao.ano;
    const nome = c.cargo.nome;
    const temMandato =
      ano === anosMandato.municipal ||
      ano === anosMandato.estadual ||
      (nome === "Senador" && ano === anosMandato.estadualAnterior);
    if (!temMandato) continue;
    const ambito = CARGOS_AMBITO[nome];
    if (ambito) {
      ambitos[ambito]++;
      detalheAmbito.set(nome, (detalheAmbito.get(nome) ?? 0) + 1);
    }
  }

  return {
    ...partido,
    candidatos: candidatosComVotos,
    membrosFederacao,
    desempenhoPorAno,
    ambitos,
    detalheAmbito: Array.from(detalheAmbito.entries()).map(([cargo, qtd]) => ({ cargo, qtd })),
  };
}

export async function getUsuarios() {
  const usuarios = await prisma.user.findMany({
    include: { regiao: true, candidato: true, criadoPor: true },
    orderBy: { createdAt: "desc" },
  });

  const agora = Date.now();
  return usuarios.map((u) => ({
    ...u,
    expirado: !!u.expiresAt && u.expiresAt.getTime() < agora,
  }));
}

// Eleitores aptos do ano mais recente, por município. Somar votos de todas
// as eleições inflaria os números — o eleitorado é o dado comparável.
function eleitoresMaisRecentes(eleitorado: { ano: number; total: number }[]) {
  if (eleitorado.length === 0) return { eleitores: 0, ano: null as number | null };
  const ano = Math.max(...eleitorado.map((e) => e.ano));
  const registro = eleitorado.find((e) => e.ano === ano);
  return { eleitores: registro?.total ?? 0, ano };
}

export async function getMunicipios(regiaoId?: string) {
  const municipios = await prisma.municipio.findMany({
    where: regiaoId ? { regiaoId } : undefined,
    include: {
      regiao: true,
      eleitorado: true,
    },
    orderBy: { nome: "asc" },
  });

  return municipios.map((m) => {
    const { eleitores, ano } = eleitoresMaisRecentes(m.eleitorado);
    return { ...m, eleitores, anoEleitorado: ano };
  });
}

export async function getMunicipio(id: string) {
  const municipio = await prisma.municipio.findUnique({
    where: { id },
    include: {
      regiao: true,
      eleitorado: true,
      resultados: {
        include: {
          candidato: { include: { partido: true, cargo: { include: { eleicao: true } } } },
        },
        orderBy: { votos: "desc" },
      },
      colegiosEleitorais: { orderBy: { nome: "asc" } },
    },
  });
  if (!municipio) return null;
  const { eleitores, ano } = eleitoresMaisRecentes(municipio.eleitorado);
  return { ...municipio, eleitores, anoEleitorado: ano };
}

export async function getRegioes() {
  const regioes = await prisma.regiao.findMany({
    include: {
      municipios: { include: { eleitorado: true } },
    },
    orderBy: { nome: "asc" },
  });

  return regioes.map((r) => {
    const eleitores = r.municipios.reduce(
      (sum, m) => sum + eleitoresMaisRecentes(m.eleitorado).eleitores,
      0
    );
    const populacao = r.municipios.reduce((sum, m) => sum + (m.populacao ?? 0), 0);
    return { ...r, eleitores, populacao, totalMunicipios: r.municipios.length };
  });
}

export async function getMapaDados(cargoId?: string) {
  const [municipios, projecaoPorMunicipio, totais] = await Promise.all([
    prisma.municipio.findMany({ include: { regiao: true } }),
    getEleitoradoProjecao(),
    prisma.resultado.groupBy({
      by: ["municipioId"],
      where: cargoId ? { candidato: { cargoId } } : undefined,
      _sum: { votos: true },
    }),
  ]);
  const votosPorMunicipio = new Map(totais.map((t) => [t.municipioId, t._sum.votos ?? 0]));

  // O líder só é relevante quando um cargo específico está selecionado —
  // e aí o volume é pequeno o bastante para carregar.
  const liderPorMunicipio = new Map<string, { nome: string; partido: string }>();
  if (cargoId) {
    const resultados = await prisma.resultado.findMany({
      where: { candidato: { cargoId } },
      include: { candidato: { include: { partido: true } } },
      orderBy: { votos: "desc" },
    });
    for (const r of resultados) {
      if (!liderPorMunicipio.has(r.municipioId)) {
        liderPorMunicipio.set(r.municipioId, {
          nome: r.candidato.nome,
          partido: r.candidato.partido.sigla,
        });
      }
    }
  }

  return municipios.map((m) => ({
    id: m.id,
    nome: m.nome,
    codigoIbge: m.codigoIbge,
    regiaoId: m.regiaoId,
    regiaoNome: m.regiao.nome,
    totalVotos: votosPorMunicipio.get(m.id) ?? 0,
    populacao: m.populacao,
    lider: liderPorMunicipio.get(m.id) ?? null,
    eleitorado: projecaoPorMunicipio.get(m.id) ?? null,
  }));
}

// Projeta o eleitorado de cada município para o próximo pleito (2028),
// a partir da taxa de crescimento observada entre o primeiro e o último
// ano de eleitorado importado (ex: 2018 → 2024). Estimativa simples de
// planejamento — não é dado oficial do TSE, que só existe para anos já
// fechados.
const ANO_PROJECAO = 2028;

export async function getEleitoradoProjecao() {
  const registros = await prisma.eleitorado.findMany({ orderBy: { ano: "asc" } });

  const porMunicipio = new Map<string, { ano: number; total: number }[]>();
  for (const r of registros) {
    const lista = porMunicipio.get(r.municipioId);
    if (lista) lista.push({ ano: r.ano, total: r.total });
    else porMunicipio.set(r.municipioId, [{ ano: r.ano, total: r.total }]);
  }

  const resultado = new Map<
    string,
    { ultimoAno: number; ultimoTotal: number; anoProjecao: number; projecao: number }
  >();

  for (const [municipioId, lista] of porMunicipio) {
    const primeiro = lista[0];
    const ultimo = lista[lista.length - 1];
    const anos = ultimo.ano - primeiro.ano;
    const taxaAnual =
      anos > 0 && primeiro.total > 0 ? Math.pow(ultimo.total / primeiro.total, 1 / anos) - 1 : 0;
    const anosAteProjecao = Math.max(0, ANO_PROJECAO - ultimo.ano);
    const projecao = Math.round(ultimo.total * Math.pow(1 + taxaAnual, anosAteProjecao));
    resultado.set(municipioId, {
      ultimoAno: ultimo.ano,
      ultimoTotal: ultimo.total,
      anoProjecao: ANO_PROJECAO,
      projecao,
    });
  }

  return resultado;
}

// Remove acentos para permitir busca sem acentuação (ex: "Belem" encontra
// "Belém"). SQLite não faz esse tipo de comparação nativamente, então
// filtramos em JS — os volumes aqui (dezenas de candidatos, ~150
// municípios/regiões) são pequenos o suficiente para isso ser barato.
function normalizar(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export async function buscarTudo(query: string) {
  const termo = query.trim();
  if (!termo) return { candidatos: [], municipios: [], regioes: [], partidos: [] };

  const termoNormalizado = normalizar(termo);
  const numero = /^\d+$/.test(termo) ? Number(termo) : undefined;

  // Filtro no banco (contains cobre a imensa maioria; a normalização de
  // acentos refina o resultado) — carregar 100k candidatos com resultados
  // estourava a memória do container.
  const [candidatosBrutos, todosMunicipios, todasRegioes, todosPartidos] = await Promise.all([
    prisma.candidato.findMany({
      where: {
        OR: [
          { nome: { contains: termo } },
          { nomeCompleto: { contains: termo } },
          ...(numero !== undefined ? [{ numero }] : []),
        ],
      },
      include: {
        partido: true,
        cargo: { include: { municipio: true } },
        resultados: true,
      },
      take: 200,
    }),
    prisma.municipio.findMany({ include: { regiao: true } }),
    prisma.regiao.findMany(),
    prisma.partido.findMany(),
  ]);

  const candidatos = candidatosBrutos
    .filter(
      (c) =>
        normalizar(c.nome).includes(termoNormalizado) ||
        (c.nomeCompleto && normalizar(c.nomeCompleto).includes(termoNormalizado)) ||
        c.numero === numero
    )
    .map((c) => ({
      ...c,
      totalVotos: c.resultados.reduce((sum, r) => sum + r.votos, 0),
    }))
    .sort((a, b) => b.totalVotos - a.totalVotos)
    .slice(0, 20);

  const municipios = todosMunicipios
    .filter((m) => normalizar(m.nome).includes(termoNormalizado))
    .slice(0, 10);

  const regioes = todasRegioes
    .filter((r) => normalizar(r.nome).includes(termoNormalizado))
    .slice(0, 10);

  const partidos = todosPartidos
    .filter(
      (p) =>
        normalizar(p.sigla).includes(termoNormalizado) ||
        normalizar(p.nome).includes(termoNormalizado) ||
        p.numero === numero
    )
    .slice(0, 10);

  return { candidatos, municipios, regioes, partidos };
}
