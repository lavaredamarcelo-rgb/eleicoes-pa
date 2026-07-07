import "server-only";
import { prisma } from "@/lib/prisma";

export async function getEleicoes() {
  return prisma.eleicao.findMany({
    include: { cargos: { include: { municipio: true } } },
    orderBy: { ano: "desc" },
  });
}

export async function getCargos() {
  return prisma.cargo.findMany({
    include: { eleicao: true, municipio: true },
    orderBy: [{ eleicao: { ano: "desc" } }, { nome: "asc" }],
  });
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

export async function getPartidos() {
  return prisma.partido.findMany({ orderBy: { sigla: "asc" } });
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
