import "server-only";
import { prisma } from "@/lib/prisma";

type DadosPartido = {
  presidenteNacional?: string;
  presidenteEstadualPA?: string;
  federacao?: string;
  federacaoMembros?: string;
  espectro?: string;
  fundacao?: number;
  figurasNotaveis?: string;
};

// Dados institucionais pesquisados na web em 2026-07 (ver relatório da
// pesquisa) — presidências nacionais, federações partidárias ativas para o
// ciclo eleitoral de 2026 e lideranças estaduais no Pará quando encontradas.
const DADOS: Record<string, DadosPartido> = {
  PT: {
    presidenteNacional: "Edinho Silva",
    federacao: "Brasil da Esperança",
    federacaoMembros: "PT, PC DO B, PV",
    espectro: "Esquerda",
    fundacao: 1980,
    figurasNotaveis: "Luiz Inácio Lula da Silva (Presidente da República), Edinho Silva",
  },
  PL: {
    presidenteNacional: "Valdemar Costa Neto",
    espectro: "Direita",
    fundacao: 2006,
    figurasNotaveis: "Jair Bolsonaro, Flávio Bolsonaro",
  },
  MDB: {
    presidenteNacional: "Baleia Rossi",
    espectro: "Centro",
    fundacao: 1966,
    figurasNotaveis: "Helder Barbalho (governador do Pará), Renan Calheiros",
  },
  "UNIÃO": {
    presidenteNacional: "Antonio Rueda",
    federacao: "União Progressista",
    federacaoMembros: "UNIÃO, PP",
    espectro: "Centro-direita",
    fundacao: 2022,
    figurasNotaveis: "Antonio Rueda, ACM Neto",
  },
  PP: {
    presidenteNacional: "Ciro Nogueira",
    federacao: "União Progressista",
    federacaoMembros: "UNIÃO, PP",
    espectro: "Direita",
    fundacao: 1995,
    figurasNotaveis: "Ciro Nogueira, Arthur Lira",
  },
  PSD: {
    presidenteNacional: "Gilberto Kassab",
    espectro: "Centro",
    fundacao: 2011,
    figurasNotaveis: "Ronaldo Caiado (governador de Goiás), Gilberto Kassab",
  },
  REPUBLICANOS: {
    presidenteNacional: "Marcos Pereira",
    espectro: "Direita",
    fundacao: 2005,
    figurasNotaveis: "Tarcísio de Freitas (governador de SP), Marcos Pereira",
  },
  PSB: {
    presidenteNacional: "João Campos",
    espectro: "Centro-esquerda",
    fundacao: 1947,
    figurasNotaveis: "João Campos (prefeito do Recife), Geraldo Alckmin (Vice-Presidente da República)",
  },
  PSDB: {
    presidenteNacional: "Aécio Neves",
    federacao: "PSDB Cidadania",
    federacaoMembros: "PSDB, CIDADANIA",
    espectro: "Centro",
    fundacao: 1988,
    figurasNotaveis: "Aécio Neves, Marconi Perillo",
  },
  PDT: {
    presidenteNacional: "Carlos Lupi",
    espectro: "Centro-esquerda",
    fundacao: 1979,
    presidenteEstadualPA: "Dr. Giovanni Queiroz",
    figurasNotaveis: "Cid Gomes (senador), Weverton Rocha (senador)",
  },
  PSOL: {
    presidenteNacional: "Paula Coradi",
    federacao: "PSOL-REDE",
    federacaoMembros: "PSOL, REDE",
    espectro: "Esquerda",
    fundacao: 2004,
    presidenteEstadualPA: "Araceli Lemos",
    figurasNotaveis: "Guilherme Boulos (deputado federal, prefeito de SP), Erika Hilton (deputada federal)",
  },
  PODE: {
    presidenteNacional: "Renata Abreu",
    espectro: "Centro",
    fundacao: 1994,
    figurasNotaveis: "Sergio Moro (senador)",
  },
  "PC DO B": {
    presidenteNacional: "Luciana Santos",
    federacao: "Brasil da Esperança",
    federacaoMembros: "PT, PC DO B, PV",
    espectro: "Esquerda",
    fundacao: 1962,
    figurasNotaveis: "Orlando Silva (deputado federal)",
  },
  PV: {
    presidenteNacional: "José Luiz Penna",
    federacao: "Brasil da Esperança",
    federacaoMembros: "PT, PC DO B, PV",
    espectro: "Centro-esquerda (ecologista)",
    fundacao: 1986,
    figurasNotaveis: "Fernando Gabeira",
  },
  SOLIDARIEDADE: {
    presidenteNacional: "Paulo Pereira da Silva (Paulinho da Força)",
    federacao: "Renovação Solidária",
    federacaoMembros: "SOLIDARIEDADE, PRD",
    espectro: "Centro",
    fundacao: 2013,
  },
  CIDADANIA: {
    presidenteNacional: "Alex Manente",
    federacao: "PSDB Cidadania",
    federacaoMembros: "PSDB, CIDADANIA",
    espectro: "Centro",
    fundacao: 1992,
    figurasNotaveis: "Roberto Freire (presidente nacional por mais de 30 anos)",
  },
  AVANTE: {
    presidenteNacional: "Luis Henrique de Oliveira Resende",
    espectro: "Centro",
    fundacao: 1994,
    presidenteEstadualPA: "Luiz Henrique da Silva",
  },
  AGIR: {
    presidenteNacional: "Daniel Tourinho",
    espectro: "Centro a centro-direita",
    fundacao: 1985,
  },
  DC: {
    presidenteNacional: "João Caldas",
    espectro: "Centro-direita (democracia cristã)",
    figurasNotaveis: "José Maria Eymael, Joaquim Barbosa (pré-candidato lançado pelo partido em 2026)",
  },
  PATRIOTA: {
    figurasNotaveis: "Partido extinto em 2023 — fundiu-se ao PTB, formando o PRD (Partido Renovação Democrática)",
  },
  PMB: {
    presidenteNacional: "Suêd Haidar Nogueira",
    figurasNotaveis: "Partido alterou o nome para \"Democrata\" em 2025",
  },
  PROS: {
    figurasNotaveis: "Partido extinto em 2023 — incorporado ao Solidariedade",
  },
  PRTB: {
    presidenteNacional: "Antônio Amauri Pinho (presidência contestada judicialmente)",
    espectro: "Direita a extrema-direita",
    fundacao: 1994,
    figurasNotaveis: "Pablo Marçal, Levy Fidelix",
  },
  PSC: {
    figurasNotaveis: "Partido extinto em 2023 — incorporado ao Podemos",
  },
  PSTU: {
    presidenteNacional: "José Maria de Almeida (Zé Maria)",
    espectro: "Extrema-esquerda",
    fundacao: 1994,
    figurasNotaveis: "José Maria de Almeida, Vera Lúcia",
  },
  PTB: {
    fundacao: 1979,
    figurasNotaveis: "Partido extinto em 2023 — fundiu-se ao Patriota, formando o PRD (Partido Renovação Democrática)",
  },
  REDE: {
    presidenteNacional: "Paulo Lamac (porta-voz nacional)",
    federacao: "PSOL-REDE",
    federacaoMembros: "PSOL, REDE",
    espectro: "Centro-esquerda (ambientalismo)",
    figurasNotaveis: "Paulo Lamac, Juliano Medeiros (presidente da federação PSOL-REDE)",
  },
  UP: {
    presidenteNacional: "Leonardo Péricles",
    espectro: "Extrema-esquerda",
    figurasNotaveis: "Leonardo Péricles, Samara Martins (pré-candidata à Presidência em 2026)",
  },
};

async function main() {
  let atualizados = 0;
  let naoEncontrados: string[] = [];

  for (const [sigla, dados] of Object.entries(DADOS)) {
    const partido = await prisma.partido.findUnique({ where: { sigla } });
    if (!partido) {
      naoEncontrados.push(sigla);
      continue;
    }
    await prisma.partido.update({ where: { id: partido.id }, data: dados });
    atualizados++;
  }

  console.log(`Partidos atualizados: ${atualizados}`);
  if (naoEncontrados.length > 0) {
    console.log(`Siglas não encontradas no banco: ${naoEncontrados.join(", ")}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
