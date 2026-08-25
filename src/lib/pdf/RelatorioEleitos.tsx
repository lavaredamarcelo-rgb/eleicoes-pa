import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getEleitosOficiais } from "@/lib/data";

type Grupos = Awaited<ReturnType<typeof getEleitosOficiais>>;

export function RelatorioEleitos({
  ano,
  grupos,
  local,
}: {
  ano: number;
  grupos: Grupos;
  local?: string;
}) {
  const total = grupos.reduce((s, g) => s + g.totalEleitos, 0);

  return (
    <ReportShell
      title={`Eleitos — ${ano}${local ? ` · ${local}` : ""}`}
      subtitle={`${local ?? "Pará"} · ${total} eleitos (situação oficial do TSE)${
        local ? " · cargos estaduais: eleitos com reduto no município" : ""
      }`}
    >
      {grupos.map((g) => (
        <View key={g.cargoNome}>
          <SectionTitle>
            {g.cargoNome} ({g.totalEleitos})
          </SectionTitle>
          {g.escopo === "estadual" ? (
            <View style={styles.table}>
              <TableHeader columns={["Candidato", "Nº", "Partido", "Votos"]} />
              {g.eleitos.map((e) => (
                <TableRow
                  key={e.id}
                  cells={[e.nome, String(e.numero), e.partidoSigla, e.votos.toLocaleString("pt-BR")]}
                />
              ))}
            </View>
          ) : (
            g.municipios.map((m) => (
              <View key={m.municipioId} wrap={false}>
                <Text style={styles.subtitle}>{m.municipioNome}</Text>
                <View style={styles.table}>
                  <TableHeader columns={["Candidato", "Nº", "Partido", "Votos"]} />
                  {m.eleitos.map((e) => (
                    <TableRow
                      key={e.id}
                      cells={[e.nome, String(e.numero), e.partidoSigla, e.votos.toLocaleString("pt-BR")]}
                    />
                  ))}
                </View>
              </View>
            ))
          )}
        </View>
      ))}
    </ReportShell>
  );
}
