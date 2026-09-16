import { Text, View } from "@react-pdf/renderer";
import type { calcularQuocienteProjetado, cenarioComAprovados } from "@/lib/eleitoral";
import { ReportShell, SectionTitle, StatBox, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";

type Proj = NonNullable<Awaited<ReturnType<typeof calcularQuocienteProjetado>>>;
type ComAprovados = Awaited<ReturnType<typeof cenarioComAprovados>>;

const f = (n: number) => n.toLocaleString("pt-BR");
const pct = (p: number) =>
  (p * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 }) + "%";

// PDF da tela "Quociente previsto" (ex.: Deputado Estadual 2026): as quatro
// estimativas de QE, o histórico de comparecimento, as vagas previstas por
// partido e o cenário com os aprovados nas convenções.
export function RelatorioQuocientePrevisto({
  proj,
  comAprovados,
}: {
  proj: Proj;
  comAprovados: ComAprovados;
}) {
  const estimativas: { nome: string; validos: number; qe: number }[] = [
    {
      nome: `1 · Votos válidos escalados pelo eleitorado (+${((proj.fator - 1) * 100).toLocaleString("pt-BR", { maximumFractionDigits: 1 })}%)`,
      validos: proj.estimativaEleitorado.validos,
      qe: proj.estimativaEleitorado.qe,
    },
    {
      nome: `2 · Comparecimento válido médio (${pct(proj.estimativaComparecimento.media)} dos aptos)`,
      validos: proj.estimativaComparecimento.validos,
      qe: proj.estimativaComparecimento.qe,
    },
    ...(proj.estimativaMaxima
      ? [
          {
            nome: `3 · TETO — comparecimento máximo histórico (${pct(proj.estimativaMaxima.proporcao)} em ${proj.estimativaMaxima.anoReferencia})`,
            validos: proj.estimativaMaxima.validos,
            qe: proj.estimativaMaxima.qe,
          },
        ]
      : []),
    ...(proj.estimativaMinima
      ? [
          {
            nome: `4 · PISO — comparecimento mínimo histórico (${pct(proj.estimativaMinima.proporcao)} em ${proj.estimativaMinima.anoReferencia})`,
            validos: proj.estimativaMinima.validos,
            qe: proj.estimativaMinima.qe,
          },
        ]
      : []),
  ];

  return (
    <ReportShell
      title={`Quociente previsto — ${proj.cargoNome} · ${proj.anoAlvo}`}
      subtitle={`${proj.municipioNome ?? "Pará (estadual)"} · projeção sobre a base real de ${proj.anoBase} · ${f(proj.aptosAlvo)} eleitores aptos ${proj.aptosOficiais ? "(oficial TSE)" : "(projetados)"} · ${proj.vagas} vagas`}
    >
      <View style={styles.statsRow}>
        <StatBox label="QE estimativa 1" value={f(proj.estimativaEleitorado.qe)} />
        <StatBox label="QE estimativa 2" value={f(proj.estimativaComparecimento.qe)} />
        {proj.estimativaMinima && (
          <StatBox label="Piso (mín. histórico)" value={f(proj.estimativaMinima.qe)} />
        )}
        {proj.estimativaMaxima && (
          <StatBox label="Teto (máx. histórico)" value={f(proj.estimativaMaxima.qe)} />
        )}
      </View>

      <SectionTitle>Estimativas do quociente eleitoral</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Estimativa", "Votos válidos", "QE"]} />
        {estimativas.map((e, i) => (
          <TableRow key={i} cells={[e.nome, f(e.validos), f(e.qe)]} />
        ))}
      </View>

      {proj.estimativaComparecimento.historico.length > 0 && (
        <View>
          <SectionTitle>Comparecimento válido das eleições anteriores</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Ano", "Votos válidos", "Eleitores aptos", "% válido"]} />
            {proj.estimativaComparecimento.historico.map((h) => (
              <TableRow
                key={h.ano}
                cells={[String(h.ano), f(h.validos), f(h.aptos), pct(h.proporcao)]}
              />
            ))}
          </View>
        </View>
      )}

      <SectionTitle>
        {`Vagas previstas por partido (estimativa 1) — ${proj.vagas - proj.vagasSobras} diretas + ${proj.vagasSobras} por sobras`}
      </SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Votos proj.", "Diretas", "Sobras", "Total", "Faltam p/ +1"]} />
        {proj.partidos
          .filter((p) => p.votos > 0 || p.total > 0)
          .map((p) => (
            <TableRow
              key={p.sigla}
              cells={[p.sigla, f(p.votos), String(p.diretas), String(p.sobras), String(p.total), f(p.faltamProximaVaga)]}
            />
          ))}
      </View>

      {proj.rodadasSobras.length > 0 && (
        <View>
          <SectionTitle>Sobras rodada a rodada (maior média, art. 109)</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Rodada", "Partido", "Média"]} />
            {proj.rodadasSobras.map((r) => (
              <TableRow key={r.rodada} cells={[`${r.rodada}ª sobra`, r.sigla, f(r.media)]} />
            ))}
          </View>
        </View>
      )}

      {comAprovados.partidos && (
        <View break>
          <SectionTitle>
            {`Cenário 2 — com os aprovados nas convenções (QE ${f(comAprovados.qe)})`}
          </SectionTitle>
          <Text style={styles.paragraph}>
            Cada aprovado recebe um peso: a última votação nominal dele no banco, escalada pelo
            crescimento do eleitorado. Partidos com aprovados têm os votos recompostos como soma
            dos pesos + legenda projetada; os demais mantêm a projeção base.
          </Text>
          <View style={styles.table}>
            <TableHeader columns={["Partido", "Votos do cenário", "Vagas", "vs. base"]} />
            {comAprovados.partidos
              .filter((p) => p.total > 0 || p.comAprovados)
              .map((p) => (
                <TableRow
                  key={p.sigla}
                  cells={[
                    p.sigla + (p.comAprovados ? " (aprovados)" : ""),
                    f(p.votos),
                    String(p.total),
                    p.delta === 0 ? "—" : p.delta > 0 ? `+${p.delta}` : String(p.delta),
                  ]}
                />
              ))}
          </View>

          <SectionTitle>{`Pesos dos aprovados (${comAprovados.aprovados.length})`}</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Candidato", "Partido", "Base do peso", "Peso"]} />
            {comAprovados.aprovados.map((a, i) => (
              <TableRow
                key={i}
                cells={[a.nome, a.partidoSigla, a.base, a.peso > 0 ? f(a.peso) : "0"]}
              />
            ))}
          </View>
        </View>
      )}

      <SectionTitle>Observações</SectionTitle>
      {proj.estimativaMinima && proj.estimativaMaxima && (
        <Text style={styles.paragraph}>
          • Leitura prática: o quociente de {proj.anoAlvo} deve ficar entre{" "}
          {f(proj.estimativaMinima.qe)} (piso) e {f(proj.estimativaMaxima.qe)} (teto), com as
          estimativas 1 e 2 como cenários centrais.
        </Text>
      )}
      <Text style={styles.paragraph}>
        • Números hipotéticos, projetados sobre a base real de {proj.anoBase}: os votos de{" "}
        {proj.anoAlvo} dependerão dos candidatos e do comparecimento. Pesos individuais não
        capturam migração de votos, recursos de campanha nem puxadores novos.
      </Text>
    </ReportShell>
  );
}
