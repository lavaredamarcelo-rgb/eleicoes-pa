import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import { MapaParaPdf } from "./MapaParaPdf";

// Mapa de VENCEDORES em PDF: cada município com a cor de quem foi o
// mais votado do cargo + ranking de municípios conquistados.
const PALETA = [
  "#d97706", "#0284c7", "#059669", "#dc2626", "#7c3aed", "#ea580c",
  "#db2777", "#ca8a04", "#0d9488", "#9333ea", "#2563eb", "#65a30d",
];
const OUTROS = "#9ca3af";
const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioVencedores({
  cargo,
  ano,
  porMunicipio,
  ranking,
}: {
  cargo: string;
  ano: number;
  porMunicipio: {
    municipio: string;
    codigoIbge: string | null;
    melhor: { nome: string; partido: string; votos: number };
    segundo: { nome: string; votos: number } | null;
  }[];
  ranking: { nome: string; partido: string; municipios: number; votosNosVencidos: number }[];
}) {
  const corDoVencedor = new Map<string, string>();
  ranking.forEach((r, i) => corDoVencedor.set(r.nome, i < PALETA.length ? PALETA[i] : OUTROS));

  return (
    <ReportShell
      title={`Vencedores por município — ${cargo} ${ano}`}
      subtitle="O mais votado em cada cidade e o ranking de municípios conquistados"
    >
      <View style={styles.statsRow}>
        <StatBox label="Municípios apurados" value={String(porMunicipio.length)} />
        <StatBox label="Candidatos que venceram em algum" value={String(ranking.length)} />
        <StatBox
          label="Líder do ranking"
          value={ranking[0] ? `${ranking[0].nome.slice(0, 18)} (${ranking[0].municipios})` : "—"}
        />
      </View>

      <MapaParaPdf
        altura={300}
        cores={Object.fromEntries(
          porMunicipio
            .filter((m) => m.codigoIbge)
            .map((m) => [m.codigoIbge!, corDoVencedor.get(m.melhor.nome) ?? OUTROS])
        )}
        legenda={ranking.slice(0, 6).map((r, i) => ({
          cor: PALETA[i],
          rotulo: `${r.nome.slice(0, 20)} (${r.municipios})`,
        }))}
      />

      <SectionTitle>Ranking — municípios conquistados</SectionTitle>
      <TableHeader columns={["Candidato", "Partido", "Municípios", "Votos onde venceu"]} />
      {ranking.map((r) => (
        <TableRow
          key={r.nome}
          cells={[r.nome, r.partido, String(r.municipios), f(r.votosNosVencidos)]}
        />
      ))}

      <View break>
        <SectionTitle>{`Município a município (${porMunicipio.length})`}</SectionTitle>
        <TableHeader columns={["Município", "Vencedor", "Votos", "2º colocado"]} />
        {[...porMunicipio]
          .sort((x, y) => x.municipio.localeCompare(y.municipio, "pt-BR"))
          .map((m) => (
            <TableRow
              key={m.municipio}
              cells={[
                m.municipio,
                `${m.melhor.nome} (${m.melhor.partido})`,
                f(m.melhor.votos),
                m.segundo ? `${m.segundo.nome} — ${f(m.segundo.votos)}` : "—",
              ]}
            />
          ))}
      </View>

      <Text style={{ fontSize: 7, color: "#9ca3af", marginTop: 4 }}>
        Do 13º vencedor em diante, os municípios aparecem em cinza no mapa.
      </Text>
    </ReportShell>
  );
}
