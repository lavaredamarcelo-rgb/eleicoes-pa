// Executa no boot do servidor (Next instrumentation). Agenda a
// atualização automática mensal das bancadas no Congresso: uma checagem
// pouco depois de subir e depois a cada 24h — só consulta as APIs do
// Senado/Câmara quando a última atualização tem mais de 30 dias.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const VERIFICA_A_CADA_MS = 24 * 60 * 60 * 1000;
  const ATRASO_INICIAL_MS = 2 * 60 * 1000;

  const rodar = async () => {
    try {
      const { atualizarBancadasSeVencido } = await import("@/lib/bancadas");
      const resultado = await atualizarBancadasSeVencido();
      if (resultado) {
        console.log(
          `[auto] Bancadas atualizadas: ${resultado.atualizados} partidos ` +
            `(${resultado.totalSen} senadores, ${resultado.totalDep} deputados).`
        );
      }
    } catch (err) {
      console.error("[auto] Falha na atualização de bancadas:", err);
    }
  };

  setTimeout(rodar, ATRASO_INICIAL_MS);
  setInterval(rodar, VERIFICA_A_CADA_MS);
}
