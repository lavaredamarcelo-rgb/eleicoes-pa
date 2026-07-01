import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getMunicipio } from "@/lib/data";

type Municipio = NonNullable<Awaited<ReturnType<typeof getMunicipio>>>;

export function BoletimMunicipio({ municipio }: { municipio: Municipio }) {
  const totalVotos = municipio.resultados.reduce((sum, r) => sum + r.votos, 0);

  const porCargo = new Map<string, { nome: string; resultados: typeof municipio.resultados }>();
  for (const r of municipio.resultados) {
    const atual = porCargo.get(r.candidato.cargo.id);
    if (atual) atual.resultados.push(r);
    else porCargo.set(r.candidato.cargo.id, { nome: r.candidato.cargo.nome, resultados: [r] });
  }

  return (
    <ReportShell title={`Boletim do município — ${municipio.nome}`} subtitle={municipio.regiao.nome}>
      <View style={styles.statsRow}>
        <StatBox label="Votos apurados" value={totalVotos.toLocaleString("pt-BR")} />
        <StatBox label="Disputas" value={String(porCargo.size)} />
        <StatBox label="Candidatos com votos" value={String(municipio.resultados.length)} />
      </View>

      {Array.from(porCargo.values()).map((grupo) => (
        <View key={grupo.nome} wrap={false}>
          <SectionTitle>{grupo.nome}</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Candidato", "Número", "Partido", "Votos"]} />
            {grupo.resultados.map((r) => (
              <TableRow
                key={r.id}
                cells={[
                  r.candidato.nome,
                  String(r.candidato.numero),
                  r.candidato.partido.sigla,
                  r.votos.toLocaleString("pt-BR"),
                ]}
              />
            ))}
          </View>
        </View>
      ))}

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Dados de demonstração. Substituir por importação oficial do TSE antes de uso real.
      </Text>
    </ReportShell>
  );
}
