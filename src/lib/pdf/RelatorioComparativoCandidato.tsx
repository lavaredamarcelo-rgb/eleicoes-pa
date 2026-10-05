import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

type Lado = {
  nome: string;
  ano: number;
  cargo: string;
  partido: string;
  eleito: boolean;
  total: number;
};
type Linha = { municipio: string; regiao: string; a: number; b: number; delta: number };

const fmt = (n: number) => n.toLocaleString("pt-BR");
const sinal = (n: number) => (n >= 0 ? `+${fmt(n)}` : fmt(n));

// Comparativo de um candidato consigo mesmo entre duas eleições:
// variação total e a votação município a município.
export function RelatorioComparativoCandidato({
  a,
  b,
  linhas,
}: {
  a: Lado;
  b: Lado;
  linhas: Linha[];
}) {
  const deltaTotal = b.total - a.total;
  const pct = a.total > 0 ? ((deltaTotal / a.total) * 100).toFixed(1) + "%" : "—";
  const cresceu = [...linhas].sort((x, y) => y.delta - x.delta).filter((l) => l.delta > 0);
  const caiu = [...linhas].sort((x, y) => x.delta - y.delta).filter((l) => l.delta < 0);

  const situacao = (l: Lado) => `${l.partido}${l.eleito ? " · ELEITO" : ""}`;

  return (
    <ReportShell
      title={`Comparativo — ${b.nome}`}
      subtitle={`${a.ano} (${a.cargo}, ${situacao(a)})  ×  ${b.ano} (${b.cargo}, ${situacao(b)})`}
    >
      <View style={styles.statsRow}>
        <StatBox label={`Votos em ${a.ano}`} value={fmt(a.total)} />
        <StatBox label={`Votos em ${b.ano}`} value={fmt(b.total)} />
        <StatBox label="Variação" value={sinal(deltaTotal)} />
        <StatBox label="Variação %" value={pct} />
      </View>

      <SectionTitle>Onde mais cresceu</SectionTitle>
      <TableHeader columns={["Município", "Região", String(a.ano), String(b.ano), "Variação"]} />
      {cresceu.slice(0, 15).map((l) => (
        <TableRow
          key={l.municipio}
          cells={[l.municipio, l.regiao, fmt(l.a), fmt(l.b), sinal(l.delta)]}
        />
      ))}
      {cresceu.length === 0 && <Text style={styles.tableCell}>Nenhum município em alta.</Text>}

      <SectionTitle>Onde mais caiu</SectionTitle>
      <TableHeader columns={["Município", "Região", String(a.ano), String(b.ano), "Variação"]} />
      {caiu.slice(0, 15).map((l) => (
        <TableRow
          key={l.municipio}
          cells={[l.municipio, l.regiao, fmt(l.a), fmt(l.b), sinal(l.delta)]}
        />
      ))}
      {caiu.length === 0 && <Text style={styles.tableCell}>Nenhum município em queda.</Text>}

      <SectionTitle>Todos os municípios ({linhas.length})</SectionTitle>
      <TableHeader columns={["Município", "Região", String(a.ano), String(b.ano), "Variação"]} />
      {linhas.map((l) => (
        <TableRow
          key={l.municipio}
          cells={[l.municipio, l.regiao, fmt(l.a), fmt(l.b), sinal(l.delta)]}
        />
      ))}
    </ReportShell>
  );
}
