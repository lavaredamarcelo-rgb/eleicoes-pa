import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { RadarApuracao } from "@/components/RadarApuracao";

// RADAR DA APURAÇÃO — acompanhamento ao vivo do dia 04/10/2026, com modo
// simulado (ensaio com os dados de 2022), boca de urna virtual (comparativo
// com a média das pesquisas), destaques dos favoritos e modo TV.
export default async function RadarPage({
  searchParams,
}: {
  searchParams: Promise<{ tv?: string }>;
}) {
  const session = await verifySession();
  const { tv } = await searchParams;

  // Vagas por cargo (2026): Senado renova 2 cadeiras; proporcionais seguem 2022.
  const cargos2022 = await prisma.cargo.findMany({
    where: { municipioId: null, eleicao: { ano: 2022 }, nome: { in: ["Deputado Federal", "Deputado Estadual"] } },
    select: { nome: true, vagas: true },
  });
  const vagas: Record<string, number> = {
    governador: 1,
    senador: 2,
    "dep-federal": cargos2022.find((c) => c.nome === "Deputado Federal")?.vagas ?? 17,
    "dep-estadual": cargos2022.find((c) => c.nome === "Deputado Estadual")?.vagas ?? 41,
    presidente: 1,
  };

  // Siglas por prefixo de número (os 2 primeiros dígitos do número do
  // candidato identificam o partido).
  const partidos = await prisma.partido.findMany({
    where: { numero: { lte: 99 } },
    select: { numero: true, sigla: true },
    distinct: ["numero"],
  });
  const siglaPorPrefixo: Record<string, string> = {};
  for (const p of partidos) siglaPorPrefixo[String(p.numero)] = p.sigla;

  // Favoritos do usuário — casados por nome normalizado com os nomes do TSE.
  const favoritos = await prisma.politicoFavorito.findMany({
    where: { userId: String(session.userId) },
    include: { candidato: { select: { nome: true } } },
  });
  const nomesFavoritos = [...new Set(favoritos.map((f) => f.candidato.nome.toUpperCase().trim()))];

  // Boca de urna virtual: média das últimas 3 pesquisas estimuladas de 1º
  // turno por disputa (Governador e Senador), ignorando suspensas e linhas
  // de brancos/nulos/indecisos.
  const NAO_CANDIDATO =
    /brancos?|nulos?|n[aã]o sabe|n[aã]o respondeu|n[aã]o votar|nenhum|indecisos?|ns\/nr|ns\/sr|^outros?$/i;
  const mediasPesquisas: Record<string, Record<string, number>> = {};
  for (const disputa of ["Governador", "Senador"]) {
    const pesquisas = await prisma.pesquisaEleitoral.findMany({
      where: {
        disputa,
        turno: 1,
        tipo: "estimulada",
        NOT: { observacoes: { contains: "SUSPENSA" } },
      },
      orderBy: { dataDivulgacao: "desc" },
      take: 3,
      include: { resultados: true },
    });
    const soma: Record<string, { s: number; n: number }> = {};
    for (const p of pesquisas) {
      for (const r of p.resultados) {
        if (NAO_CANDIDATO.test(r.nome)) continue;
        const chave = r.nome.toUpperCase().trim();
        soma[chave] = { s: (soma[chave]?.s ?? 0) + r.percentual, n: (soma[chave]?.n ?? 0) + 1 };
      }
    }
    mediasPesquisas[disputa === "Governador" ? "governador" : "senador"] = Object.fromEntries(
      Object.entries(soma).map(([nome, { s, n }]) => [nome, s / n])
    );
  }

  return (
    <RadarApuracao
      vagas={vagas}
      siglaPorPrefixo={siglaPorPrefixo}
      nomesFavoritos={nomesFavoritos}
      mediasPesquisas={mediasPesquisas}
      modoTV={tv === "1"}
    />
  );
}
