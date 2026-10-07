import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle } from "./ReportShell";
import { styles } from "./styles";

// DUELO em PDF: dois candidatos lado a lado — âmbar (A) × azul (B),
// placar, disputa por região com barra proporcional e todos os
// municípios com a vantagem colorida pelo líder.
const AMBAR = "#b45309";
const AZUL = "#0369a1";

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

export function RelatorioDuelo({ a, b, linhas }: { a: Lado; b: Lado; linhas: Linha[] }) {
  const dif = a.total - b.total;
  const regioes = new Map<string, { a: number; b: number }>();
  for (const l of linhas) {
    const r = regioes.get(l.regiao) ?? { a: 0, b: 0 };
    r.a += l.a;
    r.b += l.b;
    regioes.set(l.regiao, r);
  }
  const porRegiao = [...regioes.entries()]
    .map(([regiao, v]) => ({ regiao, ...v }))
    .sort((x, y) => y.a + y.b - (x.a + x.b));
  const lideraA = linhas.filter((l) => l.a > l.b).length;
  const lideraB = linhas.filter((l) => l.b > l.a).length;
  const rot = (c: Lado) => `${c.cargo} ${c.ano} · ${c.partido}${c.eleito ? " · ELEITO" : ""}`;

  return (
    <ReportShell title={`Duelo — ${a.nome} × ${b.nome}`} subtitle={`${rot(a)}  contra  ${rot(b)}`}>
      {/* Placar */}
      <View style={styles.statsRow}>
        <Placar nome={a.nome} valor={fmt(a.total)} cor={AMBAR} />
        <Placar nome={b.nome} valor={fmt(b.total)} cor={AZUL} />
        <Placar
          nome={`vantagem de ${dif >= 0 ? a.nome : b.nome}`}
          valor={fmt(Math.abs(dif))}
          cor={dif >= 0 ? AMBAR : AZUL}
        />
      </View>
      <View style={{ flexDirection: "row", marginTop: 2, marginBottom: 10, borderRadius: 3, overflow: "hidden" }}>
        <View style={{ flex: Math.max(lideraA, 1), backgroundColor: AMBAR, padding: 3 }}>
          <Text style={{ fontSize: 7, color: "#fff", fontFamily: "Helvetica-Bold" }}>
            {`${a.nome} lidera em ${lideraA} municípios`}
          </Text>
        </View>
        <View style={{ flex: Math.max(lideraB, 1), backgroundColor: AZUL, padding: 3 }}>
          <Text style={{ fontSize: 7, color: "#fff", fontFamily: "Helvetica-Bold" }}>
            {`${b.nome} em ${lideraB}`}
          </Text>
        </View>
      </View>

      <SectionTitle>Disputa por região</SectionTitle>
      {porRegiao.map((r) => {
        const total = r.a + r.b;
        const pctA = total > 0 ? (r.a / total) * 100 : 50;
        return (
          <View key={r.regiao} style={{ marginBottom: 5 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 8, fontFamily: "Helvetica-Bold" }}>{r.regiao}</Text>
              <Text style={{ fontSize: 8 }}>
                <Text style={{ color: AMBAR, fontFamily: "Helvetica-Bold" }}>{fmt(r.a)}</Text>
                <Text>  ×  </Text>
                <Text style={{ color: AZUL, fontFamily: "Helvetica-Bold" }}>{fmt(r.b)}</Text>
              </Text>
            </View>
            <View style={{ flexDirection: "row", height: 5, borderRadius: 2, overflow: "hidden", marginTop: 1.5 }}>
              <View style={{ width: `${pctA}%`, backgroundColor: AMBAR }} />
              <View style={{ width: `${100 - pctA}%`, backgroundColor: AZUL }} />
            </View>
          </View>
        );
      })}

      <View break>
        <SectionTitle>{`Município a município (${linhas.length})`}</SectionTitle>
        <View style={styles.tableHeaderRow}>
          {["Município", "Região", a.nome.slice(0, 16), b.nome.slice(0, 16), "Vantagem"].map((c, i) => (
            <Text key={i} style={[styles.tableHeaderCell, { flex: FLEX[i] }]}>
              {c}
            </Text>
          ))}
        </View>
        {linhas.map((l) => (
          <View key={l.municipio} style={styles.tableRow}>
            <Text style={[styles.tableCell, { flex: FLEX[0] }]}>{l.municipio}</Text>
            <Text style={[styles.tableCell, { flex: FLEX[1] }]}>{l.regiao}</Text>
            <Text style={[styles.tableCell, { flex: FLEX[2], color: AMBAR }]}>{fmt(l.a)}</Text>
            <Text style={[styles.tableCell, { flex: FLEX[3], color: AZUL }]}>{fmt(l.b)}</Text>
            <Text
              style={[
                styles.tableCell,
                {
                  flex: FLEX[4],
                  color: l.a - l.b >= 0 ? AMBAR : AZUL,
                  fontFamily: "Helvetica-Bold",
                },
              ]}
            >
              {`${l.a - l.b >= 0 ? "+" : ""}${fmt(l.a - l.b)}`}
            </Text>
          </View>
        ))}
      </View>
    </ReportShell>
  );
}

const FLEX = [1.8, 1.4, 1, 1, 1];

function Placar({ nome, valor, cor }: { nome: string; valor: string; cor: string }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statValue, { color: cor }]}>{valor}</Text>
      <Text style={styles.statLabel}>{nome}</Text>
    </View>
  );
}
