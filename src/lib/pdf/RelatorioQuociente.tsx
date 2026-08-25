import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { calcularQuocienteEleitoral, calcularMajoritario } from "@/lib/eleitoral";

type Proporcional = NonNullable<Awaited<ReturnType<typeof calcularQuocienteEleitoral>>>;
type Majoritario = NonNullable<Awaited<ReturnType<typeof calcularMajoritario>>>;

export function RelatorioQuociente({ resultado }: { resultado: Proporcional }) {
  const municipioNome = resultado.cargo.municipio?.nome;

  return (
    <ReportShell
      title={`Quociente eleitoral — ${resultado.cargo.nome}`}
      subtitle={municipioNome ?? "Pará (estadual)"}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votos válidos" value={resultado.votosValidos.toLocaleString("pt-BR")} />
        <StatBox label="Vagas" value={String(resultado.cargo.vagas)} />
        <StatBox
          label="Quociente eleitoral"
          value={resultado.quocienteEleitoral.toLocaleString("pt-BR")}
        />
      </View>

      <SectionTitle>Quociente partidário</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Votos", "%", "Vagas"]} />
        {resultado.partidos.map((p) => (
          <TableRow
            key={p.partidoId}
            cells={[
              p.sigla,
              p.votos.toLocaleString("pt-BR"),
              `${p.percentual.toFixed(1)}%`,
              String(p.quocientePartidario),
            ]}
          />
        ))}
      </View>

      {[...resultado.partidos]
        .sort((a, b) => b.cadeirasOficiais - a.cadeirasOficiais || b.votos - a.votos)
        .map((p) => {
          const candidatosDoPartido = resultado.candidatosComSituacao.filter(
            (c) => c.partido.id === p.partidoId
          );
          if (candidatosDoPartido.length === 0) return null;
          const temCadeira = p.cadeirasOficiais > 0;
          return (
            <View key={p.partidoId} wrap={false}>
              <SectionTitle>
                {p.sigla} —{" "}
                {temCadeira
                  ? `${p.cadeirasOficiais} cadeira${p.cadeirasOficiais > 1 ? "s" : ""} (eleitos e suplentes)`
                  : "sem cadeira (não eleitos)"}
              </SectionTitle>
              <View style={styles.table}>
                <TableHeader columns={["Candidato", "Número", "Votos", "Situação"]} />
                {candidatosDoPartido.map((c) => (
                  <TableRow
                    key={c.id}
                    cells={[
                      c.nome,
                      String(c.numero),
                      c.votos.toLocaleString("pt-BR"),
                      c.situacao === "eleito"
                        ? "Eleito"
                        : temCadeira
                          ? `${c.ordemSuplencia}º suplente`
                          : "Não eleito",
                    ]}
                  />
                ))}
              </View>
            </View>
          );
        })}

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Cálculo conforme Lei 4.737/65, arts. 106-109 (quociente eleitoral, quociente partidário e
        distribuição das sobras pela maior média). Dados de demonstração.
      </Text>
    </ReportShell>
  );
}

export function RelatorioMajoritario({ resultado }: { resultado: Majoritario }) {
  const municipioNome = resultado.cargo.municipio?.nome;

  return (
    <ReportShell
      title={`Apuração majoritária — ${resultado.cargo.nome}`}
      subtitle={municipioNome ?? "Pará (estadual)"}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votos válidos" value={resultado.votosValidos.toLocaleString("pt-BR")} />
        <StatBox label="Líder" value={`${resultado.percentualLider.toFixed(1)}%`} />
      </View>

      {resultado.segundoTurnoProvavel && (
        <Text style={{ marginTop: 6, fontSize: 9, color: "#b45309" }}>
          Líder abaixo de 50%+1 dos votos válidos — pode indicar 2º turno.
        </Text>
      )}

      <SectionTitle>Resultado</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Posição", "Candidato", "Partido", "Votos"]} />
        {resultado.candidatos.map((c, i) => (
          <TableRow
            key={c.id}
            cells={[`${i + 1}º`, c.nome, c.partido.sigla, c.votos.toLocaleString("pt-BR")]}
          />
        ))}
      </View>

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Dados de demonstração. Substituir por importação oficial do TSE antes de uso real.
      </Text>
    </ReportShell>
  );
}
