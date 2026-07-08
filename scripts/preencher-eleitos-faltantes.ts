import "server-only";
import { prisma } from "@/lib/prisma";
import { distribuirVagas } from "@/lib/simulacaoPartido";

// Alguns cargos vêm do TSE com DS_SIT_TOT_TURNO "#NULO" para todos os
// candidatos (ex.: Vereador de Ananindeua e Prefeito de Tucuruí em 2024,
// pendências de totalização). Quando o cargo tem votação apurada mas nenhum
// eleito oficial, derivamos os eleitos dos próprios votos: majoritário =
// mais votados até as vagas; proporcional = quociente + sobras, mesma regra
// do restante do sistema.
async function main() {
  const cargos = await prisma.cargo.findMany({
    include: {
      eleicao: true,
      municipio: true,
      candidatos: { include: { resultados: true } },
    },
  });

  let corrigidos = 0;
  for (const cargo of cargos) {
    // Quando o arquivo veio sem eleitos, as vagas inferidas ficaram em 1.
    // Para proporcionais, herdamos as vagas do mesmo cargo/município em
    // outra eleição (as cadeiras da câmara não mudam de um pleito p/ outro).
    let vagas = cargo.vagas;
    if (cargo.tipoApuracao === "PROPORCIONAL" && vagas <= 1) {
      const irmao = await prisma.cargo.findFirst({
        where: {
          nome: cargo.nome,
          municipioId: cargo.municipioId,
          id: { not: cargo.id },
          vagas: { gt: 1 },
        },
        orderBy: { eleicao: { ano: "desc" } },
      });
      if (irmao) {
        vagas = irmao.vagas;
        await prisma.cargo.update({ where: { id: cargo.id }, data: { vagas } });
        console.log(
          `${cargo.eleicao.ano} ${cargo.nome}${cargo.municipio ? ` (${cargo.municipio.nome})` : ""}: vagas corrigidas 1 -> ${vagas}.`
        );
      }
    }

    const eleitosAtuais = cargo.candidatos.filter((c) => c.eleito).length;
    if (eleitosAtuais >= Math.min(vagas, cargo.candidatos.length) || (eleitosAtuais > 0 && cargo.tipoApuracao === "MAJORITARIO")) continue;

    const comVotos = cargo.candidatos
      .map((c) => ({
        id: c.id,
        partidoId: c.partidoId,
        votos: c.resultados.reduce((s, r) => s + r.votos, 0),
      }))
      .filter((c) => c.votos > 0)
      .sort((a, b) => b.votos - a.votos);
    if (comVotos.length === 0) continue;

    let eleitosIds: string[] = [];
    if (cargo.tipoApuracao === "MAJORITARIO") {
      eleitosIds = comVotos.slice(0, vagas).map((c) => c.id);
    } else {
      const votosValidos = comVotos.reduce((s, c) => s + c.votos, 0);
      const qe = vagas > 0 ? Math.floor(votosValidos / vagas) : 0;
      const porPartido = new Map<string, { partidoId: string; votos: number }>();
      for (const c of comVotos) {
        const atual = porPartido.get(c.partidoId);
        if (atual) atual.votos += c.votos;
        else porPartido.set(c.partidoId, { partidoId: c.partidoId, votos: c.votos });
      }
      const vagasPorPartido = distribuirVagas(Array.from(porPartido.values()), vagas, qe);
      for (const [partidoId, qtd] of vagasPorPartido) {
        eleitosIds.push(...comVotos.filter((c) => c.partidoId === partidoId).slice(0, qtd).map((c) => c.id));
      }
    }

    if (eleitosIds.length === 0) continue;
    await prisma.candidato.updateMany({
      where: { id: { in: eleitosIds } },
      data: { eleito: true },
    });
    corrigidos++;
    console.log(
      `${cargo.eleicao.ano} ${cargo.nome}${cargo.municipio ? ` (${cargo.municipio.nome})` : ""}: ${eleitosIds.length} eleito(s) derivados dos votos.`
    );
  }
  console.log(`Cargos corrigidos: ${corrigidos}`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
