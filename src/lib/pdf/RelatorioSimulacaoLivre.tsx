import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, StatBox, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

// Relatório genérico para os simuladores da aba Quociente e Simulações:
// o cliente manda o resultado já calculado (stats + tabelas + observações)
// e o servidor só diagrama — sem duplicar a matemática de cada simulador.
export type PayloadSimulacaoLivre = {
  titulo: string;
  subtitulo?: string;
  stats?: { rotulo: string; valor: string }[];
  secoes?: { titulo?: string; colunas: string[]; linhas: string[][] }[];
  observacoes?: string[];
};

export function RelatorioSimulacaoLivre({ payload }: { payload: PayloadSimulacaoLivre }) {
  return (
    <ReportShell title={payload.titulo} subtitle={payload.subtitulo}>
      {payload.stats && payload.stats.length > 0 && (
        <View style={styles.statsRow}>
          {payload.stats.slice(0, 4).map((s, i) => (
            <StatBox key={i} label={s.rotulo} value={s.valor} />
          ))}
        </View>
      )}

      {(payload.secoes ?? []).map((secao, i) => (
        <View key={i}>
          {secao.titulo && <SectionTitle>{secao.titulo}</SectionTitle>}
          <View style={styles.table}>
            <TableHeader columns={secao.colunas} />
            {secao.linhas.map((linha, j) => (
              <TableRow key={j} cells={linha} />
            ))}
          </View>
        </View>
      ))}

      {payload.observacoes && payload.observacoes.length > 0 && (
        <View>
          <SectionTitle>Observações</SectionTitle>
          {payload.observacoes.map((o, i) => (
            <Text key={i} style={styles.paragraph}>
              • {o}
            </Text>
          ))}
        </View>
      )}
    </ReportShell>
  );
}
