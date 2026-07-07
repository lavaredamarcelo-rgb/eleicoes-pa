import "server-only";
import { prisma } from "@/lib/prisma";
import { distribuirVagas } from "@/lib/simulacaoPartido";

// Lista, por cargo, apenas os candidatos eleitos (não os suplentes/não
// eleitos) — usada na aba "Eleitos". Reaproveita a mesma regra de sobras
// do cálculo de quociente para cargos proporcionais; para majoritários,
// eleito é simplesmente quem tem mais votos.
export async function getTodosEleitos(ano?: number) {
  const cargos = await prisma.cargo.findMany({
    where: ano ? { eleicao: { ano } } : undefined,
    include: {
      eleicao: true,
      municipio: true,
      candidatos: { include: { partido: true, resultados: true } },
    },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
  });

  return cargos
    .map((cargo) => {
      const candidatosComVotos = cargo.candidatos.map((c) => ({
        ...c,
        votos: c.resultados.reduce((s, r) => s + r.votos, 0),
      }));

      let eleitos: typeof candidatosComVotos = [];

      if (cargo.tipoApuracao === "MAJORITARIO") {
        const ordenado = [...candidatosComVotos].sort((a, b) => b.votos - a.votos);
        eleitos = ordenado.slice(0, 1);
      } else {
        const votosValidos = candidatosComVotos.reduce((s, c) => s + c.votos, 0);
        const quocienteEleitoral = cargo.vagas > 0 ? Math.floor(votosValidos / cargo.vagas) : 0;

        const porPartido = new Map<string, { partidoId: string; votos: number }>();
        for (const c of candidatosComVotos) {
          const atual = porPartido.get(c.partidoId);
          if (atual) atual.votos += c.votos;
          else porPartido.set(c.partidoId, { partidoId: c.partidoId, votos: c.votos });
        }
        const vagasFinais = distribuirVagas(Array.from(porPartido.values()), cargo.vagas, quocienteEleitoral);

        const porPartidoOrdenado = new Map<string, typeof candidatosComVotos>();
        for (const c of candidatosComVotos) {
          const lista = porPartidoOrdenado.get(c.partidoId);
          if (lista) lista.push(c);
          else porPartidoOrdenado.set(c.partidoId, [c]);
        }
        for (const [partidoId, lista] of porPartidoOrdenado) {
          const vagas = vagasFinais.get(partidoId) ?? 0;
          const ordenado = [...lista].sort((a, b) => b.votos - a.votos);
          eleitos.push(...ordenado.slice(0, vagas));
        }
      }

      return {
        cargoId: cargo.id,
        cargoNome: cargo.nome,
        tipoApuracao: cargo.tipoApuracao,
        ano: cargo.eleicao.ano,
        tipoEleicao: cargo.eleicao.tipo,
        municipioId: cargo.municipio?.id ?? null,
        municipioNome: cargo.municipio?.nome ?? null,
        eleitos: eleitos.sort((a, b) => b.votos - a.votos),
      };
    })
    .filter((c) => c.eleitos.length > 0);
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
  const cargos = await prisma.cargo.findMany({
    include: {
      eleicao: true,
      municipio: true,
      candidatos: { include: { resultados: { include: { municipio: true } } } },
    },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
  });

  type MunicipioVoto = { municipioId: string; municipioNome: string; totalVotos: number; cargoId: string };
  type CargoGrupo = { cargoNome: string; tipoApuracao: string; municipios: MunicipioVoto[] };
  type AnoGrupo = { ano: number; tipo: string; cargos: Map<string, CargoGrupo> };

  const porAno = new Map<number, AnoGrupo>();

  for (const cargo of cargos) {
    const ano = cargo.eleicao.ano;
    let anoGrupo = porAno.get(ano);
    if (!anoGrupo) {
      anoGrupo = { ano, tipo: cargo.eleicao.tipo, cargos: new Map() };
      porAno.set(ano, anoGrupo);
    }
    let cargoGrupo = anoGrupo.cargos.get(cargo.nome);
    if (!cargoGrupo) {
      cargoGrupo = { cargoNome: cargo.nome, tipoApuracao: cargo.tipoApuracao, municipios: [] };
      anoGrupo.cargos.set(cargo.nome, cargoGrupo);
    }

    if (cargo.municipio) {
      const total = cargo.candidatos.reduce(
        (s, c) => s + c.resultados.reduce((s2, r) => s2 + r.votos, 0),
        0
      );
      cargoGrupo.municipios.push({
        municipioId: cargo.municipio.id,
        municipioNome: cargo.municipio.nome,
        totalVotos: total,
        cargoId: cargo.id,
      });
    } else {
      const porMunicipio = new Map<string, MunicipioVoto>();
      for (const c of cargo.candidatos) {
        for (const r of c.resultados) {
          const atual = porMunicipio.get(r.municipioId);
          if (atual) atual.totalVotos += r.votos;
          else
            porMunicipio.set(r.municipioId, {
              municipioId: r.municipioId,
              municipioNome: r.municipio.nome,
              totalVotos: r.votos,
              cargoId: cargo.id,
            });
        }
      }
      cargoGrupo.municipios.push(...porMunicipio.values());
    }
  }

  return Array.from(porAno.values())
    .sort((a, b) => b.ano - a.ano)
    .map((anoGrupo) => ({
      ano: anoGrupo.ano,
      tipo: anoGrupo.tipo,
      cargos: Array.from(anoGrupo.cargos.values()).map((c) => ({
        ...c,
        municipios: c.municipios.sort((a, b) => b.totalVotos - a.totalVotos),
      })),
    }));
}

