import "server-only";
import { prisma } from "@/lib/prisma";

// Bancadas no Congresso Nacional por partido, consultadas em 08/07/2026:
// Senado (81): senado.leg.br "senadores em exercício por partido";
// Câmara (513): API dadosabertos.camara.leg.br (deputados em exercício).
// Já refletem a janela partidária de 2026. Partidos fora da lista ficam 0.
const BANCADAS: Record<string, { sen: number; dep: number }> = {
  MDB: { sen: 10, dep: 38 },
  PT: { sen: 9, dep: 65 },
  PL: { sen: 16, dep: 97 },
  "UNIÃO": { sen: 3, dep: 52 },
  PP: { sen: 7, dep: 46 },
  PSD: { sen: 13, dep: 48 },
  REPUBLICANOS: { sen: 6, dep: 42 },
  PSB: { sen: 7, dep: 17 },
  PSDB: { sen: 3, dep: 18 },
  PDT: { sen: 2, dep: 10 },
  PODE: { sen: 3, dep: 27 },
  PSOL: { sen: 0, dep: 13 },
  "PC DO B": { sen: 0, dep: 11 },
  PV: { sen: 0, dep: 6 },
  CIDADANIA: { sen: 0, dep: 2 },
  SOLIDARIEDADE: { sen: 0, dep: 4 },
  AVANTE: { sen: 1, dep: 5 },
  REDE: { sen: 0, dep: 3 },
};

async function main() {
  const partidos = await prisma.partido.findMany();
  let atualizados = 0;
  for (const p of partidos) {
    const bancada = BANCADAS[p.sigla] ?? { sen: 0, dep: 0 };
    await prisma.partido.update({
      where: { id: p.id },
      data: { senadoresNacional: bancada.sen, deputadosNacional: bancada.dep },
    });
    atualizados++;
  }
  console.log(`Bancadas atualizadas: ${atualizados} partidos.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
