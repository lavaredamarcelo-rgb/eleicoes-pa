import "server-only";
import { prisma } from "@/lib/prisma";

export function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

// Mapeia o DS_CARGO do TSE (ex.: "VEREADOR", "DEPUTADO ESTADUAL") para o
// nome de Cargo usado no sistema (ex.: "Vereador", "Deputado Estadual").
const CARGOS_SUPORTADOS: Record<string, { nome: string; municipal: boolean; tipoApuracao: "MAJORITARIO" | "PROPORCIONAL" }> = {
  "prefeito": { nome: "Prefeito", municipal: true, tipoApuracao: "MAJORITARIO" },
  "vereador": { nome: "Vereador", municipal: true, tipoApuracao: "PROPORCIONAL" },
  "governador": { nome: "Governador", municipal: false, tipoApuracao: "MAJORITARIO" },
  "deputado estadual": { nome: "Deputado Estadual", municipal: false, tipoApuracao: "PROPORCIONAL" },
  "deputado federal": { nome: "Deputado Federal", municipal: false, tipoApuracao: "PROPORCIONAL" },
};

export function resolverCargo(dsCargo: string) {
  return CARGOS_SUPORTADOS[normalizarTexto(dsCargo)];
}

const SITUACOES_ELEITO = ["eleito", "eleito por qp", "eleito por media", "eleito por média"];

export function situacaoIndicaEleito(dsSituacao: string | undefined) {
  if (!dsSituacao) return false;
  return SITUACOES_ELEITO.includes(normalizarTexto(dsSituacao));
}

const cacheMunicipios = new Map<string, { id: string; nome: string; codigoTse: string | null }[]>();

export async function carregarMunicipiosPa() {
  const chave = "PA";
  const existente = cacheMunicipios.get(chave);
  if (existente) return existente;
  const municipios = await prisma.municipio.findMany({
    select: { id: true, nome: true, codigoTse: true },
  });
  cacheMunicipios.set(chave, municipios);
  return municipios;
}

export function limparCacheMunicipios() {
  cacheMunicipios.clear();
}

export async function encontrarMunicipio(codigoTse: string | undefined, nomeMunicipio: string | undefined) {
  const municipios = await carregarMunicipiosPa();

  if (codigoTse) {
    const porCodigo = municipios.find((m) => m.codigoTse === codigoTse);
    if (porCodigo) return porCodigo;
  }

  if (nomeMunicipio) {
    const nomeNormalizado = normalizarTexto(nomeMunicipio);
    const porNome = municipios.find((m) => normalizarTexto(m.nome) === nomeNormalizado);
    if (porNome) return porNome;
  }

  return null;
}

export type ResumoImportacao = {
  criados: number;
  atualizados: number;
  avisos: string[];
};

export function novoResumo(): ResumoImportacao {
  return { criados: 0, atualizados: 0, avisos: [] };
}