// Total de votos apurados por ano de eleição (somando todos os cargos),
// para o gráfico comparativo de votações anteriores.
export async function getVotosPorAnoEleicao() {
  const cargos = await prisma.cargo.findMany({
    include: { eleicao: true, candidatos: { include: { resultados: true } } },
  });

  const porAno = new Map<number, number>();
  for (const cargo of cargos) {
    const total = cargo.candidatos.reduce(
      (s, c) => s + c.resultados.reduce((s2, r) => s2 + r.votos, 0),
      0
    );
    porAno.set(cargo.eleicao.ano, (porAno.get(cargo.eleicao.ano) ?? 0) + total);
  }

  return Array.from(porAno.entries())
    .filter(([, total]) => total > 0)
    .sort((a, b) => a[0] - b[0])
    .map(([ano, total]) => ({ ano, total }));
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

// Outras candidaturas do mesmo nome de urna em anos diferentes — permite ver
// o histórico eleitoral de uma pessoa sem precisar ligar Candidato entre
// eleições no schema (cada eleição gera um registro novo).
export async function getCandidaturasAnteriores(nome: string, excluirId: string) {
  const candidatos = await prisma.candidato.findMany({
    where: { nome, id: { not: excluirId } },
    include: {
      partido: true,
      cargo: { include: { eleicao: true, municipio: true } },
      resultados: true,
    },
  });

  return candidatos
    .map((c) => ({ ...c, totalVotos: c.resultados.reduce((s, r) => s + r.votos, 0) }))
    .sort((a, b) => b.cargo.eleicao.ano - a.cargo.eleicao.ano);
}

export async function getPartidos() {
  return prisma.partido.findMany({ orderBy: { sigla: "asc" } });
}

// Lista de partidos com estatísticas agregadas (total de eleitos e votos em
// todo o histórico importado) — usada na aba "Partidos Políticos".
export async function getPartidosComEstatisticas() {
  const partidos = await prisma.partido.findMany({
    include: { candidatos: { include: { resultados: true, cargo: true } } },
    orderBy: { sigla: "asc" },
  });

  return partidos
    .map((p) => {
      const totalVotos = p.candidatos.reduce(
        (s, c) => s + c.resultados.reduce((s2, r) => s2 + r.votos, 0),
        0
      );
      return {
        ...p,
        totalCandidatos: p.candidatos.length,
        totalVotos,
      };
    })
    .sort((a, b) => b.totalVotos - a.totalVotos);
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

  return { ...partido, candidatos: candidatosComVotos, membrosFederacao };
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

export async function getMunicipios(regiaoId?: string) {
  const municipios = await prisma.municipio.findMany({
    where: regiaoId ? { regiaoId } : undefined,
    include: {
      regiao: true,
      resultados: true,
    },
    orderBy: { nome: "asc" },
  });

  return municipios.map((m) => ({
    ...m,
    totalVotos: m.resultados.reduce((sum, r) => sum + r.votos, 0),
  }));
}

export async function getMunicipio(id: string) {
  const municipio = await prisma.municipio.findUnique({
    where: { id },
    include: {
      regiao: true,
      resultados: {
        include: { candidato: { include: { partido: true, cargo: true } } },
        orderBy: { votos: "desc" },
      },
      colegiosEleitorais: { orderBy: { nome: "asc" } },
    },
  });
  return municipio;
}

export async function getRegioes() {
  const regioes = await prisma.regiao.findMany({
    include: {
      municipios: { include: { resultados: true } },
    },
    orderBy: { nome: "asc" },
  });

  return regioes.map((r) => {
    const totalVotos = r.municipios.reduce(
      (sum, m) => sum + m.resultados.reduce((s, res) => s + res.votos, 0),
      0
    );
    return { ...r, totalVotos, totalMunicipios: r.municipios.length };
  });
}

export async function getMapaDados(cargoId?: string) {
  const [municipios, projecaoPorMunicipio] = await Promise.all([
    prisma.municipio.findMany({
      include: {
        regiao: true,
        resultados: {
          where: cargoId ? { candidato: { cargoId } } : undefined,
          include: { candidato: { include: { partido: true } } },
          orderBy: { votos: "desc" },
        },
      },
    }),
    getEleitoradoProjecao(),
  ]);

  return municipios.map((m) => {
    const totalVotos = m.resultados.reduce((sum, r) => sum + r.votos, 0);
    const lider = m.resultados[0]?.candidato;
    return {
      id: m.id,
      nome: m.nome,
      codigoIbge: m.codigoIbge,
      regiaoId: m.regiaoId,
      regiaoNome: m.regiao.nome,
      totalVotos,
      lider: lider ? { nome: lider.nome, partido: lider.partido.sigla } : null,
      eleitorado: projecaoPorMunicipio.get(m.id) ?? null,
    };
  });
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
  if (!termo) return { candidatos: [], municipios: [], regioes: [] };

  const termoNormalizado = normalizar(termo);
  const numero = /^\d+$/.test(termo) ? Number(termo) : undefined;

  const [todosCandidatos, todosMunicipios, todasRegioes] = await Promise.all([
    prisma.candidato.findMany({
      include: {
        partido: true,
        cargo: { include: { municipio: true } },
        resultados: true,
      },
    }),
    prisma.municipio.findMany({ include: { regiao: true } }),
    prisma.regiao.findMany(),
  ]);

  const candidatos = todosCandidatos
    .filter((c) => normalizar(c.nome).includes(termoNormalizado) || c.numero === numero)
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

  return { candidatos, municipios, regioes };
}
