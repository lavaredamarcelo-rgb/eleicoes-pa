import { Text, View } from "@react-pdf/renderer";
import { ReportShell, StatBox, SectionTitle, TableHeader, TableRow } from "./ReportShell";
import { styles } from "./styles";
import { calcularSimulacao, type CandidatoSimulacao, type PartidoRef } from "@/lib/simulacaoPartido";
import type { calcularQuocienteEleitoral } from "@/lib/eleitoral";

type Resultado = NonNullable<Awaited<ReturnType<typeof calcularQuocienteEleitoral>>>;

export function RelatorioSimulacao({
  resultado,
  partidos,
  candidatoId,
  novoPartidoId,
  percentual,
}: {
  resultado: Resultado;
  partidos: PartidoRef[];
  candidatoId: string;
  novoPartidoId?: string;
  percentual: number;
}) {
  const municipioNome = resultado.cargo.municipio?.nome;
  const partidoById = new Map(partidos.map((p) => [p.id, p]));

  const candidatosBase: (CandidatoSimulacao & { situacaoOriginal: "eleito" | "suplente" })[] =
    resultado.candidatosComSituacao.map((c) => ({
      id: c.id,
      nome: c.nome,
      numero: c.numero,
      votos: c.votos,
      partidoId: c.partido.id,
      partidoSigla: c.partido.sigla,
      situacaoOriginal: c.situacao,
    }));

  const candidatoAlvo = candidatosBase.find((c) => c.id === candidatoId);
  const overrides = new Map([[candidatoId, { partidoId: novoPartidoId, percentual }]]);
  const votosLegenda = Object.fromEntries(
    resultado.partidos.filter((p) => p.votosLegenda > 0).map((p) => [p.partidoId, p.votosLegenda])
  );
  const simulado = calcularSimulacao(
    candidatosBase,
    resultado.cargo.vagas,
    overrides,
    partidoById,
    votosLegenda
  );

  const partidoOrigemSigla = candidatoAlvo?.partidoSigla ?? "";
  const partidoDestinoSigla = novoPartidoId
    ? partidoById.get(novoPartidoId)?.sigla ?? partidoOrigemSigla
    : partidoOrigemSigla;

  const situacaoOriginal = candidatoAlvo?.situacaoOriginal;
  const situacaoSimulada = candidatoAlvo ? simulado.situacao.get(candidatoAlvo.id) : undefined;

  const votosSimulados = candidatoAlvo
    ? simulado.efetivos.find((c) => c.id === candidatoAlvo.id)?.votosEfetivos ?? candidatoAlvo.votos
    : 0;

  const cenarioPartes: string[] = [];
  if (novoPartidoId && novoPartidoId !== candidatoAlvo?.partidoId) {
    cenarioPartes.push(`troca de ${partidoOrigemSigla} para ${partidoDestinoSigla}`);
  }
  if (percentual) {
    cenarioPartes.push(`crescimento de ${percentual > 0 ? "+" : ""}${percentual}% nos votos`);
  }
  const cenarioDescricao =
    cenarioPartes.length > 0 ? cenarioPartes.join(" e ") : "sem alterações";

  const mudancasSituacao = candidatosBase.filter((c) => {
    const nova = simulado.situacao.get(c.id);
    return nova && nova.situacao !== c.situacaoOriginal;
  });

  return (
    <ReportShell
      title={`Simulação de cenário — ${resultado.cargo.nome}`}
      subtitle={municipioNome ?? "Pará (estadual)"}
    >
      <Text style={{ fontSize: 9, color: "#4b5563", marginBottom: 8 }}>
        Cenário: {candidatoAlvo?.nome} — {cenarioDescricao}
      </Text>

      <SectionTitle>Candidato simulado</SectionTitle>
      <View style={styles.statsRow}>
        <StatBox label="Partido" value={`${partidoOrigemSigla} → ${partidoDestinoSigla}`} />
        <StatBox
          label="Votos"
          value={`${candidatoAlvo?.votos.toLocaleString("pt-BR")} → ${votosSimulados.toLocaleString("pt-BR")}`}
        />
        <StatBox
          label="Situação"
          value={`${situacaoOriginal === "eleito" ? "Eleito" : "Suplente"} → ${
            situacaoSimulada?.situacao === "eleito"
              ? "Eleito"
              : `${situacaoSimulada?.ordemSuplencia}º suplente`
          }`}
        />
      </View>

      <SectionTitle>Quociente eleitoral</SectionTitle>
      <View style={styles.statsRow}>
        <StatBox label="Votos válidos (atual)" value={resultado.votosValidos.toLocaleString("pt-BR")} />
        <StatBox label="Votos válidos (simulado)" value={simulado.votosValidos.toLocaleString("pt-BR")} />
        <StatBox
          label="QE atual → simulado"
          value={`${resultado.quocienteEleitoral.toLocaleString("pt-BR")} → ${simulado.quocienteEleitoral.toLocaleString("pt-BR")}`}
        />
      </View>

      <SectionTitle>Vagas por partido (simulado)</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["Partido", "Votos", "%", "Vagas"]} />
        {simulado.partidos.map((p) => (
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

      {mudancasSituacao.length > 0 && (
        <View wrap={false}>
          <SectionTitle>Candidatos que mudam de situação</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Candidato", "Situação atual", "Situação simulada"]} />
            {mudancasSituacao.map((c) => {
              const nova = simulado.situacao.get(c.id)!;
              return (
                <TableRow
                  key={c.id}
                  cells={[
                    c.nome,
                    c.situacaoOriginal === "eleito" ? "Eleito" : "Suplente",
                    nova.situacao === "eleito" ? "Eleito" : `${nova.ordemSuplencia}º suplente`,
                  ]}
                />
              );
            })}
          </View>
        </View>
      )}

      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Simulação hipotética para fins de planejamento — não representa dados oficiais do TSE nem
        garante resultado eleitoral real. Crescimento de votos distribuído proporcionalmente,
        sem considerar variação de outros candidatos.
      </Text>
    </ReportShell>
  );
}
