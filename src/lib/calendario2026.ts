// Calendário eleitoral das Eleições Gerais 2026 (Resolução TSE nº
// 23.760/2026) — marcos selecionados para uso de campanha. Datas em
// horário de Brasília; "fim" presente quando o marco é um período.
export type MarcoEleitoral = {
  inicio: string; // ISO yyyy-mm-dd
  fim?: string;
  titulo: string;
  descricao: string;
};

export const CALENDARIO_2026: MarcoEleitoral[] = [
  {
    inicio: "2026-03-05",
    fim: "2026-04-03",
    titulo: "Janela partidária",
    descricao: "Deputados federais e estaduais puderam trocar de partido sem perder o mandato.",
  },
  {
    inicio: "2026-04-04",
    titulo: "Filiação, domicílio e desincompatibilização",
    descricao:
      "Prazo final para filiação partidária deferida, domicílio eleitoral na circunscrição e desincompatibilização de presidente, governadores e prefeitos.",
  },
  {
    inicio: "2026-05-06",
    titulo: "Título e transferência",
    descricao: "Último dia para requerer título, transferência de local de votação e revisão cadastral.",
  },
  {
    inicio: "2026-05-15",
    titulo: "Financiamento coletivo",
    descricao: "Pré-candidatos podem iniciar campanhas de financiamento coletivo (crowdfunding).",
  },
  {
    inicio: "2026-06-16",
    titulo: "Fundo Eleitoral",
    descricao: "Data-limite para divulgação do montante do Fundo Especial de Financiamento de Campanha.",
  },
  {
    inicio: "2026-07-04",
    titulo: "Vedações a agentes públicos",
    descricao:
      "Começam as proibições de condutas de agentes públicos: nomeações, contratações, inaugurações com candidatos.",
  },
  {
    inicio: "2026-07-20",
    fim: "2026-08-05",
    titulo: "Convenções partidárias",
    descricao: "Partidos e federações escolhem candidatos e deliberam coligações majoritárias.",
  },
  {
    inicio: "2026-08-15",
    titulo: "Registro de candidaturas",
    descricao: "Prazo final para os partidos apresentarem o registro de candidaturas à Justiça Eleitoral.",
  },
  {
    inicio: "2026-08-16",
    titulo: "Início da propaganda eleitoral",
    descricao: "Liberada a propaganda nas ruas e na internet.",
  },
  {
    inicio: "2026-08-28",
    fim: "2026-10-01",
    titulo: "Horário eleitoral gratuito (1º turno)",
    descricao: "Propaganda gratuita no rádio e na televisão.",
  },
  {
    inicio: "2026-10-04",
    titulo: "1º TURNO",
    descricao: "Votação das 8h às 17h (horário de Brasília).",
  },
  {
    inicio: "2026-10-25",
    titulo: "2º turno (se houver)",
    descricao: "Para presidente e governadores, quando nenhum candidato atingir maioria absoluta.",
  },
  {
    inicio: "2026-12-03",
    titulo: "Justificativa do 1º turno",
    descricao: "Prazo para quem não votou justificar a ausência no 1º turno.",
  },
  {
    inicio: "2026-12-18",
    titulo: "Diplomação dos eleitos",
    descricao: "Justiça Eleitoral diploma os eleitos, habilitando a posse em janeiro de 2027.",
  },
];

export type StatusMarco = "passado" | "emCurso" | "proximo" | "futuro";

export function classificarMarcos(hoje = new Date()) {
  const ref = hoje.toISOString().slice(0, 10);
  let proximoMarcado = false;
  return CALENDARIO_2026.map((m) => {
    const fim = m.fim ?? m.inicio;
    let status: StatusMarco;
    if (fim < ref) {
      status = "passado";
    } else if (m.inicio <= ref && ref <= fim) {
      status = "emCurso";
    } else if (!proximoMarcado) {
      status = "proximo";
      proximoMarcado = true;
    } else {
      status = "futuro";
    }
    return { ...m, status };
  });
}
