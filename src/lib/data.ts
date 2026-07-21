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
// incluindo a projeção para a próxima eleição.
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
    const anoProjecao = proximaEleicao(ultimoAno);
    if (anoProjecao > ultimoAno) {
      const projecao = Math.round(ultimoTotal * Math.pow(1 + taxaAnual, anoProjecao - ultimoAno));
      pontos.push({ ano: anoProjecao, total: projecao, projetado: true });
    }
  }

  return pontos;
}

// Próxima eleição após o último ano com dados reais de eleitorado: as
// eleições acontecem a cada 2 anos (2026 estadual, 2028 municipal...), então
// a projeção mira sempre o pleito seguinte e avança sozinha quando o TSE
// publicar o eleitorado do ano corrente.
function proximaEleicao(ultimoAnoComDados: number) {
  return ultimoAnoComDados % 2 === 0 ? ultimoAnoComDados + 2 : ultimoAnoComDados + 1;
}

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
    municipioId: cargo.municipioId,
    municipioNome: cargo.municipio?.nome ?? null,
    vagas: cargo.vagas,
    votosValidos,
    quocienteEleitoral,
    eleitores,
    candidatos,
    partidos,
  };
}

// Distribuição para o simulador de meta de campanha. A base define os
// PESOS por município: o perfil histórico do próprio candidato, o perfil
// do partido dele na última eleição de Deputado Estadual (útil quando o
// candidato muda de âmbito, ex.: vereador disputando dep. estadual) ou o
// eleitorado apto de cada município.
export type BaseMeta = "candidato" | "partido" | "eleitorado";

export async function getDistribuicaoMeta(candidatoId: string, base: BaseMeta) {
  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: { include: { municipio: true } },
    },
  });
  if (!candidato) return null;

  const votosAtuaisPorMunicipio = new Map<string, number>();
  for (const r of candidato.resultados) {
    if (r.turno !== 1) continue;
    votosAtuaisPorMunicipio.set(
      r.municipio.nome,
      (votosAtuaisPorMunicipio.get(r.municipio.nome) ?? 0) + r.votos
    );
  }
  const totalAtual = Array.from(votosAtuaisPorMunicipio.values()).reduce((s, v) => s + v, 0);

  let pesos: { municipioNome: string; peso: number }[] = [];
  let descricaoBase = "";

  if (base === "candidato") {
    pesos = Array.from(votosAtuaisPorMunicipio.entries()).map(([municipioNome, peso]) => ({
      municipioNome,
      peso,
    }));
    descricaoBase = `perfil do próprio candidato (${candidato.cargo.eleicao.ano})`;
  } else if (base === "partido") {
    const anoEstadual = await prisma.eleicao.findFirst({
      where: { tipo: "ESTADUAL", cargos: { some: { candidatos: { some: { eleito: true } } } } },
      orderBy: { ano: "desc" },
    });
    if (anoEstadual) {
      const linhas = await prisma.$queryRaw<{ nome: string; votos: bigint }[]>`
        SELECT m.nome as nome, SUM(r.votos) as votos
        FROM Resultado r
        JOIN Candidato c ON r.candidatoId = c.id
        JOIN Cargo g ON c.cargoId = g.id
        JOIN Municipio m ON r.municipioId = m.id
        WHERE g.nome = 'Deputado Estadual' AND g.eleicaoId = ${anoEstadual.id}
          AND c.partidoId = ${candidato.partidoId} AND r.turno = 1
        GROUP BY m.nome
      `;
      pesos = linhas.map((l) => ({ municipioNome: l.nome, peso: Number(l.votos) }));
      descricaoBase = `votação do ${candidato.partido.sigla} para Dep. Estadual em ${anoEstadual.ano}`;
    }
  } else {
    const registros = await prisma.eleitorado.findMany({ include: { municipio: true } });
    const anoMax = registros.length ? Math.max(...registros.map((r) => r.ano)) : 0;
    pesos = registros
      .filter((r) => r.ano === anoMax)
      .map((r) => ({ municipioNome: r.municipio.nome, peso: r.total }));
    descricaoBase = `eleitorado apto de ${anoMax}`;
  }

  const totalPesos = pesos.reduce((s, p) => s + p.peso, 0);

  return {
    id: candidato.id,
    nome: candidato.nome,
    numero: candidato.numero,
    partidoSigla: candidato.partido.sigla,
    origem: `${candidato.cargo.nome} · ${candidato.cargo.municipio?.nome ?? "PA"} · ${candidato.cargo.eleicao.ano}`,
    totalAtual,
    base,
    descricaoBase,
    municipios: pesos
      .filter((p) => p.peso > 0)
      .sort((a, b) => b.peso - a.peso)
      .map((p) => ({
        municipioNome: p.municipioNome,
        peso: p.peso,
        fracao: totalPesos > 0 ? p.peso / totalPesos : 0,
        votosAtuais: votosAtuaisPorMunicipio.get(p.municipioNome) ?? 0,
      })),
  };
}

