import "server-only";
import { prisma } from "@/lib/prisma";
async function main() {
  const a = await prisma.resultado.deleteMany({});
  const b = await prisma.votoLegenda.deleteMany({});
  console.log("apagados:", a.count, b.count);
}
main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
