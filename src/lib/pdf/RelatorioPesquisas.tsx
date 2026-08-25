import { Text, View, Svg, Polyline, Line, Circle, Text as SvgText } from "@react-pdf/renderer";
import { ReportShell, SectionTitle } from "./ReportShell";
import { styles } from "./styles";

const CORES = [
  "#d97706",
  "#2563eb",
  "#059669",
  "#dc2626",
  "#9333ea",
  "#db2777",
  "#0d9488",
  "#ea580c",
  "#65a30d",
  "#4f46e5",
];

const NAO_CANDIDATO =
  /brancos?|nulos?|n[aã]o sabe|n[aã]o respondeu|nenhum|indecisos?|ns\/nr|^outros?$/i;

export type PesquisaPdf = {
  id: string;
  instituto: string;
  tipo: string;
  cenario: string | null;
  dataDivulgacao: Date;
  amostra: number | null;
  margemErro: number | null;
  registroTSE: string | null;
  resultados: { nome: string; partido: string | null; percentual: number }[];
};

export type GrupoPesquisas = {
  disputa: string;
  turno: number;
  pesquisas: PesquisaPdf[]; // ordem cronológica crescente
};

const fmt = (d: Date) =>
  d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" });

function GraficoPdf({ pesquisas }: { pesquisas: PesquisaPdf[] }) {
  const estimuladas = pesquisas.filter((p) => p.tipo === "estimulada");
  if (estimuladas.length < 2) return null;

  const nomes: string[] = [];
  for (const p of estimuladas) {
    for (const r of p.resultados) {
      const n = r.nome.trim();
      if (!NAO_CANDIDATO.test(n) && !nomes.includes(n)) nomes.push(n);
    }
  }

  const W = 520;
  const H = 190;
  const ML = 30;
  const MR = 10;
  const MT = 12;
  const MB = 24;
  const valores = estimuladas.flatMap((p) =>
    p.resultados
      .filter((r) => !NAO_CANDIDATO.test(r.nome))
      .map((r) => r.percentual)
  );
  const yMax = Math.min(100, Math.ceil((Math.max(10, ...valores) + 8) / 10) * 10);
  const n = estimuladas.length;
  const x = (i: number) => ML + (i * (W - ML - MR)) / (n - 1);
  const y = (v: number) => MT + (H - MT - MB) * (1 - v / yMax);
  const passoRotulo = Math.max(1, Math.ceil(n / 9));

  return (
    <View wrap={false}>
      <Svg width={W} height={H}>
        {Array.from({ length: yMax / 10 + 1 }, (_, i) => i * 10).flatMap((v) => [
          <Line
            key={`g${v}`}
            x1={ML}
            x2={W - MR}
            y1={y(v)}
            y2={y(v)}
            stroke="#e5e7eb"
            strokeWidth={0.5}
          />,
          <SvgText
            key={`t${v}`}
            x={ML - 4}
            y={y(v) + 2}
            textAnchor="end"
            style={{ fontSize: 6, fill: "#9ca3af" }}
          >
            {`${v}%`}
          </SvgText>,
        ])}
        {estimuladas.map((p, i) =>
          i % passoRotulo === 0 || i === n - 1 ? (
            <SvgText
              key={p.id}
              x={x(i)}
              y={H - 10}
              textAnchor="middle"
              style={{ fontSize: 6, fill: "#6b7280" }}
            >
              {fmt(p.dataDivulgacao)}
            </SvgText>
          ) : null
        )}
        {nomes.map((nome, s) => {
          const pontos = estimuladas.map((p) => {
            const r = p.resultados.find((x) => x.nome.trim() === nome);
            return r ? r.percentual : null;
          });
          const path = pontos
            .map((v, i) => (v == null ? null : `${x(i)},${y(v)}`))
            .filter(Boolean)
            .join(" ");
          const cor = CORES[s % CORES.length];
          return [
            path.split(" ").length > 1 ? (
              <Polyline key={`l${nome}`} points={path} fill="none" stroke={cor} strokeWidth={1.6} />
            ) : null,
            ...pontos.map((v, i) =>
              v == null ? null : (
                <Circle key={`c${nome}${i}`} cx={x(i)} cy={y(v)} r={2} fill={cor} />
              )
            ),
          ];
        })}
      </Svg>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2, marginBottom: 8 }}>
        {nomes.map((nome, s) => (
          <View key={nome} style={{ flexDirection: "row", alignItems: "center", gap: 3 }}>
            <View
              style={{
                width: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: CORES[s % CORES.length],
              }}
            />
            <Text style={{ fontSize: 7, color: "#374151" }}>{nome}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export function RelatorioPesquisas({
  titulo,
  subtitulo,
  grupos,
}: {
  titulo: string;
  subtitulo: string;
  grupos: GrupoPesquisas[];
}) {
  return (
    <ReportShell title={titulo} subtitle={subtitulo}>
      {grupos.map((g) => (
        <View key={`${g.disputa}-${g.turno}`}>
          <SectionTitle>
            {g.disputa} · {g.turno}º turno ({g.pesquisas.length}{" "}
            {g.pesquisas.length === 1 ? "pesquisa" : "pesquisas"})
          </SectionTitle>

          <GraficoPdf pesquisas={g.pesquisas} />

          {[...g.pesquisas].reverse().map((p) => (
            <View key={p.id} wrap={false} style={{ marginBottom: 7 }}>
              <Text style={{ fontSize: 9, fontFamily: "Helvetica-Bold", color: "#111827" }}>
                {fmt(p.dataDivulgacao)} · {p.instituto}
                {p.cenario ? ` · ${p.cenario}` : ""}
                {p.tipo === "espontanea" ? " · espontânea" : ""}
              </Text>
              <Text style={{ fontSize: 7.5, color: "#6b7280", marginTop: 1 }}>
                {[
                  p.amostra ? `${p.amostra.toLocaleString("pt-BR")} entrevistados` : null,
                  p.margemErro != null ? `margem ±${p.margemErro} p.p.` : null,
                  p.registroTSE || null,
                ]
                  .filter(Boolean)
                  .join(" · ") || " "}
              </Text>
              <Text style={{ fontSize: 8.5, color: "#111827", marginTop: 2, lineHeight: 1.4 }}>
                {[...p.resultados]
                  .sort((a, b) => b.percentual - a.percentual)
                  .map(
                    (r) =>
                      `${r.nome}${r.partido ? ` (${r.partido})` : ""} ${r.percentual.toLocaleString("pt-BR")}%`
                  )
                  .join("  ·  ")}
              </Text>
            </View>
          ))}
        </View>
      ))}
      <Text style={{ fontSize: 7, color: "#9ca3af", marginTop: 10 }}>
        Gráficos consideram apenas pesquisas estimuladas; Outros/Brancos/Indecisos ficam fora das
        linhas, mas constam nos números de cada pesquisa. Data exibida = fim do período de campo.
      </Text>
    </ReportShell>
  );
}
