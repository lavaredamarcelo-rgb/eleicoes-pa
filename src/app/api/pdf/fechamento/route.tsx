import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/dal";
import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, StatBox, TableHeader, TableRow } from "@/lib/pdf/ReportShell";
import { styles } from "@/lib/pdf/styles";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

// PDF "Fechamento da apuração" — retrato do Radar no momento do clique:
// ranking, situação, projeção de cadeiras e o comparativo com as pesquisas.
type Payload = {
  cargoRotulo: string;
  pctApurado: number;
  fonte: string;
  vagas: number;
  qe: number | null;
  cadeiras: Record<string, number> | null;
  candidatos: { nome: string; numero: number; sigla: string; votos: number; pct: number; situacao: string }[];
  mediasPesquisas: Record<string, number> | null;
};

const f = (n: number) => n.toLocaleString("pt-BR");

export async function POST(req: NextRequest) {
  await verifySession();
  let body: Payload;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ erro: "JSON inválido" }, { status: 400 });
  }
  if (!body?.cargoRotulo || !Array.isArray(body.candidatos)) {
    return NextResponse.json({ erro: "payload incompleto" }, { status: 400 });
  }
  const cands = body.candidatos.slice(0, 400);
  const totalVotos = cands.reduce((s, c) => s + (Number(c.votos) || 0), 0);

  const doc = (
    <ReportShell
      title={`Apuração — ${String(body.cargoRotulo).slice(0, 60)}`}
      subtitle={`${body.fonte === "tse" ? "Dados oficiais TSE" : body.fonte === "simulado" ? "SIMULADO (base 2022)" : "Parcial"} · ${Number(body.pctApurado).toFixed(1)}% das seções totalizadas`}
    >
      <View style={styles.statsRow}>
        <StatBox label="Apurado" value={`${Number(body.pctApurado).toFixed(1)}%`} />
        <StatBox label="Votos computados" value={f(totalVotos)} />
        <StatBox label="Vagas" value={String(body.vagas)} />
        {body.qe != null && <StatBox label="QE parcial" value={f(Number(body.qe))} />}
      </View>

      {body.cadeiras && Object.keys(body.cadeiras).length > 0 && (
        <View>
          <SectionTitle>Projeção de cadeiras por partido (parcial)</SectionTitle>
          <View style={styles.table}>
            <TableHeader columns={["Partido", "Cadeiras projetadas"]} />
            {Object.entries(body.cadeiras)
              .filter(([, n]) => Number(n) > 0)
              .sort((a, b) => Number(b[1]) - Number(a[1]))
              .map(([sigla, n]) => (
                <TableRow key={sigla} cells={[String(sigla).slice(0, 20), String(n)]} />
              ))}
          </View>
        </View>
      )}

      <SectionTitle>Ranking da apuração</SectionTitle>
      <View style={styles.table}>
        <TableHeader
          columns={
            body.mediasPesquisas
              ? ["Candidato", "Partido", "Votos", "%", "Pesquisas", "Situação"]
              : ["Candidato", "Partido", "Votos", "%", "Situação"]
          }
        />
        {cands.map((c, i) => {
          const media = body.mediasPesquisas?.[c.nome.toUpperCase().trim()];
          const base = [
            `${i + 1}º ${String(c.nome).slice(0, 40)}`,
            String(c.sigla).slice(0, 14),
            f(Number(c.votos) || 0),
            `${Number(c.pct).toFixed(1)}%`,
          ];
          if (body.mediasPesquisas) base.push(media != null ? `${media.toFixed(1)}%` : "—");
          base.push(String(c.situacao || "—").slice(0, 18));
          return <TableRow key={`${c.numero}-${i}`} cells={base} />;
        })}
      </View>

      <Text style={styles.paragraph}>
        Boca de urna virtual: coluna Pesquisas = média das 3 últimas pesquisas estimuladas
        válidas antes da eleição. Projeção de cadeiras: quociente partidário + maiores médias
        sobre a apuração parcial, sem votos de legenda (aproximação).
      </Text>
    </ReportShell>
  );

  return pdfResponse(doc, nomeArquivo("fechamento", body.cargoRotulo));
}
