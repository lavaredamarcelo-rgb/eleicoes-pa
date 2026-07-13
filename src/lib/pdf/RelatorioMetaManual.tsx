import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

export type ItemMetaManual = { municipio: string; regiao: string; votos: number };

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioMetaManual({ nome, itens }: { nome: string; itens: ItemMetaManual[] }) {
  const total = itens.reduce((s, i) => s + i.votos, 0);

  const porRegiao = new Map<string, number>();
  for (const i of itens) porRegiao.set(i.regiao, (porRegiao.get(i.regiao) ?? 0) + i.votos);
  const regioes = Array.from(porRegiao.entries())
    .map(([regiao, votos]) => ({ regiao, votos }))
    .sort((a, b) => b.votos - a.votos);

  const ordenados = [...itens].sort((a, b) => b.votos - a.votos);

  return (
    <ReportShell
      title={`Distribuição de votos — ${nome}`}
      subtitle="Cenário fictício alimentado manualmente no simulador de meta por município"
    >
      <View style={styles.statsRow}>
        <StatBox label="Total de votos" value={f(total)} />
        <StatBox label="Municípios alimentados" value={String(itens.length)} />
        <StatBox label="Regiões alcançadas" value={String(regioes.length)} />
      </View>

      <SectionTitle>Resumo por região</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Votos", "% do total"]} />
        {regioes.map((r) => (
          <TableRow
            key={r.regiao}
            cells={[
              r.regiao,
              f(r.votos),
              total > 0 ? `${((r.votos / total) * 100).toFixed(1)}%` : "—",
            ]}
          />
        ))}
      </View>

      <SectionTitle>Votos por município ({ordenados.length})</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Região", "Votos", "% do total"]} />
        {ordenados.map((i) => (
          <TableRow
            key={i.municipio}
            cells={[
              i.municipio,
              i.regiao,
              f(i.votos),
              total > 0 ? `${((i.votos / total) * 100).toFixed(1)}%` : "—",
            ]}
          />
        ))}
      </View>

      <Text style={styles.subtitle}>
        Distribuição hipotética montada à mão — não representa resultado oficial de eleição.
      </Text>
    </ReportShell>
  );
}