// Distribuição dos votos de um candidato por município — base do simulador
// de meta de campanha e da projeção percentual.
export async function getDistribuicaoCandidato(candidatoId: string) {
  const candidato = await prisma.candidato.findUnique({
    where: { id: candidatoId },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: { include: { municipio: { include: { regiao: true } } }, orderBy: { votos: "desc" } },
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
    origem: `${candidato.cargo.nome} · ${candidato.cargo.municipio?.nome ?? "PA"} · ${candidato.cargo.eleicao.ano}`,
    total,
    municipios: t1
      .filter((r) => r.votos > 0)
      .map((r) => ({
        municipioNome: r.municipio.nome,
        regiaoNome: r.municipio.regiao.nome,
        votos: r.votos,
      })),
  };
}

// Referenciais históricos de viabilidade para um cargo: em cada eleição do
// mesmo cargo/recorte, o quociente eleitoral e a "linha de corte" (menor
// votação nominal entre os eleitos), mais a projeção para a próxima
// eleição (escala pelo crescimento do eleitorado). Base do estudo fictício
// de viabilidade da distribuição manual de votos.
export async function getReferenciaisViabilidade(cargoId: string) {
  const cargo = await prisma.cargo.findUnique({
    where: { id: cargoId },
    include: { eleicao: true, municipio: true },
  });
  if (!cargo) return null;

  const irmaos = await prisma.cargo.findMany({
    where: { nome: cargo.nome, municipioId: cargo.municipioId },
    include: { eleicao: true },
  });

  const referencias: { ano: number; vagas: number; validos: number; qe: number; corte: number }[] = [];
  for (const c of irmaos) {
    const [nominais, legenda, corteLinha] = await Promise.all([
      prisma.resultado.aggregate({
        where: { candidato: { cargoId: c.id }, turno: 1 },
        _sum: { votos: true },
      }),
      prisma.votoLegenda.aggregate({ where: { cargoId: c.id, turno: 1 }, _sum: { votos: true } }),
      prisma.$queryRaw<{ corte: bigint | null }[]>`
        SELECT MIN(t.v) as corte FROM (
          SELECT SUM(r.votos) as v
          FROM Resultado r
          JOIN Candidato ca ON r.candidatoId = ca.id
          WHERE ca.cargoId = ${c.id} AND ca.eleito = 1 AND r.turno = 1
          GROUP BY ca.id
        ) t
      `,
    ]);
    const validos = (nominais._sum.votos ?? 0) + (legenda._sum.votos ?? 0);
    if (validos === 0) continue;
    referencias.push({
      ano: c.eleicao.ano,
      vagas: c.vagas,
      validos,
      qe: c.vagas > 0 ? Math.floor(validos / c.vagas) : 0,
      corte: Number(corteLinha[0]?.corte ?? 0),
    });
  }
  referencias.sort((a, b) => a.ano - b.ano);

  // Projeção da próxima eleição: escala o último ano pelo crescimento do
  // eleitorado apto (comparecimento e proporção de válidos constantes).
  const ultimo = referencias[referencias.length - 1];
  let projecao: { ano: number; vagas: number; validos: number; qe: number; corte: number } | null =
    null;
  if (ultimo) {
    const [projecoes, aptosUltimo] = await Promise.all([
      getEleitoradoProjecao(),
      getEleitoresCargo(cargo.municipioId, ultimo.ano),
    ]);
    const entradas = cargo.municipioId
      ? [projecoes.get(cargo.municipioId)].filter((e) => e !== undefined)
      : Array.from(projecoes.values());
    const aptosProjetados = entradas.reduce((s, e) => s + e.projecao, 0);
    const anoProjecao = entradas.reduce((max, e) => Math.max(max, e.anoProjecao), 0);
    if (aptosProjetados > 0 && anoProjecao > 0 && aptosUltimo && aptosUltimo.eleitores > 0) {
      const fator = aptosProjetados / aptosUltimo.eleitores;
      const validosProjetados = Math.round(ultimo.validos * fator);
      projecao = {
        ano: anoProjecao,
        vagas: ultimo.vagas,
        validos: validosProjetados,
        qe: ultimo.vagas > 0 ? Math.floor(validosProjetados / ultimo.vagas) : 0,
        corte: Math.round(ultimo.corte * fator),
      };
    }
  }

  return {
    cargoNome: cargo.nome,
    municipioNome: cargo.municipio?.nome ?? null,
    referencias,
    projecao,
  };
}

// Lista enxuta de municípios (com região e eleitorado mais recente) para a
// distribuição manual de votos no simulador de meta.
export async function getMunicipiosParaMeta() {
  const municipios = await prisma.municipio.findMany({
    include: { regiao: true, eleitorado: true },
    orderBy: { nome: "asc" },
  });
  return municipios.map((m) => ({
    id: m.id,
    nome: m.nome,
    regiaoNome: m.regiao.nome,
    eleitores: eleitoresMaisRecentes(m.eleitorado).eleitores,
  }));
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

// Eleitos de um partido agrupados por eleição (ano) e cargo — permite
// comparar, p.ex., os deputados eleitos pela sigla em 2018 e em 2022.
export async function getEleitosDoPartidoPorEleicao(partidoId: string) {
  const eleitos = await prisma.candidato.findMany({
    where: { partidoId, eleito: true },
    include: {
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: true,
    },
  });

  const porAno = new Map<
    number,
    Map<string, { id: string; nome: string; abrangencia: string | null; votos: number }[]>
  >();
  for (const c of eleitos) {
    const ano = c.cargo.eleicao.ano;
    let cargos = porAno.get(ano);
    if (!cargos) {
      cargos = new Map();
      porAno.set(ano, cargos);
    }
    let lista = cargos.get(c.cargo.nome);
    if (!lista) {
      lista = [];
      cargos.set(c.cargo.nome, lista);
    }
    lista.push({
      id: c.id,
      nome: c.nome,
      abrangencia: c.cargo.municipio?.nome ?? null,
      votos: votosDecisivos(c.resultados),
    });
  }

  const ordemCargos = ["Governador", "Senador", "Deputado Federal", "Deputado Estadual", "Prefeito", "Vereador"];
  return Array.from(porAno.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([ano, cargos]) => ({
      ano,
      cargos: Array.from(cargos.entries())
        .sort((a, b) => {
          const ia = ordemCargos.indexOf(a[0]);
          const ib = ordemCargos.indexOf(b[0]);
          return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib);
        })
        .map(([cargoNome, lista]) => ({
          cargoNome,
          eleitos: lista.sort((a, b) => b.votos - a.votos),
        })),
      totalEleitos: Array.from(cargos.values()).reduce((s, l) => s + l.length, 0),
    }));
}

// Filiação atual da pessoa: a troca de partido mais recente registrada em
// QUALQUER das candidaturas dela (as trocas não alteram o partido da urna).
export async function getFiliacaoAtual(candidatoIds: string[]) {
  const troca = await prisma.trocaPartido.findFirst({
    where: { candidatoId: { in: candidatoIds } },
    include: { partidoDestino: true },
    orderBy: { data: "desc" },
  });
  if (!troca) return null;
  return { sigla: troca.partidoDestino.sigla, data: troca.data, motivo: troca.motivo };
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
  const cpfValido = candidato.cpf && /^\d{11}$/.test(candidato.cpf);
  // CPF e nome civil juntos: anos em que o TSE mascarou o CPF ("-4")
  // continuam ligados pelo nome completo.
  if (cpfValido) filtros.push({ cpf: candidato.cpf! });
  if (candidato.nomeCompleto) filtros.push({ nomeCompleto: candidato.nomeCompleto });
  if (filtros.length === 0) return [];

  const brutos = await prisma.candidato.findMany({
    where: { OR: filtros, id: { not: candidato.id } },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: true,
    },
  });

  // Salvaguardas contra homônimos de nome completo:
  // 1) CPF válido divergente = outra pessoa.
  // 2) Duas candidaturas no MESMO ano são impossíveis para a mesma pessoa;
  //    quando isso acontece no conjunto (ou colide com o ano da candidatura
  //    aberta), descartamos as ambíguas em vez de escolher errado.
  const candidatos = brutos.filter(
    (c) => !(cpfValido && c.cpf && /^\d{11}$/.test(c.cpf) && c.cpf !== candidato.cpf)
  );
  const anoAtual = await prisma.candidato
    .findUnique({ where: { id: candidato.id }, include: { cargo: { include: { eleicao: true } } } })
    .then((c) => c?.cargo.eleicao.ano);
  const comVotos = candidatos.map((c) => ({ ...c, totalVotos: votosDecisivos(c.resultados) }));
  const porAno = new Map<number, typeof comVotos>();
  for (const c of comVotos) {
    const ano = c.cargo.eleicao.ano;
    const lista = porAno.get(ano);
    if (lista) lista.push(c);
    else porAno.set(ano, [c]);
  }

  const resultado: typeof comVotos = [];
  for (const [ano, lista] of porAno) {
    if (ano === anoAtual) continue;
    if (lista.length === 1) {
      resultado.push(lista[0]);
      continue;
    }
    // Duplicata no mesmo ano: se todos são a MESMA pessoa (mesmo CPF, caso
    // de registro substituído — trocou de cargo/número antes do pleito),
    // fica a candidatura efetiva (a que recebeu votos); homônimos de nome
    // sem CPF são ambíguos e ficam de fora.
    const cpfs = new Set(lista.map((c) => c.cpf).filter(Boolean));
    const mesmaPessoa = cpfs.size <= 1 && (!cpfValido || cpfs.size === 0 || cpfs.has(candidato.cpf!));
    if (mesmaPessoa && cpfs.size === 1) {
      resultado.push(lista.sort((a, b) => b.totalVotos - a.totalVotos)[0]);
    }
  }

  return resultado.sort((a, b) => b.cargo.eleicao.ano - a.cargo.eleicao.ano);
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

// Ficha enxuta do município (sem os resultados completos — a página do
// município mostra só os eleitos; a relação completa fica nas Disputas).
export async function getMunicipioFicha(id: string) {
  const municipio = await prisma.municipio.findUnique({
    where: { id },
    include: { regiao: true, eleitorado: true },
  });
  if (!municipio) return null;
  const { eleitores, ano } = eleitoresMaisRecentes(municipio.eleitorado);
  return { ...municipio, eleitores, anoEleitorado: ano };
}

// Eleitos da eleição municipal mais recente do município: prefeito (com
// vice) e vereadores por ordem de votação — flag oficial do TSE.
export async function getEleitosDoMunicipio(municipioId: string) {
  const eleicao = await prisma.eleicao.findFirst({
    where: {
      tipo: "MUNICIPAL",
      cargos: { some: { municipioId, candidatos: { some: { eleito: true } } } },
    },
    orderBy: { ano: "desc" },
  });
  if (!eleicao) return null;

  const cargos = await prisma.cargo.findMany({
    where: { municipioId, eleicaoId: eleicao.id },
    include: {
      candidatos: {
        where: { eleito: true },
        include: { partido: true, resultados: { where: { municipioId } } },
      },
    },
  });

  const prefeitoCargo = cargos.find((c) => c.nome === "Prefeito");
  const vereadorCargo = cargos.find((c) => c.nome === "Vereador");

  const p = prefeitoCargo?.candidatos[0];
  return {
    ano: eleicao.ano,
    prefeito: p
      ? {
          id: p.id,
          nome: p.nome,
          numero: p.numero,
          partidoSigla: p.partido.sigla,
          viceNome: p.viceNome,
          votos: votosDecisivos(p.resultados),
        }
      : null,
    vereadores: (vereadorCargo?.candidatos ?? [])
      .map((v) => ({
        id: v.id,
        nome: v.nome,
        numero: v.numero,
        partidoSigla: v.partido.sigla,
        votos: votosTurno(v.resultados, 1),
      }))
      .sort((a, b) => b.votos - a.votos),
    cargoVereadorId: vereadorCargo?.id ?? null,
    cargoPrefeitoId: prefeitoCargo?.id ?? null,
    // Indicativo de disputa que passou (ou está) sub judice na JE.
    vereadorSubJudice: vereadorCargo?.subJudice ?? false,
    vereadorObsJudicial: vereadorCargo?.obsJudicial ?? null,
  };
}

// Locais de votação de um município. Somar tudo (todos os cargos e anos)
// inflaria o número — cada eleitor vota em vários cargos —, então o total
// exibido usa o cargo proporcional de referência do ano mais recente
// disponível (Vereador nas municipais, Dep. Estadual nas estaduais), o
// mesmo critério dos votos válidos.
export async function getLocaisDoMunicipio(municipioId: string) {
  const ref = await prisma.$queryRaw<{ ano: number; cargo: string }[]>`
    SELECT e.ano as ano, g.nome as cargo
    FROM VotoLocal v
    JOIN ColegioEleitoral ce ON v.colegioEleitoralId = ce.id
    JOIN Candidato c ON v.candidatoId = c.id
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE ce.municipioId = ${municipioId} AND g.nome IN ('Vereador', 'Deputado Estadual')
    ORDER BY e.ano DESC LIMIT 1
  `;
  const referencia = ref[0] ?? null;

  const linhas = await prisma.$queryRaw<{ id: string; nome: string; votos: bigint }[]>`
    SELECT ce.id as id, ce.nome as nome, COALESCE(SUM(
      CASE WHEN g.nome = ${referencia?.cargo ?? ""} AND e.ano = ${referencia?.ano ?? 0} AND v.turno = 1
           THEN v.votos END), 0) as votos
    FROM ColegioEleitoral ce
    LEFT JOIN VotoLocal v ON v.colegioEleitoralId = ce.id
    LEFT JOIN Candidato c ON v.candidatoId = c.id
    LEFT JOIN Cargo g ON c.cargoId = g.id
    LEFT JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE ce.municipioId = ${municipioId}
    GROUP BY ce.id
    ORDER BY votos DESC
  `;
  return {
    referencia,
    locais: linhas.map((l) => ({ id: l.id, nome: l.nome, votos: Number(l.votos) })),
  };
}

// Detalhe de um local de votação: votos por candidato, agrupados por
// cargo/eleição, com turno.
export async function getLocalVotacao(colegioId: string) {
  const colegio = await prisma.colegioEleitoral.findUnique({
    where: { id: colegioId },
    include: { municipio: true },
  });
  if (!colegio) return null;

  const votos = await prisma.votoLocal.findMany({
    where: { colegioEleitoralId: colegioId },
    include: {
      candidato: {
        include: { partido: true, cargo: { include: { eleicao: true } } },
      },
    },
  });

  const grupos = new Map<
    string,
    {
      cargoNome: string;
      ano: number;
      turno: number;
      candidatos: { id: string; nome: string; numero: number; partidoSigla: string; eleito: boolean; votos: number }[];
    }
  >();
  for (const v of votos) {
    const chave = `${v.candidato.cargo.eleicao.ano}::${v.candidato.cargo.nome}::${v.turno}`;
    let g = grupos.get(chave);
    if (!g) {
      g = {
        cargoNome: v.candidato.cargo.nome,
        ano: v.candidato.cargo.eleicao.ano,
        turno: v.turno,
        candidatos: [],
      };
      grupos.set(chave, g);
    }
    g.candidatos.push({
      id: v.candidato.id,
      nome: v.candidato.nome,
      numero: v.candidato.numero,
      partidoSigla: v.candidato.partido.sigla,
      eleito: v.candidato.eleito,
      votos: v.votos,
    });
  }

  return {
    id: colegio.id,
    nome: colegio.nome,
    municipioId: colegio.municipioId,
    municipioNome: colegio.municipio.nome,
    grupos: Array.from(grupos.values())
      .map((g) => ({ ...g, candidatos: g.candidatos.sort((a, b) => b.votos - a.votos) }))
      .sort((a, b) => b.ano - a.ano || a.cargoNome.localeCompare(b.cargoNome, "pt-BR") || a.turno - b.turno),
  };
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

export async function getMapaDados(opcoes: {
  cargoId?: string;
  candidatoId?: string;
  cargoMunicipal?: { nome: string; ano: number };
} = {}) {
  const { cargoId, candidatoId, cargoMunicipal } = opcoes;

  const [municipios, projecaoPorMunicipio, prefeitos] = await Promise.all([
    prisma.municipio.findMany({ include: { regiao: true } }),
    getEleitoradoProjecao(),
    // Prefeito eleito mais recente de cada município — sempre visível no
    // tooltip como referência local.
    prisma.candidato.findMany({
      where: { eleito: true, cargo: { nome: "Prefeito", eleicao: { tipo: "MUNICIPAL" } } },
      include: { partido: true, cargo: { include: { eleicao: true } } },
    }),
  ]);

  const prefeitoPorMunicipio = new Map<string, { nome: string; partido: string; ano: number }>();
  for (const p of prefeitos) {
    if (!p.cargo.municipioId) continue;
    const atual = prefeitoPorMunicipio.get(p.cargo.municipioId);
    if (!atual || p.cargo.eleicao.ano > atual.ano) {
      prefeitoPorMunicipio.set(p.cargo.municipioId, {
        nome: p.nome,
        partido: p.partido.sigla,
        ano: p.cargo.eleicao.ano,
      });
    }
  }

  // Votos exibidos, mais votado do cargo e link da disputa, por município.
  const votosPorMunicipio = new Map<string, number>();
  const topPorMunicipio = new Map<string, { nome: string; votos: number }>();
  const linkPorMunicipio = new Map<string, string>();

  if (cargoMunicipal) {
    // Prefeito/Vereador de um ano: total local + mais votado local.
    const totais = await prisma.$queryRaw<{ municipioId: string; cargoId: string; votos: bigint }[]>`
      SELECT g.municipioId as municipioId, g.id as cargoId, SUM(r.votos) as votos
      FROM Resultado r
      JOIN Candidato c ON r.candidatoId = c.id
      JOIN Cargo g ON c.cargoId = g.id
      JOIN Eleicao e ON g.eleicaoId = e.id
      WHERE g.nome = ${cargoMunicipal.nome} AND e.ano = ${cargoMunicipal.ano}
        AND g.municipioId IS NOT NULL AND r.turno = 1
      GROUP BY g.municipioId
    `;
    for (const l of totais) {
      votosPorMunicipio.set(l.municipioId, Number(l.votos));
      linkPorMunicipio.set(l.municipioId, l.cargoId);
    }
    const tops = await prisma.$queryRaw<{ municipioId: string; nome: string; votos: bigint }[]>`
      SELECT municipioId, nome, votos FROM (
        SELECT g.municipioId as municipioId, c.nome as nome, SUM(r.votos) as votos,
               ROW_NUMBER() OVER (PARTITION BY g.municipioId ORDER BY SUM(r.votos) DESC) as rn
        FROM Resultado r
        JOIN Candidato c ON r.candidatoId = c.id
        JOIN Cargo g ON c.cargoId = g.id
        JOIN Eleicao e ON g.eleicaoId = e.id
        WHERE g.nome = ${cargoMunicipal.nome} AND e.ano = ${cargoMunicipal.ano}
          AND g.municipioId IS NOT NULL AND r.turno = 1
        GROUP BY g.municipioId, c.id
      ) WHERE rn = 1
    `;
    for (const l of tops) {
      topPorMunicipio.set(l.municipioId, { nome: l.nome, votos: Number(l.votos) });
    }
  } else if (cargoId) {
    // Cargo estadual: votos do candidato selecionado (ou total) + votação
    // do mais votado do cargo em cada município.
    const filtro = candidatoId ? { candidatoId, turno: 1 } : { candidato: { cargoId }, turno: 1 };
    const totais = await prisma.resultado.groupBy({
      by: ["municipioId"],
      where: filtro,
      _sum: { votos: true },
    });
    for (const t of totais) votosPorMunicipio.set(t.municipioId, t._sum.votos ?? 0);
    for (const m of municipios) linkPorMunicipio.set(m.id, cargoId);

    // Mais votado do cargo EM CADA município (não o líder estadual): em
    // Jacareacanga o mais votado local pode não ser o mais votado do Pará.
    const tops = await prisma.$queryRaw<{ municipioId: string; nome: string; votos: bigint }[]>`
      SELECT municipioId, nome, votos FROM (
        SELECT r.municipioId as municipioId, c.nome as nome, SUM(r.votos) as votos,
               ROW_NUMBER() OVER (PARTITION BY r.municipioId ORDER BY SUM(r.votos) DESC) as rn
        FROM Resultado r
        JOIN Candidato c ON r.candidatoId = c.id
        WHERE c.cargoId = ${cargoId} AND r.turno = 1
        GROUP BY r.municipioId, c.id
      ) WHERE rn = 1
    `;
    for (const l of tops) {
      topPorMunicipio.set(l.municipioId, { nome: l.nome, votos: Number(l.votos) });
    }
  }

  return municipios.map((m) => ({
    id: m.id,
    nome: m.nome,
    codigoIbge: m.codigoIbge,
    regiaoId: m.regiaoId,
    regiaoNome: m.regiao.nome,
    totalVotos: votosPorMunicipio.get(m.id) ?? 0,
    top: topPorMunicipio.get(m.id) ?? null,
    linkCargoId: linkPorMunicipio.get(m.id) ?? null,
    populacao: m.populacao,
    prefeito: prefeitoPorMunicipio.get(m.id) ?? null,
    eleitorado: projecaoPorMunicipio.get(m.id) ?? null,
  }));
}

// Opções de cargo do mapa: cargos estaduais reais (valor = cargoId) e os
// municipais como agregados sintéticos por ano (valor = "mun:Nome:ano"),
// já que Prefeito/Vereador têm um Cargo por município.
export async function getCargosMapa() {
  const estaduais = await prisma.cargo.findMany({
    where: { municipioId: null },
    include: { eleicao: true },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
  });
  const municipais = await prisma.eleicao.findMany({
    where: { tipo: "MUNICIPAL", cargos: { some: { candidatos: { some: { eleito: true } } } } },
    orderBy: { ano: "desc" },
  });

  const opcoes = [
    ...estaduais.map((c) => ({ valor: c.id, nome: c.nome, ano: c.eleicao.ano, municipal: false })),
    ...municipais.flatMap((e) => [
      { valor: `mun:Prefeito:${e.ano}`, nome: "Prefeito", ano: e.ano, municipal: true },
      { valor: `mun:Vereador:${e.ano}`, nome: "Vereador", ano: e.ano, municipal: true },
    ]),
  ];
  return opcoes.sort((a, b) => b.ano - a.ano || a.nome.localeCompare(b.nome, "pt-BR"));
}

// Candidatos de um cargo estadual, por votação (para o seletor do mapa).
export async function getCandidatosDoCargo(cargoId: string) {
  const linhas = await prisma.$queryRaw<{ id: string; nome: string; sigla: string; votos: bigint }[]>`
    SELECT c.id as id, c.nome as nome, p.sigla as sigla, COALESCE(SUM(r.votos), 0) as votos
    FROM Candidato c
    JOIN Partido p ON c.partidoId = p.id
    LEFT JOIN Resultado r ON r.candidatoId = c.id AND r.turno = 1
    WHERE c.cargoId = ${cargoId}
    GROUP BY c.id
    ORDER BY votos DESC
  `;
  return linhas.map((l) => ({ id: l.id, nome: l.nome, sigla: l.sigla, votos: Number(l.votos) }));
}

// Projeta o eleitorado de cada município para o próximo pleito,
// a partir da taxa de crescimento observada entre o primeiro e o último
// ano de eleitorado importado (ex: 2018 → 2024). Estimativa simples de
// planejamento — não é dado oficial do TSE, que só existe para anos já
// fechados.


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
    const anoProjecao = proximaEleicao(ultimo.ano);
    const anosAteProjecao = Math.max(0, anoProjecao - ultimo.ano);
    const projecao = Math.round(ultimo.total * Math.pow(1 + taxaAnual, anosAteProjecao));
    resultado.set(municipioId, {
      ultimoAno: ultimo.ano,
      ultimoTotal: ultimo.total,
      anoProjecao,
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

// O LIKE do SQLite só ignora caixa em ASCII: "chicão" não encontra "CHICÃO"
// (os nomes do TSE vêm em maiúsculas acentuadas). Normalizamos a coluna no
// próprio banco — upper() + replace() das acentuadas — para a busca ser
// insensível a caixa E a acentos sem carregar a tabela inteira em memória.
const ACENTOS: [string, string][] = [
  ["á", "A"], ["à", "A"], ["â", "A"], ["ã", "A"], ["ä", "A"],
  ["Á", "A"], ["À", "A"], ["Â", "A"], ["Ã", "A"], ["Ä", "A"],
  ["é", "E"], ["è", "E"], ["ê", "E"], ["ë", "E"],
  ["É", "E"], ["È", "E"], ["Ê", "E"], ["Ë", "E"],
  ["í", "I"], ["ì", "I"], ["î", "I"], ["ï", "I"],
  ["Í", "I"], ["Ì", "I"], ["Î", "I"], ["Ï", "I"],
  ["ó", "O"], ["ò", "O"], ["ô", "O"], ["õ", "O"], ["ö", "O"],
  ["Ó", "O"], ["Ò", "O"], ["Ô", "O"], ["Õ", "O"], ["Ö", "O"],
  ["ú", "U"], ["ù", "U"], ["û", "U"], ["ü", "U"],
  ["Ú", "U"], ["Ù", "U"], ["Û", "U"], ["Ü", "U"],
  ["ç", "C"], ["Ç", "C"],
];

function colunaSemAcento(coluna: string) {
  let expr = `upper(coalesce(${coluna}, ''))`;
  for (const [de, para] of ACENTOS) expr = `replace(${expr}, '${de}', '${para}')`;
  return expr;
}

// Ids de candidatos cujo nome de urna ou nome civil contém o termo (sem
// diferenciar caixa/acento), mais recentes primeiro.
export async function buscarCandidatoIds(termo: string, limite: number) {
  const alvo = `%${normalizar(termo).toUpperCase()}%`;
  const numero = /^\d+$/.test(termo.trim()) ? Number(termo.trim()) : null;
  const sql = `
    SELECT c.id FROM Candidato c
    JOIN Cargo g ON c.cargoId = g.id
    JOIN Eleicao e ON g.eleicaoId = e.id
    WHERE ${colunaSemAcento("c.nome")} LIKE ?
       OR ${colunaSemAcento("c.nomeCompleto")} LIKE ?
       ${numero !== null ? "OR c.numero = ?" : ""}
    ORDER BY e.ano DESC
    LIMIT ?`;
  const params = numero !== null ? [alvo, alvo, numero, limite] : [alvo, alvo, limite];
  const linhas = await prisma.$queryRawUnsafe<{ id: string }[]>(sql, ...params);
  return linhas.map((l) => l.id);
}

// Busca leve para autocompletes (meta de campanha, relatórios).
export async function buscarCandidatosLeve(termo: string, limite = 12) {
  const ids = await buscarCandidatoIds(termo, limite);
  const candidatos = await prisma.candidato.findMany({
    where: { id: { in: ids } },
    include: { partido: true, cargo: { include: { eleicao: true, municipio: true } } },
  });
  const ordem = new Map(ids.map((id, i) => [id, i]));
  return candidatos
    .sort((a, b) => (ordem.get(a.id) ?? 0) - (ordem.get(b.id) ?? 0))
    .map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      partido: c.partido.sigla,
      cargo: c.cargo.nome,
      municipio: c.cargo.municipio?.nome ?? "PA",
      ano: c.cargo.eleicao.ano,
    }));
}

export async function buscarTudo(query: string) {
  const termo = query.trim();
  if (!termo) return { candidatos: [], municipios: [], regioes: [], partidos: [] };

  const termoNormalizado = normalizar(termo);
  const numero = /^\d+$/.test(termo) ? Number(termo) : undefined;

  // Filtro no banco pela busca sem acentos (buscarCandidatoIds) — carregar
  // 100k candidatos com resultados estourava a memória do container.
  const idsCandidatos = await buscarCandidatoIds(termo, 200);
  const [candidatosBrutos, todosMunicipios, todasRegioes, todosPartidos] = await Promise.all([
    prisma.candidato.findMany({
      where: { id: { in: idsCandidatos } },
      include: {
        partido: true,
        cargo: { include: { municipio: true } },
        resultados: true,
      },
    }),
    prisma.municipio.findMany({ include: { regiao: true } }),
    prisma.regiao.findMany(),
    prisma.partido.findMany(),
  ]);

  const candidatos = candidatosBrutos
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
