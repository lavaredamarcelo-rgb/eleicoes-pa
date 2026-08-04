import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

export type CenarioMajoritarioPayload = {
  rotulo: string;
  cargoNome: string;
  ano: number;
  anoBase: number;
  projetado: boolean;
  vagas: number;
  temSegundoTurno: boolean;
  linhas: { nome: string; partidoSigla: string; votos: number; observacao: string }[];
};

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioCenarioMajoritario({ c }: { c: CenarioMajoritarioPayload }) {
  const linhas = [...c.linhas].sort((a, b) => b.votos - a.votos);
  const total = linhas.reduce((s, l) => s + l.votos, 0);
  const pct = (v: number) =>
    total > 0 ? `${((v / total) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%` : "—";
  const lider = linhas[0];
  const pctLider = total > 0 && lider ? (lider.votos / total) * 100 : 0;
  const decideNoPrimeiro = !c.temSegundoTurno || pctLider > 50;

  const veredicto =
    c.vagas > 1
      ? `Eleitos (${c.vagas} vagas, maioria simples): ${linhas
          .slice(0, c.vagas)
          .map((l) => `${l.nome} (${l.partidoSigla})`)
          .join(" e ")}.`
      : decideNoPrimeiro
        ? `${lider?.nome} (${lider?.partidoSigla}) venceria${c.temSegundoTurno ? " no 1º turno" : ""}, com ${pct(lider?.votos ?? 0)} dos válidos.`
        : `2º turno entre ${linhas[0]?.nome} (${linhas[0]?.partidoSigla}) e ${linhas[1]?.nome} (${linhas[1]?.partidoSigla}) — líder com ${pct(linhas[0]?.votos ?? 0)}.`;

  return (
    <ReportShell
      title={`Cenário majoritário — ${c.cargoNome}`}
      subtitle={`${c.rotulo}${c.projetado ? ` · disputa projetada (base real: ${c.anoBase})` : ""}`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votos válidos do cenário" value={f(total)} />
        <StatBox label="Vagas" value={String(c.vagas)} />
        <StatBox label="Candidaturas" value={String(linhas.length)} />
      </View>

      <SectionTitle>Resultado do cenário</SectionTitle>
      <Text style={styles.subtitle}>{veredicto}</Text>

      <SectionTitle>Ranking ({linhas.length})</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["#", "Candidato", "Partido", "Votos", "%", "Observação"]} />
        {linhas.map((l, i) => (
          <TableRow
            key={`${l.nome}-${i}`}
            cells={[String(i + 1), l.nome, l.partidoSigla, f(l.votos), pct(l.votos), l.observacao || "—"]}
          />
        ))}
      </View>

      <Text style={styles.subtitle}>
        Cenário majoritário hipotético (votos do 1º turno{c.projetado ? `, base de ${c.anoBase} escalada pelo eleitorado de ${c.ano}` : ""}) — não representa resultado oficial e nada foi alterado nos dados do sistema.
      </Text>
    </ReportShell>
  );
}
