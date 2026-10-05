import { Text, View, Svg, Rect, Text as SvgText } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getCandidato, getCandidaturasAnteriores } from "@/lib/data";
import { CabecalhoBairro, ListaLocaisDuasColunas } from "./LocaisCompactos";

type Candidato = NonNullable<Awaited<ReturnType<typeof getCandidato>>>;
type Anterior = Awaited<ReturnType<typeof getCandidaturasAnteriores>>[number];

const f = (n: number) => n.toLocaleString("pt-BR");

// Dossiê completo do político: candidatura atual (votos por região e
// município), trajetória eleitoral inteira com gráfico de evolução,
// filiações vistas pelas urnas e trocas de partido registradas.
export function BoletimCandidato({
  candidato,
  anteriores = [],
  locais = [],
}: {
  candidato: Candidato;
  anteriores?: Anterior[];
  locais?: { nome: string; municipio: string; bairro?: string | null; votos: number }[];
}) {
  const totalVotos = candidato.resultados.reduce((sum, r) => sum + r.votos, 0);

  const votosPorRegiao = new Map<string, number>();
  for (const r of candidato.resultados) {
    const nome = r.municipio.regiao.nome;
    votosPorRegiao.set(nome, (votosPorRegiao.get(nome) ?? 0) + r.votos);
  }
  const regioesOrdenadas = Array.from(votosPorRegiao.entries()).sort((a, b) => b[1] - a[1]);

  // Trajetória completa (anteriores + atual), em ordem cronológica.
  const trajetoria = [
    ...anteriores.map((c) => ({
      ano: c.cargo.eleicao.ano,
      cargo: c.cargo.nome,
      municipio: c.cargo.municipio?.nome ?? "PA",
      sigla: c.partido.sigla,
      votos: c.totalVotos,
      eleito: c.eleito,
    })),
    {
      ano: candidato.cargo.eleicao.ano,
      cargo: candidato.cargo.nome,
      municipio: candidato.cargo.municipio?.nome ?? "PA",
      sigla: candidato.partido.sigla,
      votos: totalVotos,
      eleito: candidato.eleito,
    },
  ].sort((a, b) => a.ano - b.ano);

  const mandatos = trajetoria.filter((t) => t.eleito).length;

  // Filiações pelas urnas: partido de cada candidatura; troca = mudança
  // entre uma eleição e a seguinte.
  const trocasUrna: { ano: number; de: string; para: string }[] = [];
  for (let i = 1; i < trajetoria.length; i++) {
    if (trajetoria[i].sigla !== trajetoria[i - 1].sigla) {
      trocasUrna.push({ ano: trajetoria[i].ano, de: trajetoria[i - 1].sigla, para: trajetoria[i].sigla });
    }
  }

  // Gráfico de barras da evolução (SVG embutido no PDF).
  const W = 500, H = 150, PAD = 28;
  const maxVotos = Math.max(1, ...trajetoria.map((t) => t.votos));
  const slot = (W - PAD * 2) / trajetoria.length;
  const barW = Math.min(46, slot * 0.6);

  return (
    <ReportShell
      title={`Dossiê político — ${candidato.nome}`}
      subtitle={`${candidato.nomeCompleto ?? ""} · ${candidato.numero} · ${candidato.partido.sigla} · ${candidato.cargo.nome}${
        candidato.cargo.municipio ? ` (${candidato.cargo.municipio.nome})` : " (PA)"
      } · eleição de ${candidato.cargo.eleicao.ano}`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votos (eleição atual)" value={f(totalVotos)} />
        <StatBox label="Candidaturas" value={String(trajetoria.length)} />
        <StatBox label="Mandatos (eleito)" value={String(mandatos)} />
        <StatBox
          label="Vida pública desde"
          value={String(trajetoria[0]?.ano ?? candidato.cargo.eleicao.ano)}
        />
      </View>

      <SectionTitle>Trajetória eleitoral completa</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Ano", "Cargo", "Município", "Partido", "Votos", "Situação"]} />
        {trajetoria.map((t, i) => (
          <TableRow
            key={i}
            cells={[
              String(t.ano),
              t.cargo,
              t.municipio,
              t.sigla,
              f(t.votos),
              t.eleito ? "ELEITO" : "Não eleito",
            ]}
          />
        ))}
      </View>

      {trajetoria.length > 1 && (
        <View wrap={false}>
          <SectionTitle>Evolução da votação</SectionTitle>
          <Svg width={W} height={H}>
            {trajetoria.map((t, i) => {
              const h = Math.max(2, (t.votos / maxVotos) * (H - 50));
              const x = PAD + i * slot + (slot - barW) / 2;
              const y = H - 30 - h;
              return (
                <Rect
                  key={`b${i}`}
                  x={x}
                  y={y}
                  width={barW}
                  height={h}
                  fill={t.eleito ? "#d97706" : "#9ca3af"}
                />
              );
            })}
            {trajetoria.map((t, i) => {
              const x = PAD + i * slot + slot / 2;
              const h = Math.max(2, (t.votos / maxVotos) * (H - 50));
              return [
                <SvgText
                  key={`v${i}`}
                  x={x}
                  y={H - 34 - h}
                  style={{ fontSize: 7, fill: "#374151" }}
                  textAnchor="middle"
                >
                  {f(t.votos)}
                </SvgText>,
                <SvgText
                  key={`a${i}`}
                  x={x}
                  y={H - 16}
                  style={{ fontSize: 8, fill: "#111827" }}
                  textAnchor="middle"
                >
                  {`${t.ano}`}
                </SvgText>,
                <SvgText
                  key={`s${i}`}
                  x={x}
                  y={H - 6}
                  style={{ fontSize: 6, fill: "#6b7280" }}
                  textAnchor="middle"
                >
                  {t.cargo.length > 14 ? t.cargo.slice(0, 13) + "…" : t.cargo}
                </SvgText>,
              ];
            })}
          </Svg>
          <Text style={{ fontSize: 7, color: "#6b7280" }}>
            Barras laranja = eleito; cinza = não eleito. Votos do turno decisivo.
          </Text>
        </View>
      )}

      {trocasUrna.length > 0 && (
        <View>
          <SectionTitle>Filiações partidárias (histórico das urnas)</SectionTitle>
          <Text style={styles.paragraph}>
            {trajetoria.map((t) => `${t.sigla} (${t.ano})`).filter((v, i, a) => a.indexOf(v) === i).join("  →  ")}
          </Text>
          <View style={styles.table}>
            <TableHeader columns={["Quando", "Saiu de", "Foi para"]} />
            {trocasUrna.map((t, i) => (
              <TableRow key={i} cells={[`até a eleição de ${t.ano}`, t.de, t.para]} />
            ))}
          </View>
        </View>
      )}

      {candidato.trocasPartido.length > 0 && (
        <View>
          <SectionTitle>Trocas de partido registradas no sistema</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Data", "De", "Para", "Motivo"]} />
            {candidato.trocasPartido.map((t) => (
              <TableRow
                key={t.id}
                cells={[
                  new Date(t.data).toLocaleDateString("pt-BR"),
                  t.partidoOrigem.sigla,
                  t.partidoDestino.sigla,
                  t.motivo ?? "-",
                ]}
              />
            ))}
          </View>
        </View>
      )}

      <SectionTitle>{`Votos por região — eleição de ${candidato.cargo.eleicao.ano}`}</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Votos", "% do total"]} />
        {regioesOrdenadas.map(([nome, votos]) => (
          <TableRow
            key={nome}
            cells={[nome, f(votos), totalVotos > 0 ? `${((votos / totalVotos) * 100).toFixed(1)}%` : "0%"]}
          />
        ))}
      </View>

      <SectionTitle>Votos por município</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Região", "Votos"]} />
        {candidato.resultados.map((r) => (
          <TableRow
            key={r.id}
            cells={[r.municipio.nome, r.municipio.regiao.nome, f(r.votos)]}
          />
        ))}
      </View>

      {locais.length > 0 &&
        (() => {
          // COMPLETO (sem corte) e separado por localidade: município →
          // bairro (linha de subtotal) → escolas/colégios do bairro.
          const total = locais.reduce((s, l) => s + l.votos, 0);
          const porMun = new Map<string, typeof locais>();
          for (const l of locais) {
            const lista = porMun.get(l.municipio) ?? [];
            lista.push(l);
            porMun.set(l.municipio, lista);
          }
          const municipios = [...porMun.entries()]
            .map(([nome, lista]) => ({
              nome,
              totalMun: lista.reduce((s, l) => s + l.votos, 0),
              lista,
            }))
            .sort((a, b) => b.totalMun - a.totalMun);

          return (
            <View break>
              <SectionTitle>
                {`Votos por local de votação — por município e bairro (${locais.length} locais)`}
              </SectionTitle>
              {municipios.map((m) => {
                const porBairro = new Map<string, typeof m.lista>();
                for (const l of m.lista) {
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
                  <View key={m.nome} style={{ marginBottom: 6 }}>
                    <Text
                      style={{
                        fontSize: 9,
                        fontFamily: "Helvetica-Bold",
                        marginTop: 6,
                        marginBottom: 1,
                      }}
                    >
                      {`${m.nome} — ${f(m.totalMun)} votos (${
                        total > 0 ? ((m.totalMun / total) * 100).toFixed(1) : "0"
                      }% do total)`}
                    </Text>
                    {bairros.map((b) => (
                      <View key={b.bairro}>
                        <CabecalhoBairro
                          bairro={b.bairro}
                          votos={b.sub}
                          pct={
                            m.totalMun > 0
                              ? `${((b.sub / m.totalMun) * 100).toFixed(1)}%`
                              : undefined
                          }
                        />
                        <ListaLocaisDuasColunas itens={b.lista} />
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          );
        })()}
    </ReportShell>
  );
}
