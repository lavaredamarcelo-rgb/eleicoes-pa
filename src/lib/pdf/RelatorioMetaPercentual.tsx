import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getDistribuicaoCandidato } from "@/lib/data";

type Distribuicao = NonNullable<Awaited<ReturnType<typeof getDistribuicaoCandidato>>>;

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioMetaPercentual({
  distribuicao,
  pct,
}: {
  distribuicao: Distribuicao;
  pct: number; // assinado: +10 aumenta, -10 diminui
}) {
  const fator = Math.max(0, 1 + pct / 100);
  const linhas = distribuicao.municipios.map((m) => {
    const projetados = Math.round(m.votos * fator);
    return { ...m, projetados, diferenca: projetados - m.votos };
  });
  const totalProjetado = linhas.reduce((s, l) => s + l.projetados, 0);

  const porRegiao = new Map<string, { votos: number; projetados: number }>();
  for (const l of linhas) {
    const atual = porRegiao.get(l.regiaoNome) ?? { votos: 0, projetados: 0 };
    atual.votos += l.votos;
    atual.projetados += l.projetados;
    porRegiao.set(l.regiaoNome, atual);
  }
  const regioes = Array.from(porRegiao.entries())
    .map(([regiao, v]) => ({ regiao, ...v }))
    .sort((a, b) => b.projetados - a.projetados);

  return (
    <ReportShell
      title={`Projeção percentual — ${distribuicao.nome}`}
      subtitle={`${distribuicao.numero} · ${distribuicao.partidoSigla} · última candidatura: ${distribuicao.origem}`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votação anterior" value={f(distribuicao.total)} />
        <StatBox label="Variação aplicada" value={`${pct > 0 ? "+" : ""}${pct}% por município`} />
        <StatBox label="Projeção total" value={f(totalProjetado)} />
      </View>

      <Text style={styles.subtitle}>
        O percentual é aplicado sobre os votos reais da última eleição em cada município — os
        redutos são preservados na mesma proporção.
      </Text>

      <SectionTitle>Resumo por região</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Votos anteriores", "Projetados"]} />
        {regioes.map((r) => (
          <TableRow key={r.regiao} cells={[r.regiao, f(r.votos), f(r.projetados)]} />
        ))}
      </View>

      <SectionTitle>Projeção por município ({linhas.length})</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Região", "Anteriores", "Projetados", "Diferença"]} />
        {linhas.map((l) => (
          <TableRow
            key={l.municipioNome}
            cells={[
              l.municipioNome,
              l.regiaoNome,
              f(l.votos),
              f(l.projetados),
              `${l.diferenca > 0 ? "+" : ""}${f(l.diferenca)}`,
            ]}
          />
        ))}
      </View>
    </ReportShell>
  );
}
