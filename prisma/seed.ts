import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import municipiosIbge from "../src/data/pa-municipios.json";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Os 144 municípios e as 6 mesorregiões oficiais do Pará, gerados por
// scripts/generate-municipios-data.mjs a partir da API do IBGE.
const MUNICIPIOS: { nome: string; codigoIbge: string; regiao: string }[] = municipiosIbge;

const PARTIDOS = [
  { sigla: "PT", nome: "Partido dos Trabalhadores", numero: 13 },
  { sigla: "PL", nome: "Partido Liberal", numero: 22 },
  { sigla: "MDB", nome: "Movimento Democrático Brasileiro", numero: 15 },
  { sigla: "PSDB", nome: "Partido da Social Democracia Brasileira", numero: 45 },
  { sigla: "PSD", nome: "Partido Social Democrático", numero: 55 },
  { sigla: "UNIÃO", nome: "União Brasil", numero: 44 },
];

function randomVotos(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function criarCandidatosComVotos(
  cargoId: string,
  candidatosBase: { nome: string; numero: number; partido: string }[],
  partidosById: Map<string, string>,
  municipioIds: Iterable<string>,
  faixaVotos: [number, number]
) {
  for (const c of candidatosBase) {
    const candidato = await prisma.candidato.create({
      data: {
        nome: c.nome,
        numero: c.numero,
        cargoId,
        partidoId: partidosById.get(c.partido)!,
      },
    });
    for (const municipioId of municipioIds) {
      await prisma.resultado.create({
        data: {
          candidatoId: candidato.id,
          municipioId,
          votos: randomVotos(...faixaVotos),
        },
      });
    }
  }
}

async function main() {
  // Limpa dados de execuções anteriores do seed (ordem respeita FKs)
  await prisma.resultado.deleteMany();
  await prisma.colegioEleitoral.deleteMany();
  await prisma.candidato.deleteMany();
  await prisma.cargo.deleteMany();
  await prisma.eleicao.deleteMany();
  await prisma.user.deleteMany({ where: { role: { not: "ADMIN" } } });
  await prisma.municipio.deleteMany();
  await prisma.regiao.deleteMany();
  await prisma.partido.deleteMany();

  // Regiões e municípios
  const regiaoIdByNome = new Map<string, string>();
  const municipiosByNome = new Map<string, string>();
  for (const m of MUNICIPIOS) {
    let regiaoId = regiaoIdByNome.get(m.regiao);
    if (!regiaoId) {
      const regiao = await prisma.regiao.upsert({
        where: { nome: m.regiao },
        update: {},
        create: { nome: m.regiao },
      });
      regiaoId = regiao.id;
      regiaoIdByNome.set(m.regiao, regiaoId);
    }

    const municipio = await prisma.municipio.upsert({
      where: { nome_regiaoId: { nome: m.nome, regiaoId } },
      update: { codigoIbge: m.codigoIbge },
      create: { nome: m.nome, regiaoId, codigoIbge: m.codigoIbge },
    });
    municipiosByNome.set(m.nome, municipio.id);
  }

  // Partidos
  const partidosById = new Map<string, string>();
  for (const p of PARTIDOS) {
    const partido = await prisma.partido.upsert({
      where: { sigla: p.sigla },
      update: {},
      create: p,
    });
    partidosById.set(p.sigla, partido.id);
  }

  // Eleição estadual 2026
  const eleicaoEstadual = await prisma.eleicao.create({
    data: { ano: 2026, uf: "PA", tipo: "ESTADUAL" },
  });

  const cargoGovernador = await prisma.cargo.create({
    data: {
      nome: "Governador",
      tipoApuracao: "MAJORITARIO",
      vagas: 1,
      eleicaoId: eleicaoEstadual.id,
    },
  });

  const cargoDepEstadual = await prisma.cargo.create({
    data: {
      nome: "Deputado Estadual",
      tipoApuracao: "PROPORCIONAL",
      vagas: 41,
      eleicaoId: eleicaoEstadual.id,
    },
  });

  const cargoDepFederal = await prisma.cargo.create({
    data: {
      nome: "Deputado Federal",
      tipoApuracao: "PROPORCIONAL",
      vagas: 17,
      eleicaoId: eleicaoEstadual.id,
    },
  });

  // Eleição municipal 2028 (demo em Belém)
  const eleicaoMunicipal = await prisma.eleicao.create({
    data: { ano: 2028, uf: "PA", tipo: "MUNICIPAL" },
  });

  const belemId = municipiosByNome.get("Belém")!;

  const cargoPrefeito = await prisma.cargo.create({
    data: {
      nome: "Prefeito",
      tipoApuracao: "MAJORITARIO",
      vagas: 1,
      eleicaoId: eleicaoMunicipal.id,
      municipioId: belemId,
    },
  });

  const cargoVereador = await prisma.cargo.create({
    data: {
      nome: "Vereador",
      tipoApuracao: "PROPORCIONAL",
      vagas: 35,
      eleicaoId: eleicaoMunicipal.id,
      municipioId: belemId,
    },
  });

  // Candidatos - Governador (majoritário, estadual)
  await criarCandidatosComVotos(
    cargoGovernador.id,
    [
      { nome: "Ana Ferreira", numero: 13, partido: "PT" },
      { nome: "Carlos Nunes", numero: 22, partido: "PL" },
      { nome: "Beatriz Souza", numero: 15, partido: "MDB" },
    ],
    partidosById,
    Array.from(municipiosByNome.values()),
    [2000, 60000]
  );

  // Candidatos - Deputado Estadual (proporcional)
  await criarCandidatosComVotos(
    cargoDepEstadual.id,
    [
      { nome: "João Ramos", numero: 1301, partido: "PT" },
      { nome: "Marcos Lima", numero: 2201, partido: "PL" },
      { nome: "Fernanda Costa", numero: 4501, partido: "PSDB" },
      { nome: "Renata Alves", numero: 5501, partido: "PSD" },
    ],
    partidosById,
    Array.from(municipiosByNome.values()),
    [200, 8000]
  );

  // Candidatos - Deputado Federal (proporcional)
  await criarCandidatosComVotos(
    cargoDepFederal.id,
    [
      { nome: "Paulo Vieira", numero: 1310, partido: "PT" },
      { nome: "Camila Duarte", numero: 2210, partido: "PL" },
      { nome: "Roberto Cunha", numero: 1510, partido: "MDB" },
      { nome: "Juliana Rocha", numero: 4410, partido: "UNIÃO" },
    ],
    partidosById,
    Array.from(municipiosByNome.values()),
    [300, 10000]
  );

  // Candidatos - Prefeito de Belém (majoritário)
  await criarCandidatosComVotos(
    cargoPrefeito.id,
    [
      { nome: "Rogério Batista", numero: 13, partido: "PT" },
      { nome: "Patrícia Gomes", numero: 44, partido: "UNIÃO" },
    ],
    partidosById,
    [belemId],
    [80000, 300000]
  );

  // Candidatos - Vereador de Belém (proporcional)
  await criarCandidatosComVotos(
    cargoVereador.id,
    [
      { nome: "Tiago Pereira", numero: 1350, partido: "PT" },
      { nome: "Larissa Monteiro", numero: 2255, partido: "PL" },
      { nome: "Eduardo Farias", numero: 5510, partido: "PSD" },
    ],
    partidosById,
    [belemId],
    [3000, 25000]
  );

  // Usuário admin
  const adminPassword = "eleicoes2026";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: "lavaredamarcelo@gmail.com" },
    update: {},
    create: {
      nome: "Marcelo Lavareda",
      email: "lavaredamarcelo@gmail.com",
      passwordHash,
      role: "ADMIN",
    },
  });

  console.log("Seed concluído.");
  console.log(`Login admin: lavaredamarcelo@gmail.com / senha: ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
