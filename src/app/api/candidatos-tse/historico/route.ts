import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Histórico político de um nome de urna, com duas correções importantes:
// 1) A mesma pessoa muda de nome de urna entre eleições (ex.: "DR. DANIEL"
//    x "DR. DANIEL SANTOS") — por isso a busca expande por CPF/nome civil
//    e também por nomes que contêm o nome pesquisado.
// 2) Nomes de urna têm homônimos (pessoas diferentes) — por isso o retorno
//    é agrupado POR PESSOA (CPF/nome civil), nunca misturado.
export async function GET(req: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const nome = req.nextUrl.searchParams.get("nome")?.trim();
  if (!nome) {
    return NextResponse.json({ error: "Informe o nome." }, { status: 400 });
  }

  try {
    const include = {
      partido: { select: { sigla: true } },
      cargo: {
        include: {
          eleicao: { select: { ano: true } },
          municipio: { select: { nome: true } },
        },
      },
      resultados: { select: { votos: true } },
      trocasPartido: {
        include: {
          partidoOrigem: { select: { sigla: true } },
          partidoDestino: { select: { sigla: true } },
        },
        orderBy: { data: "asc" as const },
      },
    };

    // 1ª passada: nome exato ou nomes de urna que contêm o pesquisado.
    const iniciais = await prisma.candidato.findMany({
      where: {
        OR: [{ nome: { equals: nome } }, { nome: { contains: nome } }],
      },
      include,
      take: 300,
    });

    // 2ª passada: expande pela identidade civil (CPF/nome completo) para
    // capturar candidaturas com nome de urna totalmente diferente.
    const cpfs = [...new Set(iniciais.map((c) => c.cpf).filter(Boolean))] as string[];
    const nomesCompletos = [
      ...new Set(iniciais.map((c) => c.nomeCompleto).filter(Boolean)),
    ] as string[];
    const expandidos =
      cpfs.length || nomesCompletos.length
        ? await prisma.candidato.findMany({
            where: {
              OR: [
                ...(cpfs.length ? [{ cpf: { in: cpfs } }] : []),
                ...(nomesCompletos.length
                  ? [{ nomeCompleto: { in: nomesCompletos } }]
                  : []),
              ],
            },
            include,
            take: 300,
          })
        : [];

    const todos = new Map<string, (typeof iniciais)[number]>();
    for (const c of [...iniciais, ...expandidos]) todos.set(c.id, c);

    // Agrupa por pessoa: CPF > nome civil > nome de urna (último recurso).
    type Pessoa = {
      chave: string;
      nomeCompleto: string | null;
      nomesUrna: Set<string>;
      candidaturas: {
        ano: number;
        cargo: string;
        municipio: string | null;
        partido: string;
        nomeUrna: string;
        votos: number;
        eleito: boolean;
      }[];
      trocas: { data: Date; de: string; para: string; motivo: string | null }[];
      partidos: Set<string>;
    };
    const pessoas = new Map<string, Pessoa>();

    for (const c of todos.values()) {
      const chave = c.cpf || c.nomeCompleto || `urna:${c.nome}`;
      let p = pessoas.get(chave);
      if (!p) {
        p = {
          chave,
          nomeCompleto: c.nomeCompleto,
          nomesUrna: new Set(),
          candidaturas: [],
          trocas: [],
          partidos: new Set(),
        };
        pessoas.set(chave, p);
      }
      if (!p.nomeCompleto && c.nomeCompleto) p.nomeCompleto = c.nomeCompleto;
      p.nomesUrna.add(c.nome);
      const ano = c.cargo.eleicao.ano;
      if (ano < 2026) {
        p.candidaturas.push({
          ano,
          cargo: c.cargo.nome,
          municipio: c.cargo.municipio?.nome ?? null,
          partido: c.partido.sigla,
          nomeUrna: c.nome,
          votos: c.resultados.reduce((s, r) => s + r.votos, 0),
          eleito: c.eleito,
        });
        p.partidos.add(c.partido.sigla);
      }
      for (const t of c.trocasPartido) {
        p.trocas.push({
          data: t.data,
          de: t.partidoOrigem.sigla,
          para: t.partidoDestino.sigla,
          motivo: t.motivo,
        });
        p.partidos.add(t.partidoOrigem.sigla);
        p.partidos.add(t.partidoDestino.sigla);
      }
    }

    const resultado = Array.from(pessoas.values())
      .map((p) => {
        const vistos = new Set<string>();
        return {
          nomeCompleto: p.nomeCompleto,
          nomesUrna: [...p.nomesUrna],
          candidaturas: p.candidaturas
            .filter((c) => {
              const k = `${c.ano}|${c.cargo}|${c.partido}|${c.municipio ?? ""}`;
              if (vistos.has(k)) return false;
              vistos.add(k);
              return true;
            })
            .sort((a, b) => b.ano - a.ano),
          trocas: p.trocas,
          partidos: [...p.partidos],
        };
      })
      .filter((p) => p.candidaturas.length > 0 || p.trocas.length > 0)
      .sort((a, b) => b.candidaturas.length - a.candidaturas.length)
      .slice(0, 6);

    return NextResponse.json({ pessoas: resultado });
  } catch (e) {
    console.error("Erro no histórico:", e);
    return NextResponse.json({ error: "Erro ao buscar histórico." }, { status: 500 });
  }
}
