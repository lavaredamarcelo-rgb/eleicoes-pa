import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { CenarioCalculado } from "@/lib/cenario";

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioCenario({ calc }: { calc: CenarioCalculado }) {
  const abrangencia = calc.cargo.municipioNome ?? "PA";

  return (
    <ReportShell
      title={`Cenário simulado — ${calc.cargo.nome}`}
      subtitle={`${abrangencia} · ${calc.projetado ? `disputa projetada de ${calc.cargo.ano} (base real: ${calc.anoBase})` : `eleição de ${calc.cargo.ano}`} · ${calc.vagas} vagas${calc.vagas !== calc.cargo.vagasOficiais ? ` (oficial: ${calc.cargo.vagasOficiais})` : ""}`}
    >
      <View style={styles.statsRow}>
        <StatBox label="QE oficial" value={f(calc.qeOficial)} />
        <StatBox label="QE do cenário" value={f(calc.qeSimulado)} />
        <StatBox label="Votos válidos do cenário" value={f(calc.votosValidosSimulados)} />
      </View>

      <SectionTitle>Mudanças aplicadas ({calc.mudancas.length})</SectionTitle>
      {calc.mudancas.length > 0 ? (
        calc.mudancas.slice(0, 25).map((m, i) => (
          <Text key={i} style={styles.subtitle}>
            • {m}
          </Text>
        ))
      ) : (
        <Text style={styles.subtitle}>Nenhuma — cenário igual ao resultado oficial.</Text>
      )}

      <SectionTitle>Quadro da casa (hoje → cenário)</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Hoje", "Cenário", "Saldo"]} />
        {calc.quadroCasa.map((q) => (
          <TableRow
            key={q.sigla}
            cells={[
              q.sigla,
              String(q.antes),
              String(q.depois),
              q.delta === 0 ? "—" : q.delta > 0 ? `+${q.delta}` : String(q.delta),
            ]}
          />
        ))}
      </View>

      <SectionTitle>Eleitos no cenário</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Candidato", "Votos", "Observação"]} />
        {calc.eleitosPorPartido.flatMap((g) =>
          g.eleitos.map((c) => (
            <TableRow
              key={`${g.sigla}-${c.nome}`}
              cells={[
                g.sigla,
                c.nome,
                f(c.votos),
                [
                  c.ficticio ? "fictício" : null,
                  c.substituto ? "substituto" : null,
                  c.trocou ? "trocou de partido" : null,
                  !c.ficticio && c.entra ? "entra na casa" : null,
                ]
                  .filter(Boolean)
                  .join(", ") || "—",
              ]}
            />
          ))
        )}
      </View>

      {calc.quemSai.length > 0 && (
        <>
          <SectionTitle>Quem sai da casa ({calc.quemSai.length})</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Candidato", "Partido", "Nova situação"]} />
            {calc.quemSai.map((c) => (
              <TableRow key={c.nome} cells={[c.nome, c.sigla, `${c.ordemSuplencia}º suplente`]} />
            ))}
          </View>
        </>
      )}

      {calc.temGeneroInformado && (
        <>
          <SectionTitle>Quota de gênero (art. 10, §3º, Lei 9.504/97)</SectionTitle>
          <Text style={styles.subtitle}>
            Mínimo de 30% e máximo de 70% das candidaturas por gênero (fração arredonda para cima
            no mínimo). Limite de registro: 150% das vagas em disputa.
          </Text>
          <View style={styles.table}>
            <TableHeader
              columns={["Partido", "Cand.", "Fem.", "Masc.", "A definir", "Mín.", "Situação"]}
            />
            {calc.quotaPorPartido
              .filter((q) => q.feminino + q.masculino > 0)
              .map((q) => (
                <TableRow
                  key={q.sigla}
                  cells={[
                    q.sigla,
                    String(q.total),
                    String(q.feminino),
                    String(q.masculino),
                    String(q.semGenero),
                    String(q.minimoPorGenero),
                    q.semGenero > 0 ? "Incompleto" : q.atendeQuota ? "Atende" : "NÃO atende",
                  ]}
                />
              ))}
          </View>
        </>
      )}

      <Text style={styles.subtitle}>
        Projeção hipotética gerada pelo simulador de cenários — não representa resultado oficial e
        nada foi alterado nos dados do sistema.
      </Text>
    </ReportShell>
  );
}
