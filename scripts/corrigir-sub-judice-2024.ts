// Corrige as disputas de Vereador 2024 que ficaram sub judice (Breu Branco,
// Placas e Rurópolis) buscando o resultado oficial atual no TSE.
// Uso: DATABASE_URL="file:./dev.db" npx tsx scripts/corrigir-sub-judice-2024.ts
import { corrigirSubJudice2024 } from "../src/lib/tse/corrigirSubJudice";

corrigirSubJudice2024()
  .then((resumo) => {
    for (const linha of resumo) console.log(linha);
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
