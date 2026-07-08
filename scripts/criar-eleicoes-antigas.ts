import "server-only";
import { prisma } from "@/lib/prisma";

// Cadastra as eleições de 2012/2014/2016 (PA) para receber o histórico.
const ELEICOES: { ano: number; tipo: "MUNICIPAL" | "ESTADUAL" }[] = [
  { ano: 2012, tipo: "MUNICIPAL" },
  { ano: 2014, tipo: "ESTADUAL" },
  { ano: 2016, tipo: "MUNICIPAL" },
];

async function main() {
  for (const e of ELEICOES) {
    const existente = await prisma.eleicao.findFirst({ where: { ano: e.ano } });
    if (existente) {
      console.log(`${e.ano}: já cadastrada.`);
      continue;
    }
    await prisma.eleicao.create({ data: { ano: e.ano, uf: "PA", tipo: e.tipo } });
    console.log(`${e.ano}: criada (${e.tipo}).`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
