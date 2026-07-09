// Sincroniza a filiação atual dos deputados federais e senadores do PA com
// os dados abertos da Câmara e do Senado, registrando TrocaPartido (o
// partido da urna nunca é alterado). Também roda automaticamente na
// atualização mensal de bancadas.
//
// Uso: npx tsx -r dotenv/config scripts/sincronizar-filiacoes.ts
import { sincronizarFiliacoesPA } from "../src/lib/bancadas";
import { prisma } from "../src/lib/prisma";

sincronizarFiliacoesPA()
  .then((r) => {
    console.log(`Concluído: ${r.registradas} trocas registradas, ${r.avisos.length} avisos.`);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
