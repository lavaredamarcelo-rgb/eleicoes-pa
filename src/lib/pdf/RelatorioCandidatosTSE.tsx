import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

export type CandidatoTSEPdf = {
  cargo: string;
  nome: string;
  numero: number;
  partido: string;
  situacao: string;
};

const CARGOS_ORDEM = [
  "Governador",
  "Vice-Governador",
  "Senador",
  "Deputado Federal",
  "Deputado Estadual",
];

export function RelatorioCandidatosTSE({
  candidatos,
  cargoFiltro,
}: {
  candidatos: CandidatoTSEPdf[];
  cargoFiltro?: string;
}) {
  const cargos = cargoFiltro ? [cargoFiltro] : CARGOS_ORDEM;

  return (
    <ReportShell
      title={`Candidaturas TSE 2026${cargoFiltro ? ` — ${cargoFiltro}` : ""}`}
      subtitle={`Pará · ${candidatos.length} candidaturas registradas (DivulgaCand/TSE, 24/08/2026)`}
    >
      {cargos.map((cargo) => {
        const doCargo = candidatos.filter((c) => c.cargo === cargo);
        if (doCargo.length === 0) return null;

        const porPartido = new Map<string, CandidatoTSEPdf[]>();
        for (const c of doCargo) {
          const lista = porPartido.get(c.partido);
          if (lista) lista.push(c);
          else porPartido.set(c.partido, [c]);
        }
        const partidos = Array.from(porPartido.entries()).sort(
          (a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0], "pt-BR")
        );

        return (
          <View key={cargo}>
            <SectionTitle>
              {cargo} ({doCargo.length} candidaturas · {partidos.length} partidos)
            </SectionTitle>
            {partidos.map(([partido, lista]) => (
              <View key={partido} wrap={lista.length > 20}>
                <Text
                  style={{
                    fontSize: 9.5,
                    fontFamily: "Helvetica-Bold",
                    color: "#374151",
                    marginTop: 6,
                    marginBottom: 2,
                  }}
                >
                  {partido} ({lista.length})
                </Text>
                <View style={styles.table}>
                  <TableHeader columns={["Candidato", "Número", "Situação"]} />
                  {[...lista]
                    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
                    .map((c, i) => (
                      <TableRow
                        key={i}
                        cells={[c.nome, String(c.numero), c.situacao]}
                      />
                    ))}
                </View>
              </View>
            ))}
          </View>
        );
      })}
      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Senado: apenas titulares (suplentes não listados). Candidatos com situação
        diferente de &quot;Concorrendo&quot; foram substituídos ou indeferidos.
      </Text>
    </ReportShell>
  );
}
