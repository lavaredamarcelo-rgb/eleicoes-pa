import "server-only";
import { prisma } from "@/lib/prisma";
import {
  getDadosSimulacaoCargoOuProjetado,
  getReferenciaisViabilidade,
} from "@/lib/data";
import {
  calcularSimulacao,
  type CandidatoSimulacao,
  type OverridePartido,
} from "@/lib/simulacaoPartido";
import type { ConteudoRelatorio } from "@/lib/relatorios";

// Cenário eleitoral completo montado pelo usuário (trocas de partido,
// crescimento de votos, candidatos fictícios, substituições de nomes e
// vagas alteradas). Chega por POST — não cabe em URL — e o servidor
// recalcula tudo a partir dos dados oficiais antes de gerar PDF/relatório.

export type CenarioPayload = {
  cargoId: string;
  vagas?: number;
  overrides?: { candidatoId: string; partidoId?: string; percentual?: number }[];
  ficticios?: { nome: string; partidoId: string; votos: number; genero?: string }[];
  substituicoes?: { candidatoId: string; novoNome: string; genero?: string }[];
  // Gênero atribuído pelo usuário a candidatos reais (para a quota).
  generos?: Record<string, string>;
};

const generoValido = (g?: string): "F" | "M" | undefined =>
  g === "F" || g === "M" ? g : undefined;

