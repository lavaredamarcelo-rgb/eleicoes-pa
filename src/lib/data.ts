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
    },
  });
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
