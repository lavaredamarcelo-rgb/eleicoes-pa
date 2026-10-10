import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle } from "./ReportShell";
import { styles, CORES } from "./styles";
import { CabecalhoBairro, ListaLocaisDuasColunas } from "./LocaisCompactos";

// TODOS os eleitos com os votos deles em UM município, com o detalhamento
// dos locais de votação: por bairro sempre; escola a escola quando o
// volume do município permite (municípios menores saem completos).
type EleitoLinha = {
  nome: string;
  partido: string;
  votosMun: number;
  totalEstado: number;
  bairros: { nome: string; votos: number }[];
  locais?: { nome: string; bairro: string | null; votos: number }[];
};

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioEleitosLocais({
  municipio,
  ano,
  cargos,
  incluiEscolas,
}: {
  municipio: string;
  ano: number;
  cargos: { cargo: string; eleitos: EleitoLinha[] }[];
  incluiEscolas: boolean;
}) {
  const totalEleitos = cargos.reduce((s, c) => s + c.eleitos.length, 0);
  const totalVotos = cargos.reduce(
    (s, c) => s + c.eleitos.reduce((x, e) => x + e.votosMun, 0),
    0
  );

  return (
    <ReportShell
      title={`Eleitos ${ano} em ${municipio}`}
      subtitle={`Votação de todos os eleitos no município, com locais de votação ${
        incluiEscolas ? "(bairro a bairro e escola a escola)" : "(bairro a bairro)"
      }`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Eleitos com votos aqui" value={String(totalEleitos)} />
        <StatBox label={`Votos de eleitos em ${municipio}`} value={f(totalVotos)} />
        <StatBox label="Detalhamento" value={incluiEscolas ? "Bairro + escola" : "Por bairro"} />
      </View>

      {cargos.map((c) => (
        <View key={c.cargo} break={c.cargo !== cargos[0].cargo}>
          <SectionTitle>{`${c.cargo} — ${c.eleitos.length} eleito${
            c.eleitos.length === 1 ? "" : "s"
          }`}</SectionTitle>
          {c.eleitos.map((e) => (
            <View key={e.nome} style={{ marginBottom: 7 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  backgroundColor: "#f3f4f6",
                  paddingVertical: 2.5,
                  paddingHorizontal: 4,
                  marginTop: 4,
                }}
              >
                <Text style={{ fontSize: 8.5, fontFamily: "Helvetica-Bold" }}>
                  {`${e.nome} (${e.partido})`}
                </Text>
                <Text style={{ fontSize: 8.5 }}>
                  <Text style={{ fontFamily: "Helvetica-Bold", color: CORES.ambar }}>
                    {f(e.votosMun)}
                  </Text>
                  <Text>
                    {` votos aqui · ${
                      e.totalEstado > 0
                        ? ((e.votosMun / e.totalEstado) * 100).toFixed(1)
                        : "0"
                    }% do total dele`}
                  </Text>
                </Text>
              </View>

              {!incluiEscolas && (
                <ListaLocaisDuasColunas
                  itens={e.bairros.map((b) => ({ nome: b.nome, votos: b.votos }))}
                />
              )}

              {incluiEscolas &&
                e.bairros.map((b) => {
                  const escolas = (e.locais ?? []).filter(
                    (l) => (l.bairro?.trim() || "(bairro não informado)") === b.nome
                  );
                  return (
                    <View key={b.nome}>
                      <CabecalhoBairro bairro={b.nome} votos={b.votos} />
                      <ListaLocaisDuasColunas itens={escolas} />
                    </View>
                  );
                })}
            </View>
          ))}
        </View>
      ))}

      {!incluiEscolas && (
        <Text style={{ fontSize: 7, color: CORES.cinzaClaro, marginTop: 6 }}>
          Município com grande volume de urnas: o detalhamento acima é por bairro. O escola a
          escola de cada eleito sai no PDF individual, na ficha do candidato (Votos por bairro →
          PDF do município).
        </Text>
      )}
    </ReportShell>
  );
}
