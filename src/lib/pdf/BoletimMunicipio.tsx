import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getMunicipio } from "@/lib/data";

type Municipio = NonNullable<Awaited<ReturnType<typeof getMunicipio>>>;

const f = (n: number) => n.toLocaleString("pt-BR");
const TOP_POR_CARGO = 40;

// Boletim do município organizado POR ELEIÇÃO (ano) — antes somava todos
// os anos num número só (com o histórico 2000-2024 passava de 1 milhão) e
// misturava cargos de eleições diferentes sem rótulo.
export function BoletimMunicipio({ municipio }: { municipio: Municipio }) {
  // ano -> cargoId -> grupo
  const porAno = new Map<
    number,
    Map<string, { nome: string; resultados: Municipio["resultados"] }>
  >();
  for (const r of municipio.resultados) {
    const ano = r.candidato.cargo.eleicao.ano;
    let cargos = porAno.get(ano);
    if (!cargos) {
      cargos = new Map();
      porAno.set(ano, cargos);
    }
    const atual = cargos.get(r.candidato.cargo.id);
    if (atual) atual.resultados.push(r);
    else cargos.set(r.candidato.cargo.id, { nome: r.candidato.cargo.nome, resultados: [r] });
  }
  const anos = [...porAno.keys()].sort((a, b) => b - a);
  const anoRecente = anos[0];
  const cargosRecentes = anoRecente ? [...porAno.get(anoRecente)!.values()] : [];
  const votosRecentes = cargosRecentes.reduce(
    (s, g) => s + g.resultados.reduce((x, r) => x + r.votos, 0),
    0
  );

  return (
    <ReportShell
      title={`Boletim do município — ${municipio.nome}`}
      subtitle={`${municipio.regiao.nome}${municipio.eleitores ? ` · ${f(municipio.eleitores)} eleitores aptos (${municipio.anoEleitorado})` : ""}`}
    >
      <View style={styles.statsRow}>
        <StatBox label={`Votos em ${anoRecente ?? "—"}`} value={f(votosRecentes)} />
        <StatBox label={`Disputas em ${anoRecente ?? "—"}`} value={String(cargosRecentes.length)} />
        <StatBox label="Eleições no histórico" value={String(anos.length)} />
        {municipio.eleitores ? (
          <StatBox label={`Eleitores (${municipio.anoEleitorado})`} value={f(municipio.eleitores)} />
        ) : null}
      </View>

      <SectionTitle>Resumo por eleição</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Eleição", "Disputas", "Candidatos com votos", "Votos computados"]} />
        {anos.map((ano) => {
          const grupos = [...porAno.get(ano)!.values()];
          const cand = grupos.reduce((s, g) => s + g.resultados.length, 0);
          const votos = grupos.reduce(
            (s, g) => s + g.resultados.reduce((x, r) => x + r.votos, 0),
            0
          );
          return (
            <TableRow key={ano} cells={[String(ano), String(grupos.length), f(cand), f(votos)]} />
          );
        })}
      </View>

      {anos.map((ano) =>
        [...porAno.get(ano)!.values()]
          .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"))
          .map((grupo) => {
            const ordenados = [...grupo.resultados].sort((a, b) => b.votos - a.votos);
            const visiveis = ordenados.slice(0, TOP_POR_CARGO);
            const restantes = ordenados.length - visiveis.length;
            const votosRestantes = ordenados
              .slice(TOP_POR_CARGO)
              .reduce((s, r) => s + r.votos, 0);
            return (
              <View key={`${ano}-${grupo.nome}`}>
                <SectionTitle>{`${grupo.nome} · ${ano}`}</SectionTitle>
                <View style={styles.table}>
                  <TableHeader columns={["Candidato", "Número", "Partido", "Votos"]} />
                  {visiveis.map((r) => (
                    <TableRow
                      key={r.id}
                      cells={[
                        r.candidato.nome,
                        String(r.candidato.numero),
                        r.candidato.partido.sigla,
                        f(r.votos),
                      ]}
                    />
                  ))}
                </View>
                {restantes > 0 && (
                  <Text style={styles.tableCellMuted}>
                    + {restantes} candidatos com menos votos ({f(votosRestantes)} votos somados).
                  </Text>
                )}
              </View>
            );
          })
      )}
    </ReportShell>
  );
}