export async function calcularCenarioServidor(payload: CenarioPayload) {
  const carga = await getDadosSimulacaoCargoOuProjetado(payload.cargoId);
  if (!carga || carga.dados.tipoApuracao !== "PROPORCIONAL") return null;
  const { dados, votosLegenda, projetado, anoBase } = carga;

  const todosPartidos = await prisma.partido.findMany({
    select: { id: true, sigla: true, nome: true },
  });
  const partidoById = new Map(todosPartidos.map((p) => [p.id, p]));

  // Substituições: o nome muda, os votos e o partido ficam (é a troca de
  // pessoas dentro da chapa, mantendo a força eleitoral de cada posição).
  const substituicaoPorId = new Map(
    (payload.substituicoes ?? [])
      .filter((s) => s.novoNome?.trim())
      .map((s) => [s.candidatoId, { novoNome: s.novoNome.trim().toUpperCase(), genero: generoValido(s.genero) }])
  );

  const base: (CandidatoSimulacao & { eleitoOficial: boolean; substituido?: string })[] =
    dados.candidatos.map((c) => {
      const sub = substituicaoPorId.get(c.id);
      return {
        id: c.id,
        nome: sub ? sub.novoNome : c.nome,
        numero: c.numero,
        votos: c.votos,
        partidoId: c.partidoId,
        partidoSigla: c.partidoSigla,
        eleitoOficial: c.eleito,
        substituido: sub ? c.nome : undefined,
      };
    });

  const ficticios: CandidatoSimulacao[] = (payload.ficticios ?? [])
    .filter((f) => f.nome?.trim() && f.votos > 0 && partidoById.has(f.partidoId))
    .slice(0, 200)
    .map((f, i) => ({
      id: `ficticio-${i}`,
      nome: f.nome.trim().toUpperCase(),
      numero: 0,
      votos: Math.round(f.votos),
      partidoId: f.partidoId,
      partidoSigla: partidoById.get(f.partidoId)?.sigla ?? "?",
    }));
  const ficticioIds = new Set(ficticios.map((f) => f.id));

  const overrides = new Map<string, OverridePartido>(
    (payload.overrides ?? [])
      .filter((o) => o.partidoId || o.percentual)
      .map((o) => [
        o.candidatoId,
        {
          partidoId: o.partidoId && partidoById.has(o.partidoId) ? o.partidoId : undefined,
          percentual: Number.isFinite(o.percentual) ? o.percentual : undefined,
        },
      ])
  );

  const vagas = payload.vagas && payload.vagas > 0 ? Math.min(payload.vagas, 99) : dados.vagas;
  const todos = [...base, ...ficticios];
  const resultado = calcularSimulacao(todos, vagas, overrides, partidoById, votosLegenda);

  const eleitoOficialPorId = new Map(base.map((c) => [c.id, c.eleitoOficial]));
  const nomePorId = new Map(todos.map((c) => [c.id, c.nome]));

  // Quadro da casa: eleitos oficiais de hoje × cadeiras do cenário.
  const antes = new Map<string, number>();
  for (const c of base) {
    if (c.eleitoOficial) antes.set(c.partidoId, (antes.get(c.partidoId) ?? 0) + 1);
  }
  const idsQuadro = new Set([...antes.keys(), ...resultado.partidos.map((p) => p.partidoId)]);
  const quadroCasa = Array.from(idsQuadro)
    .map((partidoId) => {
      const a = antes.get(partidoId) ?? 0;
      const d = resultado.partidos.find((p) => p.partidoId === partidoId)?.quocientePartidario ?? 0;
      return { sigla: partidoById.get(partidoId)?.sigla ?? "?", antes: a, depois: d, delta: d - a };
    })
    .filter((q) => q.antes > 0 || q.depois > 0)
    .sort((a, b) => b.depois - a.depois || b.antes - a.antes);

  const eleitosPorPartido = resultado.partidos
    .filter((p) => p.quocientePartidario > 0)
    .map((p) => ({
      sigla: p.sigla,
      cadeiras: p.quocientePartidario,
      eleitos: [...p.candidatos]
        .sort((a, b) => b.votosEfetivos - a.votosEfetivos)
        .slice(0, p.quocientePartidario)
        .map((c) => ({
          nome: c.nome,
          votos: c.votosEfetivos,
          ficticio: ficticioIds.has(c.id),
          substituto: base.find((b) => b.id === c.id)?.substituido !== undefined,
          trocou: c.partidoIdEfetivo !== c.partidoId,
          entra: !(eleitoOficialPorId.get(c.id) ?? false),
        })),
    }))
    .sort((a, b) => b.cadeiras - a.cadeiras);

  const quemSai = base
    .filter((c) => c.eleitoOficial && resultado.situacao.get(c.id)?.situacao === "suplente")
    .map((c) => ({
      nome: c.nome,
      sigla: partidoById.get(overrides.get(c.id)?.partidoId ?? c.partidoId)?.sigla ?? c.partidoSigla,
      ordemSuplencia: resultado.situacao.get(c.id)?.ordemSuplencia ?? 0,
    }));

  const mudancas: string[] = [];
  for (const [candidatoId, o] of overrides) {
    const c = base.find((b) => b.id === candidatoId);
    if (!c) continue;
    const partes: string[] = [];
    if (o.partidoId) partes.push(`${c.partidoSigla} → ${partidoById.get(o.partidoId)?.sigla}`);
    if (o.percentual) partes.push(`votos ${o.percentual > 0 ? "+" : ""}${o.percentual}%`);
    mudancas.push(`${c.nome}: ${partes.join(" · ")}`);
  }
  for (const f of ficticios) {
    mudancas.push(`Fictício ${f.nome} (${f.partidoSigla}) com ${f.votos.toLocaleString("pt-BR")} votos`);
  }
  for (const [id, sub] of substituicaoPorId) {
    const original = dados.candidatos.find((c) => c.id === id);
    if (original) mudancas.push(`Substituição: ${original.nome} → ${sub.novoNome}`);
  }
  if (vagas !== dados.vagas) mudancas.push(`Vagas em disputa: ${dados.vagas} → ${vagas}`);

  // Quota de gênero (art. 10, §3º, Lei 9.504/97) por partido do cenário:
  // considera os gêneros informados pelo usuário (substituições, fictícios
  // e atribuições manuais); candidatos sem gênero contam como "a definir".
  const generoPorId = new Map<string, "F" | "M">();
  for (const [id, g] of Object.entries(payload.generos ?? {})) {
    const v = generoValido(g);
    if (v) generoPorId.set(id, v);
  }
  for (const [id, sub] of substituicaoPorId) {
    if (sub.genero) generoPorId.set(id, sub.genero);
  }
  (payload.ficticios ?? []).forEach((f, i) => {
    const v = generoValido(f.genero);
    if (v) generoPorId.set(`ficticio-${i}`, v);
  });

  const quotaPorPartido = resultado.partidos
    .filter((p) => p.candidatos.length > 0)
    .map((p) => {
      const total = p.candidatos.length;
      let f = 0;
      let m = 0;
      for (const c of p.candidatos) {
        const g = generoPorId.get(c.id);
        if (g === "F") f++;
        else if (g === "M") m++;
      }
      const minimoPorGenero = Math.ceil(total * 0.3);
      return {
        sigla: p.sigla,
        total,
        feminino: f,
        masculino: m,
        semGenero: total - f - m,
        minimoPorGenero,
        limiteRegistro: Math.floor(vagas * 1.5),
        atendeQuota: f >= minimoPorGenero && m >= minimoPorGenero,
      };
    })
    .sort((a, b) => b.total - a.total);

  return {
    cargo: {
      nome: dados.cargoNome,
      ano: dados.ano,
      municipioNome: dados.municipioNome,
      vagasOficiais: dados.vagas,
    },
    projetado,
    anoBase,
    vagas,
    qeOficial: dados.quocienteEleitoral,
    qeSimulado: resultado.quocienteEleitoral,
    votosValidosSimulados: resultado.votosValidos,
    mudancas,
    quadroCasa,
    eleitosPorPartido,
    quemSai,
    quotaPorPartido,
    temGeneroInformado: generoPorId.size > 0,
    nomePorId,
  };
}

