import "server-only";
import { atualizarBancadas } from "@/lib/bancadas";

atualizarBancadas()
  .then((r) => {
    console.log(
      `Bancadas atualizadas: ${r.atualizados} partidos (${r.totalSen} senadores, ${r.totalDep} deputados).`
    );
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
