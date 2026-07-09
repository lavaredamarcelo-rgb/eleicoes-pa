// Complemento pontual da varredura de filiações (jul/2026):
// 1) Conserta candidatos cujo partido da urna foi sobrescrito por trocas
//    manuais registradas antes da correção da action (partidoId volta ao
//    partido de origem da PRIMEIRA troca).
// 2) Registra a troca do Dr. Daniel (Prefeito de Ananindeua): PSB → PODE
//    em 25/03/2026, filiação como pré-candidato ao Governo do Pará.
// Uso: npx tsx -r dotenv/config scripts/aplicar-varredura-jul2026.ts
import { prisma } from "../src/lib/prisma";

async function main() {
  // 1) cura de partidoId sobrescrito
  const comTrocas = await prisma.candidato.findMany({
    where: { trocasPartido: { some: {} } },
    include: { partido: true, trocasPartido: { orderBy: { data: "asc" }, include: { partidoOrigem: true, partidoDestino: true } } },
  });
  let curados = 0;
  for (const c of comTrocas) {
    const primeira = c.trocasPartido[0];
    const ultima = c.trocasPartido[c.trocasPartido.length - 1];
    if (c.partidoId === ultima.partidoDestinoId && c.partidoId !== primeira.partidoOrigemId) {
      await prisma.candidato.update({ where: { id: c.id }, data: { partidoId: primeira.partidoOrigemId } });
      console.log(`curado: ${c.nome} — urna volta a ${primeira.partidoOrigem.sigla} (filiação atual segue ${ultima.partidoDestino.sigla})`);
      curados++;
    }
  }
  console.log(`cura de urna: ${curados} candidato(s)`);

  // 2) Dr. Daniel
  const daniel = await prisma.candidato.findFirst({
    where: {
      nome: { contains: "DANIEL" },
      eleito: true,
      cargo: { nome: "Prefeito", eleicao: { ano: 2024 }, municipio: { nome: "Ananindeua" } },
    },
    include: { partido: true, trocasPartido: { orderBy: { data: "desc" }, take: 1, include: { partidoDestino: true } } },
  });
  if (!daniel) throw new Error("Dr. Daniel não encontrado");
  const atual = daniel.trocasPartido[0]?.partidoDestino ?? daniel.partido;
  const pode = await prisma.partido.findUnique({ where: { sigla: "PODE" } });
  if (!pode) throw new Error("PODE não cadastrado");
  if (atual.id !== pode.id) {
    await prisma.trocaPartido.create({
      data: {
        candidatoId: daniel.id,
        partidoOrigemId: atual.id,
        partidoDestinoId: pode.id,
        data: new Date("2026-03-25T12:00:00Z"),
        motivo: "Filiou-se ao Podemos como pré-candidato ao Governo do Pará (O Liberal/Opinião em Pauta, 25/03/2026)",
      },
    });
    console.log(`Dr. Daniel: ${atual.sigla} → PODE registrado`);
  } else {
    console.log("Dr. Daniel já está como PODE — nada a fazer");
  }

  const total = await prisma.trocaPartido.count();
  console.log(`total de trocas registradas no banco: ${total}`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
