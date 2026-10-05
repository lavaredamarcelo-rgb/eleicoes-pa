import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import { CabecalhoBairro, ListaLocaisDuasColunas } from "./LocaisCompactos";

type Local = { nome: string; bairro: string | null; votos: number };

const f = (n: number) => n.toLocaleString("pt-BR");

// Votos de UM candidato em UM município, separados por bairro e, dentro
// do bairro, escola a escola — completo.
export function RelatorioLocaisMunicipio({
  candidato,
  municipio,
  totalCandidato,
  locais,
}: {
  candidato: { nome: string; ano: number; cargo: string; partido: string };
  municipio: string;
  totalCandidato: number;
  locais: Local[];
}) {
  const totalMun = locais.reduce((s, l) => s + l.votos, 0);
  const porBairro = new Map<string, Local[]>();
  for (const l of locais) {
    const b = l.bairro?.trim() || "(bairro não informado)";
    const lista = porBairro.get(b) ?? [];
    lista.push(l);
    porBairro.set(b, lista);
  }
  const bairros = [...porBairro.entries()]
    .map(([bairro, lista]) => ({
      bairro,
      sub: lista.reduce((s, l) => s + l.votos, 0),
      lista: lista.sort((a, b) => b.votos - a.votos),
    }))
    .sort((a, b) => b.sub - a.sub);

  return (
    <ReportShell
      title={`${candidato.nome} em ${municipio}`}
      subtitle={`${candidato.cargo} ${candidato.ano} · ${candidato.partido} — votos por bairro e local de votação`}
    >
      <View style={styles.statsRow}>
        <StatBox label={`Votos em ${municipio}`} value={f(totalMun)} />
        <StatBox
          label="% do total do candidato"
          value={totalCandidato > 0 ? `${((totalMun / totalCandidato) * 100).toFixed(1)}%` : "—"}
        />
        <StatBox label="Bairros com votos" value={String(bairros.length)} />
        <StatBox label="Locais de votação" value={String(locais.length)} />
      </View>

      <SectionTitle>Resumo por bairro</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Bairro", "Votos", "% no município"]} />
        {bairros.map((b) => (
          <TableRow
            key={b.bairro}
            cells={[
              b.bairro.slice(0, 50),
              f(b.sub),
              totalMun > 0 ? `${((b.sub / totalMun) * 100).toFixed(1)}%` : "—",
            ]}
          />
        ))}
      </View>

      <SectionTitle>Local a local, por bairro (completo, em duas colunas)</SectionTitle>
      {bairros.map((b) => (
        <View key={b.bairro} style={{ marginBottom: 3 }}>
          <CabecalhoBairro
            bairro={b.bairro}
            votos={b.sub}
            pct={totalMun > 0 ? `${((b.sub / totalMun) * 100).toFixed(1)}%` : undefined}
          />
          <ListaLocaisDuasColunas itens={b.lista} />
        </View>
      ))}
    </ReportShell>
  );
}
