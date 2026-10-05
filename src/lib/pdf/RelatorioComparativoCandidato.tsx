import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle } from "./ReportShell";
import { styles, CORES } from "./styles";

type Lado = {
  nome: string;
  ano: number;
  cargo: string;
  partido: string;
  eleito: boolean;
  total: number;
};
type Linha = { municipio: string; regiao: string; a: number; b: number; delta: number };

const VERDE = CORES.verde ?? "#047857";
const VERMELHO = "#b91c1c";

const fmt = (n: number) => n.toLocaleString("pt-BR");
const sinal = (n: number) => (n >= 0 ? `+${fmt(n)}` : fmt(n));
const corDelta = (n: number) => (n > 0 ? VERDE : n < 0 ? VERMELHO : CORES.cinzaClaro);
const seta = (_n: number) => ""; // Helvetica nao tem ▲▼

// Comparativo de um candidato consigo mesmo entre duas eleições —
// variação em VERDE (cresceu) e VERMELHO (caiu), como no sistema.
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
  const pct = a.total > 0 ? `${deltaTotal >= 0 ? "+" : ""}${((deltaTotal / a.total) * 100).toFixed(1)}%` : "—";
  const cresceu = [...linhas].sort((x, y) => y.delta - x.delta).filter((l) => l.delta > 0);
  const caiu = [...linhas].sort((x, y) => x.delta - y.delta).filter((l) => l.delta < 0);
  const situacao = (l: Lado) => `${l.partido}${l.eleito ? " · ELEITO" : ""}`;

  return (
    <ReportShell
      title={`Comparativo — ${b.nome}`}
      subtitle={`${a.ano} (${a.cargo}, ${situacao(a)})  ×  ${b.ano} (${b.cargo}, ${situacao(b)})`}
    >
      {/* Placar de abertura */}
      <View style={styles.statsRow}>
        <Stat rotulo={`Votos em ${a.ano}`} valor={fmt(a.total)} />
        <Stat rotulo={`Votos em ${b.ano}`} valor={fmt(b.total)} />
        <Stat rotulo="Variação" valor={`${seta(deltaTotal)}${sinal(deltaTotal)}`} cor={corDelta(deltaTotal)} />
        <Stat rotulo="Variação %" valor={pct} cor={corDelta(deltaTotal)} />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: 2,
          marginBottom: 10,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <View style={{ flex: Math.max(cresceu.length, 1), backgroundColor: VERDE, padding: 3 }}>
          <Text style={{ fontSize: 7, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>
            {`CRESCEU em ${cresceu.length} municípios`}
          </Text>
        </View>
        <View style={{ flex: Math.max(caiu.length, 1), backgroundColor: VERMELHO, padding: 3 }}>
          <Text style={{ fontSize: 7, color: "#ffffff", fontFamily: "Helvetica-Bold" }}>
            {`CAIU em ${caiu.length}`}
          </Text>
        </View>
      </View>

      <SectionTitle>Onde mais cresceu</SectionTitle>
      <Cabecalho a={a.ano} b={b.ano} />
      {cresceu.slice(0, 15).map((l) => (
        <LinhaVar key={l.municipio} l={l} />
      ))}
      {cresceu.length === 0 && <Text style={styles.tableCell}>Nenhum município em alta.</Text>}

      <SectionTitle>Onde mais caiu</SectionTitle>
      <Cabecalho a={a.ano} b={b.ano} />
      {caiu.slice(0, 15).map((l) => (
        <LinhaVar key={l.municipio} l={l} />
      ))}
      {caiu.length === 0 && <Text style={styles.tableCell}>Nenhum município em queda.</Text>}

      <View break>
        <SectionTitle>{`Todos os municípios (${linhas.length})`}</SectionTitle>
        <Cabecalho a={a.ano} b={b.ano} />
        {linhas.map((l) => (
          <LinhaVar key={l.municipio} l={l} />
        ))}
      </View>
    </ReportShell>
  );
}

function Stat({ rotulo, valor, cor }: { rotulo: string; valor: string; cor?: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, cor ? { color: cor } : {}]}>{valor}</Text>
      <Text style={styles.statLabel}>{rotulo}</Text>
    </View>
  );
}

const FLEX = [2, 1.4, 1, 1, 1.1];

function Cabecalho({ a, b }: { a: number; b: number }) {
  const cols = ["Município", "Região", String(a), String(b), "Variação"];
  return (
    <View style={styles.tableHeaderRow}>
      {cols.map((c, i) => (
        <Text key={i} style={[styles.tableHeaderCell, { flex: FLEX[i] }]}>
          {c}
        </Text>
      ))}
    </View>
  );
}

function LinhaVar({ l }: { l: Linha }) {
  const cells = [l.municipio, l.regiao, fmt(l.a), fmt(l.b)];
  return (
    <View style={styles.tableRow}>
      {cells.map((c, i) => (
        <Text key={i} style={[styles.tableCell, { flex: FLEX[i] }]}>
          {c}
        </Text>
      ))}
      <Text
        style={[
          styles.tableCell,
          { flex: FLEX[4], color: corDelta(l.delta), fontFamily: "Helvetica-Bold" },
        ]}
      >
        {`${seta(l.delta)}${sinal(l.delta)}`}
      </Text>
    </View>
  );
}