export type CenarioCalculado = NonNullable<Awaited<ReturnType<typeof calcularCenarioServidor>>>;

// Estudo fictício de viabilidade da distribuição manual: insere o pretenso
// candidato na disputa base com o total alimentado e compara com o QE e a
// linha de corte das eleições passadas e da projeção da próxima.
export async function estudoViabilidadeServidor(
  cargoId: string,
  partidoId: string,
  nome: string,
  total: number
) {
  const carga = await getDadosSimulacaoCargoOuProjetado(cargoId);
  if (!carga || carga.dados.tipoApuracao !== "PROPORCIONAL") return null;
  const { dados, votosLegenda } = carga;

  const [referenciais, partidos] = await Promise.all([
    getReferenciaisViabilidade(carga.baseCargoId),
    prisma.partido.findMany({ select: { id: true, sigla: true, nome: true } }),
  ]);
  if (!referenciais) return null;

  const partidoById = new Map(partidos.map((p) => [p.id, p]));
  if (!partidoById.has(partidoId)) return null;

  const resultado = calcularSimulacao(
    [
      ...dados.candidatos,
      {
        id: "estudo-manual",
        nome: nome.toUpperCase(),
        numero: 0,
        votos: total,
        partidoId,
        partidoSigla: partidoById.get(partidoId)?.sigla ?? "?",
      },
    ],
    dados.vagas,
    new Map(),
    partidoById,
    votosLegenda
  );
  const situacao = resultado.situacao.get("estudo-manual");

  const comparar = (r: { qe: number; corte: number }) =>
    total >= r.qe
      ? "Atingiria o QE sozinho"
      : total >= r.corte
        ? "Acima da linha de corte"
        : `Abaixo do corte (faltam ${(r.corte - total).toLocaleString("pt-BR")})`;

  return {
    rotulo: `${dados.cargoNome} · ${dados.municipioNome ?? "PA"} · ${dados.ano}`,
    sigla: partidoById.get(partidoId)?.sigla ?? "?",
    eleito: situacao?.situacao === "eleito",
    ordemSuplencia: situacao?.ordemSuplencia ?? null,
    qeSimulado: resultado.quocienteEleitoral,
    cadeirasPartido:
      resultado.partidos.find((p) => p.partidoId === partidoId)?.quocientePartidario ?? 0,
    linhas: [
      ...referenciais.referencias.map((r) => ({
        rotulo: String(r.ano),
        qe: r.qe,
        corte: r.corte,
        veredicto: comparar(r),
      })),
      ...(referenciais.projecao
        ? [
            {
              rotulo: `${referenciais.projecao.ano} (projeção)`,
              qe: referenciais.projecao.qe,
              corte: referenciais.projecao.corte,
              veredicto: comparar(referenciais.projecao),
            },
          ]
        : []),
    ],
  };
}

