import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { prisma } from "@/lib/prisma";
import { Text, View } from "@react-pdf/renderer";
import { ReportShell, SectionTitle, StatBox, TableHeader, TableRow } from "@/lib/pdf/ReportShell";
import { styles } from "@/lib/pdf/styles";
import { pdfResponse, nomeArquivo } from "@/lib/pdf/respond";

export async function GET(req: Request) {
  await verifySession();
  const url = new URL(req.url);
  const cargoId = url.searchParams.get("cargo");
  const municipioId = url.searchParams.get("municipio");
  const regiaoId = url.searchParams.get("regiao");
  if (!cargoId || (!municipioId && !regiaoId)) notFound();

  const [cargo, municipio, regiao] = await Promise.all([
    prisma.cargo.findUnique({
      where: { id: cargoId },
      include: { eleicao: { select: { ano: true } } },
    }),
    municipioId
      ? prisma.municipio.findUnique({ where: { id: municipioId }, select: { nome: true } })
      : null,
    regiaoId
      ? prisma.regiao.findUnique({ where: { id: regiaoId }, select: { nome: true } })
      : null,
  ]);
  if (!cargo || (municipioId && !municipio) || (regiaoId && !regiao)) notFound();

  const grupos = await prisma.resultado.groupBy({
    by: ["candidatoId"],
    where: {
      turno: 1,
      candidato: { cargoId },
      ...(municipioId ? { municipioId } : { municipio: { regiaoId: regiaoId! } }),
    },
    _sum: { votos: true },
  });
  const candidatos = await prisma.candidato.findMany({
    where: { id: { in: grupos.map((g) => g.candidatoId) } },
    select: {
      id: true,
      nome: true,
      numero: true,
      eleito: true,
      partido: { select: { sigla: true } },
    },
  });
  const porId = new Map(candidatos.map((c) => [c.id, c]));
  const ranking = grupos
    .map((g) => ({
      c: porId.get(g.candidatoId),
      votos: g._sum.votos ?? 0,
    }))
    .filter((r) => r.c && r.votos > 0)
    .sort((a, b) => b.votos - a.votos);
  if (ranking.length === 0) notFound();
  const total = ranking.reduce((s, r) => s + r.votos, 0);

  const local = municipio?.nome ?? `Região ${regiao!.nome} (somada)`;

  const doc = (
    <ReportShell
      title={`Votos por município — ${cargo.nome} ${cargo.eleicao.ano}`}
      subtitle={local}
    >
      <View style={styles.statsRow}>
        <StatBox label="Candidatos com votos" value={String(ranking.length)} />
        <StatBox label="Total de votos (1º turno)" value={total.toLocaleString("pt-BR")} />
      </View>
      <SectionTitle>Ranking completo</SectionTitle>
      <View style={styles.table}>
        <TableHeader columns={["#", "Candidato", "Partido", "Votos", "% local"]} />
        {ranking.map((r, i) => (
          <TableRow
            key={r.c!.id}
            cells={[
              `${i + 1}º`,
              `${r.c!.nome}${r.c!.eleito ? " (eleito)" : ""}`,
              r.c!.partido.sigla,
              r.votos.toLocaleString("pt-BR"),
              `${((r.votos / total) * 100).toFixed(1)}%`,
            ]}
          />
        ))}
      </View>
      <Text style={{ marginTop: 12, fontSize: 8, color: "#9ca3af" }}>
        Dados oficiais do TSE (1º turno). Percentual sobre os votos nominais do cargo no
        recorte selecionado.
      </Text>
    </ReportShell>
  );

  return pdfResponse(doc, nomeArquivo("votos", cargo.nome, local));
}
