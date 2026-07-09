import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { ConteudoRelatorio } from "@/lib/relatorios";

// PDF do relatório gerado por IA: percorre o JSON estruturado (resumo,
// seções com parágrafos/destaques/tabelas e conclusão).
export function RelatorioIA({
  conteudo,
  tipoRotulo,
}: {
  conteudo: ConteudoRelatorio;
  tipoRotulo: string;
}) {
  return (
    <ReportShell title={conteudo.titulo} subtitle={tipoRotulo}>
      {conteudo.resumo ? (
        <View style={{ marginBottom: 10 }}>
          <Text style={[styles.paragraph, { fontFamily: "Helvetica-Bold" }]}>
            {conteudo.resumo}
          </Text>
        </View>
      ) : null}

      {conteudo.secoes.map((s, i) => (
        <View key={i} wrap>
          <SectionTitle>{s.titulo}</SectionTitle>
          {s.paragrafos?.map((p, j) => (
            <Text key={j} style={styles.paragraph}>
              {p}
            </Text>
          ))}
          {s.destaques?.map((d, j) => (
            <Text key={`d${j}`} style={styles.paragraph}>
              • {d}
            </Text>
          ))}
          {s.tabela && s.tabela.colunas?.length > 0 ? (
            <View style={{ marginTop: 4, marginBottom: 6 }}>
              <TableHeader columns={s.tabela.colunas} />
              {s.tabela.linhas.map((linha, j) => (
                <TableRow key={j} cells={linha} />
              ))}
            </View>
          ) : null}
        </View>
      ))}

      {conteudo.conclusao ? (
        <View wrap>
          <SectionTitle>Conclusão</SectionTitle>
          <Text style={styles.paragraph}>{conteudo.conclusao}</Text>
        </View>
      ) : null}

      <Text style={[styles.paragraph, { marginTop: 12, fontSize: 8, color: "#777777" }]}>
        Relatório gerado por inteligência artificial (Claude) a partir dos dados do sistema —
        confira números críticos antes de decisões importantes.
      </Text>
    </ReportShell>
  );
}
