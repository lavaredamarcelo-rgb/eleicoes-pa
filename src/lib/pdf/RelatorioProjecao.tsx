import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getCandidato } from "@/lib/data";

type Candidato = NonNullable<Awaited<ReturnType<typeof getCandidato>>>;

export function RelatorioProjecao({
  candidato,
  metodo,
  valor,
}: {
  candidato: Candidato;
  metodo: "percentual" | "meta";
  valor: number;
}) {
  const totalAtual = candidato.resultados.reduce((s, r) => s + r.votos, 0);
  const fator =
    metodo === "percentual" ? 1 + valor / 100 : totalAtual > 0 ? valor / totalAtual : 1;

  const projetados = candidato.resultados.map((r) => ({
    municipio: r.municipio.nome,
    regiao: r.municipio.regiao.nome,
    atual: r.votos,
    projetado: Math.max(0, Math.round(r.votos * fator)),
  }));
  const totalProjetado = projetados.reduce((s, r) => s + r.projetado, 0);
  const variacaoPct = totalAtual > 0 ? ((totalProjetado - totalAtual) / totalAtual) * 100 : 0;

  const porRegiao = new Map<string, { atual: number; projetado: number }>();
  for (const r of projetados) {
    const atual = porRegiao.get(r.regiao);
    if (atual) {
      atual.atual += r.atual;
      atual.projetado += r.projetado;
    } else {
      porRegiao.set(r.regiao, { atual: r.atual, projetado: r.projetado });
    }
  }
  const regioesOrdenadas = Array.from(porRegiao.entries()).sort(
    (a, b) => b[1].projetado - a[1].projetado
  );

  const descricaoMetodo =
    metodo === "percentual"
      ? `Crescimento de ${valor > 0 ? "+" : ""}${valor}% sobre a votação atual`
      : `Meta de ${valor.toLocaleString("pt-BR")} votos totais`;

  return (
    <ReportShell
      title={`Projeção de votação — ${candidato.nome}`}
      subtitle={`${candidato.numero} · ${candidato.partido.sigla} · ${candidato.cargo.nome}${
        candidato.cargo.municipio ? ` (${candidato.cargo.municipio.nome})` : " (PA)"
      }`}
    >
      <Text style={{ fontSize: 9, color: "#4b5563", marginBottom: 8 }}>
        Cenário: {descricaoMetodo}
      </Text>

      <View style={styles.statsRow}>
        <StatBox label="Votos atuais" value={totalAtual.toLocaleString("pt-BR")} />
        <StatBox label="Votos projetados" value={totalProjetado.toLocaleString("pt-BR")} />
        <StatBox
          label="Variação"
          value={`${variacaoPct >= 0 ? "+" : ""}${variacaoPct.toFixed(1)}%`}
        />
      </View>

      <SectionTitle>Projeção por região</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Atual", "Projetado"]} />
        {regioesOrdenadas.map(([nome, v]) => (
          <TableRow
            key={nome}
            cells={[nome, v.atual.toLocaleString("pt-BR"), v.projetado.toLocaleString("pt-BR")]}
          />
        ))}
      </View>

      <SectionTitle>Projeção por município</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Atual", "Projetado"]} />
        {projetados.map((r) => (
          <TableRow
            key={r.municipio}
            cells={[
              r.municipio,
              r.atual.toLocaleString("pt-BR"),
              r.projetado.toLocaleString("pt-BR"),
            ]}
          />
        ))}
      </View>

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Projeção meramente estimativa, distribuída proporcionalmente com base no padrão de
        votação atual. Não substitui pesquisa eleitoral. Documento para uso interno da campanha.
      </Text>
    </ReportShell>
  );
}
