import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { EstudoViabilidadeCalculado } from "@/lib/cenario";

export type ItemMetaManual = { municipio: string; regiao: string; votos: number };

const f = (n: number) => n.toLocaleString("pt-BR");

export function RelatorioMetaManual({
  nome,
  itens,
  estudo,
}: {
  nome: string;
  itens: ItemMetaManual[];
  estudo?: EstudoViabilidadeCalculado | null;
}) {
  const total = itens.reduce((s, i) => s + i.votos, 0);

  const porRegiao = new Map<string, number>();
  for (const i of itens) porRegiao.set(i.regiao, (porRegiao.get(i.regiao) ?? 0) + i.votos);
  const regioes = Array.from(porRegiao.entries())
    .map(([regiao, votos]) => ({ regiao, votos }))
    .sort((a, b) => b.votos - a.votos);

  const ordenados = [...itens].sort((a, b) => b.votos - a.votos);

  return (
    <ReportShell
      title={`Distribuição de votos — ${nome}`}
      subtitle="Cenário fictício alimentado manualmente no simulador de meta por município"
    >
      <View style={styles.statsRow}>
        <StatBox label="Total de votos" value={f(total)} />
        <StatBox label="Municípios alimentados" value={String(itens.length)} />
        <StatBox label="Regiões alcançadas" value={String(regioes.length)} />
      </View>

      <SectionTitle>Resumo por região</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Votos", "% do total"]} />
        {regioes.map((r) => (
          <TableRow
            key={r.regiao}
            cells={[
              r.regiao,
              f(r.votos),
              total > 0 ? `${((r.votos / total) * 100).toFixed(1)}%` : "—",
            ]}
          />
        ))}
      </View>

      <SectionTitle>Votos por município ({ordenados.length})</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Região", "Votos", "% do total"]} />
        {ordenados.map((i) => (
          <TableRow
            key={i.municipio}
            cells={[
              i.municipio,
              i.regiao,
              f(i.votos),
              total > 0 ? `${((i.votos / total) * 100).toFixed(1)}%` : "—",
            ]}
          />
        ))}
      </View>

      {estudo && (
        <>
          <SectionTitle>Estudo de viabilidade — PROJEÇÃO FICTÍCIA</SectionTitle>
          <Text style={styles.subtitle}>
            Observação hipotética sobre a disputa base ({estudo.rotulo}): inserindo {nome} pelo{" "}
            {estudo.sigla} com {f(total)} votos,{" "}
            {estudo.eleito
              ? "o pretenso candidato SERIA ELEITO neste cenário"
              : `ficaria como ${estudo.ordemSuplencia}º suplente neste cenário`}
            . O partido ficaria com {estudo.cadeirasPartido} cadeira(s) e o quociente eleitoral do
            cenário seria {f(estudo.qeSimulado)}.
          </Text>
          <View style={styles.table}>
            <TableHeader columns={["Eleição", "QE", "Linha de corte", `Com ${f(total)} votos`]} />
            {estudo.linhas.map((l) => (
              <TableRow key={l.rotulo} cells={[l.rotulo, f(l.qe), f(l.corte), l.veredicto]} />
            ))}
          </View>
          <Text style={styles.subtitle}>
            Linha de corte = menor votação nominal entre os eleitos do ano; a projeção escala o
            último ano pelo crescimento do eleitorado. Este estudo é uma projeção fictícia para
            observação de panorama — NÃO é previsão: o quociente e os votos dos concorrentes mudam
            a cada eleição, e a eleição depende do desempenho do partido (quociente e sobras).
          </Text>
        </>
      )}

      <Text style={styles.subtitle}>
        Distribuição hipotética montada à mão — não representa resultado oficial de eleição.
      </Text>
    </ReportShell>
  );
}
