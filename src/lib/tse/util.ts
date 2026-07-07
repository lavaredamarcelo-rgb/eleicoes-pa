import "server-only";
import { prisma } from "@/lib/prisma";

export function normalizarTexto(texto: string) {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/['\u2019]/g, "")
    .trim()
    .toLowerCase();
}

// Alguns municipios tem grafia oficial divergente entre o IBGE (usado no
// nosso cadastro) e o TSE. Mapeamos o nome normalizado do TSE para o nome
// normalizado equivalente ja cadastrado.
const ALIASES_MUNICIPIO: Record<string, string> = {
  "eldorado dos carajas": "eldorado do carajas",
  "santa isabel do para": "santa izabel do para",
  "pau d arco": "pau darco",
};

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

// Vice-prefeito/vice-governador concorrem na mesma chapa do titular, sem
// votação própria — mapeamos para o nome do Cargo do titular para poder
// anexar o vice ao candidato certo durante a importação.
const VICE_PARA_CARGO: Record<string, string> = {
  "vice-prefeito": "Prefeito",
  "vice-governador": "Governador",
};

export function resolverCargoDoVice(dsCargo: string) {
  return VICE_PARA_CARGO[normalizarTexto(dsCargo)];
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
    const nomeNormalizado = ALIASES_MUNICIPIO[normalizarTexto(nomeMunicipio)] ?? normalizarTexto(nomeMunicipio);
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