export type EstudoViabilidadeCalculado = NonNullable<
  Awaited<ReturnType<typeof estudoViabilidadeServidor>>
>;

const f = (n: number) => n.toLocaleString("pt-BR");

// Conteúdo estruturado para a aba Relatórios (mesmo formato dos demais).
export function conteudoRelatorioCenario(calc: CenarioCalculado): ConteudoRelatorio {
  const abrangencia = calc.cargo.municipioNome ?? "PA";
  const secoes: ConteudoRelatorio["secoes"] = [
    {
      titulo: "Mudanças aplicadas ao cenário",
      destaques: calc.mudancas.length > 0 ? calc.mudancas.slice(0, 20) : ["Nenhuma mudança — cenário igual ao oficial."],
    },
    {
      titulo: "Quadro da casa (cadeiras por partido: hoje → cenário)",
      tabela: {
        colunas: ["Partido", "Hoje", "Cenário", "Saldo"],
        linhas: calc.quadroCasa.map((q) => [
          q.sigla,
          String(q.antes),
          String(q.depois),
          q.delta === 0 ? "—" : q.delta > 0 ? `+${q.delta}` : String(q.delta),
        ]),
      },
    },
    {
      titulo: "Eleitos no cenário",
      tabela: {
        colunas: ["Partido", "Candidato", "Votos", "Observação"],
        linhas: calc.eleitosPorPartido.flatMap((g) =>
          g.eleitos.map((c) => [
            g.sigla,
            c.nome,
            f(c.votos),
            [
              c.ficticio ? "fictício" : null,
              c.substituto ? "substituto" : null,
              c.trocou ? "trocou de partido" : null,
              !c.ficticio && c.entra ? "entra na casa" : null,
            ]
              .filter(Boolean)
              .join(", ") || "—",
          ])
        ),
      },
    },
  ];

  if (calc.quemSai.length > 0) {
    secoes.push({
      titulo: "Quem sai da casa",
      tabela: {
        colunas: ["Candidato", "Partido", "Nova situação"],
        linhas: calc.quemSai.map((c) => [c.nome, c.sigla, `${c.ordemSuplencia}º suplente`]),
      },
    });
  }

  if (calc.temGeneroInformado) {
    secoes.push({
      titulo: "Quota de gênero (art. 10, §3º, Lei 9.504/97)",
      paragrafos: [
        "Cada partido ou federação deve reservar no mínimo 30% e no máximo 70% das candidaturas para cada gênero (fração arredonda para cima no mínimo). O limite de registro é de 150% das vagas em disputa.",
      ],
      tabela: {
        colunas: ["Partido", "Candidaturas", "Feminino", "Masculino", "A definir", "Mín. por gênero", "Situação"],
        linhas: calc.quotaPorPartido
          .filter((q) => q.feminino + q.masculino > 0)
          .map((q) => [
            q.sigla,
            String(q.total),
            String(q.feminino),
            String(q.masculino),
            String(q.semGenero),
            String(q.minimoPorGenero),
            q.semGenero > 0 ? "Incompleto" : q.atendeQuota ? "Atende" : "NÃO atende",
          ]),
      },
    });
  }

  return {
    titulo: `Cenário simulado — ${calc.cargo.nome} · ${abrangencia} · ${calc.cargo.ano}${calc.projetado ? " (projeção)" : ""}`,
    resumo: `Cenário hipotético sobre a ${calc.projetado ? `disputa PROJETADA de ${calc.cargo.ano} (base real de ${calc.anoBase}, votos escalados pelo eleitorado)` : `eleição de ${calc.cargo.ano}`} (${calc.cargo.nome}, ${abrangencia}) com ${calc.mudancas.length} mudança(s). Quociente eleitoral: ${f(calc.qeOficial)} (referência) → ${f(calc.qeSimulado)} (cenário), com ${f(calc.votosValidosSimulados)} votos válidos (nominais + legenda) para ${calc.vagas} vagas. Projeção hipotética — não altera os dados oficiais do sistema.`,
    secoes,
  };
}
