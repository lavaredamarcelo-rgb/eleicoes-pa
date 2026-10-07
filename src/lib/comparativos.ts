import { prisma } from "@/lib/prisma";
import { votosDecisivos } from "@/lib/turnos";

// Comparativos entre eleições: de uma eleição completa (cadeiras por
// partido, quem entrou/saiu/reeleito) e de um candidato consigo mesmo
// (votação por município entre duas candidaturas).

const normalizar = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .replace(/\s+/g, " ")
    .trim();

// Identidade de pessoa entre eleições: CPF quando houver; senão o nome
// civil normalizado; senão o nome de urna normalizado.
function chavePessoa(c: { cpf: string | null; nomeCompleto: string | null; nome: string }) {
  if (c.cpf && /^\d{11}$/.test(c.cpf)) return `c${c.cpf}`;
  if (c.nomeCompleto) return `n${normalizar(c.nomeCompleto)}`;
  return `u${normalizar(c.nome)}`;
}

export const CARGOS_COMPARAVEIS = [
  "Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
] as const;

// Anos em que o cargo teve eleitos registrados (para os seletores).
export async function anosDoCargo(cargoNome: string) {
  const eleicoes = await prisma.eleicao.findMany({
    where: { cargos: { some: { nome: cargoNome, candidatos: { some: { eleito: true } } } } },
    select: { ano: true },
    orderBy: { ano: "desc" },
  });
  return [...new Set(eleicoes.map((e) => e.ano))];
}

type EleitoResumo = {
  id: string;
  nome: string;
  partido: string;
  votos: number;
  chave: string;
};

async function eleitosDoAno(cargoNome: string, ano: number): Promise<EleitoResumo[]> {
  const candidatos = await prisma.candidato.findMany({
    where: { eleito: true, cargo: { nome: cargoNome, eleicao: { ano } } },
    include: { partido: true, resultados: true },
  });
  return candidatos.map((c) => ({
    id: c.id,
    nome: c.nome,
    partido: c.partido.sigla,
    votos: votosDecisivos(c.resultados),
    chave: chavePessoa(c),
  }));
}

export type ComparativoEleicao = Awaited<ReturnType<typeof compararEleicoes>>;

// Eleição × eleição de um cargo: saldo de cadeiras por partido e as
// listas de reeleitos, estreantes (entraram) e quem saiu.
export async function compararEleicoes(cargoNome: string, anoA: number, anoB: number) {
  const [eleitosA, eleitosB] = await Promise.all([
    eleitosDoAno(cargoNome, anoA),
    eleitosDoAno(cargoNome, anoB),
  ]);

  const porPartido = new Map<string, { a: number; b: number }>();
  for (const e of eleitosA) {
    const p = porPartido.get(e.partido) ?? { a: 0, b: 0 };
    p.a += 1;
    porPartido.set(e.partido, p);
  }
  for (const e of eleitosB) {
    const p = porPartido.get(e.partido) ?? { a: 0, b: 0 };
    p.b += 1;
    porPartido.set(e.partido, p);
  }
  const cadeiras = [...porPartido.entries()]
    .map(([sigla, { a, b }]) => ({ sigla, a, b, delta: b - a }))
    .sort((x, y) => y.b - x.b || y.a - x.a);

  const mapaA = new Map(eleitosA.map((e) => [e.chave, e]));
  const mapaB = new Map(eleitosB.map((e) => [e.chave, e]));

  const reeleitos = eleitosB
    .filter((e) => mapaA.has(e.chave))
    .map((e) => {
      const antes = mapaA.get(e.chave)!;
      return {
        ...e,
        votosAntes: antes.votos,
        partidoAntes: antes.partido,
        deltaVotos: e.votos - antes.votos,
      };
    })
    .sort((x, y) => y.votos - x.votos);
  const entraram = eleitosB
    .filter((e) => !mapaA.has(e.chave))
    .sort((x, y) => y.votos - x.votos);
  const sairam = eleitosA
    .filter((e) => !mapaB.has(e.chave))
    .sort((x, y) => y.votos - x.votos);

  return { cargoNome, anoA, anoB, cadeiras, reeleitos, entraram, sairam, totalA: eleitosA.length, totalB: eleitosB.length };
}

// Duelo DENTRO de um município: votos dos dois candidatos somados por
// BAIRRO (via locais de votação). Também lista os municípios onde pelo
// menos um dos dois tem votos por local, para o seletor.
export async function dueloPorBairro(idA: string, idB: string, municipio: string) {
  const carregar = (id: string) =>
    prisma.votoLocal.findMany({
      where: { candidatoId: id, turno: 1, colegioEleitoral: { municipio: { nome: municipio } } },
      include: { colegioEleitoral: { select: { bairro: true } } },
    });
  const [la, lb] = await Promise.all([carregar(idA), carregar(idB)]);
  const mapa = new Map<string, { bairro: string; a: number; b: number }>();
  const somar = (lado: "a" | "b", lista: typeof la) => {
    for (const v of lista) {
      const bairro = v.colegioEleitoral.bairro?.trim() || "(bairro não informado)";
      const atual = mapa.get(bairro) ?? { bairro, a: 0, b: 0 };
      atual[lado] += v.votos;
      mapa.set(bairro, atual);
    }
  };
  somar("a", la);
  somar("b", lb);
  return [...mapa.values()]
    .map((l) => ({ ...l, delta: l.a - l.b }))
    .sort((x, y) => y.a + y.b - (x.a + x.b));
}

export async function municipiosComLocais(idA: string, idB: string) {
  const rows = await prisma.votoLocal.findMany({
    where: { candidatoId: { in: [idA, idB] }, turno: 1 },
    select: { colegioEleitoral: { select: { municipio: { select: { nome: true } } } } },
    distinct: ["colegioEleitoralId"],
  });
  return [...new Set(rows.map((r) => r.colegioEleitoral.municipio.nome))].sort((a, b) =>
    a.localeCompare(b, "pt-BR")
  );
}

// Votação de duas candidaturas (da mesma pessoa) município a município.
export async function compararPorMunicipio(idA: string, idB: string) {
  const carregar = (id: string) =>
    prisma.candidato.findUnique({
      where: { id },
      include: {
        partido: true,
        cargo: { include: { eleicao: true } },
        resultados: { include: { municipio: { include: { regiao: true } } } },
      },
    });
  const [a, b] = await Promise.all([carregar(idA), carregar(idB)]);
  if (!a || !b) return null;

  const mapa = new Map<
    string,
    { municipio: string; regiao: string; a: number; b: number }
  >();
  const somar = (lado: "a" | "b", resultados: NonNullable<typeof a>["resultados"]) => {
    for (const r of resultados) {
      if (r.turno !== 1) continue;
      const atual = mapa.get(r.municipio.nome) ?? {
        municipio: r.municipio.nome,
        regiao: r.municipio.regiao.nome,
        a: 0,
        b: 0,
      };
      atual[lado] += r.votos;
      mapa.set(r.municipio.nome, atual);
    }
  };
  somar("a", a.resultados);
  somar("b", b.resultados);

  const linhas = [...mapa.values()]
    .map((l) => ({ ...l, delta: l.b - l.a }))
    .sort((x, y) => y.b - x.b);

  const resumo = (c: NonNullable<typeof a>) => ({
    id: c.id,
    nome: c.nome,
    ano: c.cargo.eleicao.ano,
    cargo: c.cargo.nome,
    partido: c.partido.sigla,
    eleito: c.eleito,
    total: votosDecisivos(c.resultados),
  });

  return { a: resumo(a), b: resumo(b), linhas };
}
