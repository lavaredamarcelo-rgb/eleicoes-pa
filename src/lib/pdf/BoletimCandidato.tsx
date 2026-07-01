import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import type { getCandidato } from "@/lib/data";

type Candidato = NonNullable<Awaited<ReturnType<typeof getCandidato>>>;

export function BoletimCandidato({ candidato }: { candidato: Candidato }) {
  const totalVotos = candidato.resultados.reduce((sum, r) => sum + r.votos, 0);

  const votosPorRegiao = new Map<string, number>();
  for (const r of candidato.resultados) {
    const nome = r.municipio.regiao.nome;
    votosPorRegiao.set(nome, (votosPorRegiao.get(nome) ?? 0) + r.votos);
  }
  const regioesOrdenadas = Array.from(votosPorRegiao.entries()).sort((a, b) => b[1] - a[1]);

  return (
    <ReportShell
      title={`Boletim do candidato — ${candidato.nome}`}
      subtitle={`${candidato.numero} · ${candidato.partido.sigla} · ${candidato.cargo.nome}${
        candidato.cargo.municipio ? ` (${candidato.cargo.municipio.nome})` : " (PA)"
      }`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Votos totais" value={totalVotos.toLocaleString("pt-BR")} />
        <StatBox label="Municípios com votos" value={String(candidato.resultados.length)} />
        <StatBox label="Regiões" value={String(regioesOrdenadas.length)} />
      </View>

      <SectionTitle>Votos por região</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Região", "Votos", "% do total"]} />
        {regioesOrdenadas.map(([nome, votos]) => (
          <TableRow
            key={nome}
            cells={[
              nome,
              votos.toLocaleString("pt-BR"),
              totalVotos > 0 ? `${((votos / totalVotos) * 100).toFixed(1)}%` : "0%",
            ]}
          />
        ))}
      </View>

      <SectionTitle>Votos por município</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Município", "Região", "Votos"]} />
        {candidato.resultados.map((r) => (
          <TableRow
            key={r.id}
            cells={[r.municipio.nome, r.municipio.regiao.nome, r.votos.toLocaleString("pt-BR")]}
          />
        ))}
      </View>

      {candidato.trocasPartido.length > 0 && (
        <>
          <SectionTitle>Histórico partidário</SectionTitle>
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
        </>
      )}

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Dados de demonstração. Substituir por importação oficial do TSE antes de uso real.
      </Text>
    </ReportShell>
  );
}
