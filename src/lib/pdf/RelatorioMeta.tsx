import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getDistribuicaoMeta } from "@/lib/data";

type Distribuicao = NonNullable<Awaited<ReturnType<typeof getDistribuicaoMeta>>>;

export function RelatorioMeta({ distribuicao, meta }: { distribuicao: Distribuicao; meta: number }) {
  return (
    <ReportShell
      title={`Meta de campanha — ${distribuicao.nome}`}
      subtitle={`${distribuicao.numero} · ${distribuicao.partidoSigla} · última candidatura: ${distribuicao.origem}`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Meta de votos" value={meta.toLocaleString("pt-BR")} />
        <StatBox label="Votação anterior" value={distribuicao.totalAtual.toLocaleString("pt-BR")} />
        <StatBox
          label="Variação"
          value={
            distribuicao.totalAtual > 0
              ? `${(((meta - distribuicao.totalAtual) / distribuicao.totalAtual) * 100).toFixed(1)}%`
              : "—"
          }
        />
      </View>

      <Text style={styles.subtitle}>Base de distribuição: {distribuicao.descricaoBase}</Text>

      <SectionTitle>Distribuição por município ({distribuicao.municipios.length})</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Votos atuais", "Necessários", "A conquistar"]} />
        {distribuicao.municipios.map((m) => {
          const necessarios = Math.round(m.fracao * meta);
          const diferenca = necessarios - m.votosAtuais;
          return (
            <TableRow
              key={m.municipioNome}
              cells={[
                m.municipioNome,
                m.votosAtuais.toLocaleString("pt-BR"),
                necessarios.toLocaleString("pt-BR"),
                diferenca > 0 ? `+${diferenca.toLocaleString("pt-BR")}` : diferenca.toLocaleString("pt-BR"),
              ]}
            />
          );
        })}
      </View>
    </ReportShell>
  );
}
