import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, StatBox, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

export type PartidoEleicaoPdf = {
  sigla: string;
  cadeiras: number;
  totalVotos: number;
  votosLegenda: number;
  candidatos: {
    nome: string;
    numero: number;
    votos: number;
    situacao: "eleito" | "suplente" | "sem-votos";
    ordemSuplencia: number | null;
  }[];
};

export function RelatorioEleicaoCompleta({
  titulo,
  rotulo,
  vagas,
  votosValidos,
  quociente,
  partidos,
}: {
  titulo: string;
  rotulo: string;
  vagas: number;
  votosValidos: number;
  quociente: number;
  partidos: PartidoEleicaoPdf[];
}) {
  return (
    <ReportShell title={titulo} subtitle={`${rotulo} · cenário simulado (Eleição Completa)`}>
      <View style={styles.statsRow}>
        <StatBox label="Votos válidos" value={votosValidos.toLocaleString("pt-BR")} />
        <StatBox label="Vagas" value={String(vagas)} />
        <StatBox label="Quociente eleitoral" value={quociente.toLocaleString("pt-BR")} />
      </View>

      <SectionTitle>Composição da casa</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Votos (c/ legenda)", "Legenda", "Cadeiras"]} />
        {partidos
          .filter((p) => p.totalVotos > 0)
          .map((p) => (
            <TableRow
              key={p.sigla}
              cells={[
                p.sigla,
                p.totalVotos.toLocaleString("pt-BR"),
                p.votosLegenda.toLocaleString("pt-BR"),
                String(p.cadeiras),
              ]}
            />
          ))}
      </View>

      {partidos
        .filter((p) => p.totalVotos > 0)
        .map((p) => (
          <View key={p.sigla} wrap={p.candidatos.length > 20}>
            <SectionTitle>
              {p.sigla} — {p.cadeiras} cadeira{p.cadeiras === 1 ? "" : "s"}
            </SectionTitle>
            <View style={styles.table}>
              <TableHeader columns={["Candidato", "Número", "Votos", "Situação"]} />
              {p.candidatos
                .filter((c) => c.votos > 0)
                .map((c) => (
                  <TableRow
                    key={c.numero}
                    cells={[
                      c.nome,
                      String(c.numero),
                      c.votos.toLocaleString("pt-BR"),
                      c.situacao === "eleito"
                        ? "Eleito"
                        : p.cadeiras > 0
                          ? `${c.ordemSuplencia}º suplente`
                          : "Não eleito",
                    ]}
                  />
                ))}
            </View>
          </View>
        ))}

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Cenário fictício gerado no Criar Cenário (Eleição Completa) com os candidatos
        registrados no TSE 2026 — distribuição ponderada pelo histórico real de cada
        candidato e pelas pesquisas cadastradas, com edição manual. Não é previsão.
      </Text>
    </ReportShell>
  );
}
