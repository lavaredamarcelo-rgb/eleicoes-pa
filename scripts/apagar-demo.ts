import "server-only";
import { prisma } from "@/lib/prisma";

// Remove as eleições de demonstração (2026/2028, criadas com dados
// fictícios na fase inicial do projeto) e tudo que depende delas. As
// eleições reais importadas do TSE (2018-2024) não são tocadas.
const ANOS_DEMO = [2026, 2028];

async function main() {
  for (const ano of ANOS_DEMO) {
    const eleicoes = await prisma.eleicao.findMany({ where: { ano } });
    for (const eleicao of eleicoes) {
      const cargos = await prisma.cargo.findMany({ where: { eleicaoId: eleicao.id } });
      const cargoIds = cargos.map((c) => c.id);
      const candidatos = await prisma.candidato.findMany({
        where: { cargoId: { in: cargoIds } },
        select: { id: true },
      });
      const candidatoIds = candidatos.map((c) => c.id);

      const usuarios = await prisma.user.updateMany({
        where: { candidatoId: { in: candidatoIds } },
        data: { candidatoId: null },
      });
      const trocas = await prisma.trocaPartido.deleteMany({
        where: { candidatoId: { in: candidatoIds } },
      });
      const resultados = await prisma.resultado.deleteMany({
        where: { candidatoId: { in: candidatoIds } },
      });
      const cands = await prisma.candidato.deleteMany({ where: { id: { in: candidatoIds } } });
      const cgs = await prisma.cargo.deleteMany({ where: { id: { in: cargoIds } } });
      await prisma.eleicao.delete({ where: { id: eleicao.id } });

      console.log(
        `${ano}: eleicao removida (cargos=${cgs.count} candidatos=${cands.count} resultados=${resultados.count} trocas=${trocas.count} usuarios desvinculados=${usuarios.count})`
      );
    }
    if (eleicoes.length === 0) console.log(`${ano}: nenhuma eleição encontrada.`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
