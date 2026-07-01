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
  const municipios = await prisma.municipio.findMany({
    include: {
      regiao: true,
      resultados: {
        where: cargoId ? { candidato: { cargoId } } : undefined,
        include: { candidato: { include: { partido: true } } },
        orderBy: { votos: "desc" },
      },
    },
  });

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
    };
  });
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

export async function getRegiao(id: string) {
  const regiao = await prisma.regiao.findUnique({
    where: { id },
    include: {
      municipios: {
        include: { resultados: true },
        orderBy: { nome: "asc" },
      },
    },
  });
  if (!regiao) return null;

  const municipios = regiao.municipios.map((m) => ({
    ...m,
    totalVotos: m.resultados.reduce((sum, r) => sum + r.votos, 0),
  }));

  return { ...regiao, municipios };
}
