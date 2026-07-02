import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcularQuocienteEleitoral, calcularMajoritario } from "@/lib/eleitoral";
import { getPartidos } from "@/lib/data";
import { SimuladorPartido } from "@/components/SimuladorPartido";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";

export default async function QuocienteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ cargoId: string }>;
  searchParams: Promise<{ candidato?: string }>;
}) {
  const { cargoId } = await params;
  const { candidato: candidatoInicialId } = await searchParams;
  const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
  if (!cargo) notFound();

  if (cargo.tipoApuracao === "PROPORCIONAL") {
    const [resultado, partidos] = await Promise.all([
      calcularQuocienteEleitoral(cargoId),
      getPartidos(),
    ]);
    if (!resultado) notFound();

    return (
      <div className="flex flex-col gap-6">
        <Header cargoNome={resultado.cargo.nome} municipioNome={resultado.cargo.municipio?.nome} cargoId={cargoId} />

        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Votos válidos" value={resultado.votosValidos.toLocaleString("pt-BR")} />
          <StatCard label="Vagas" value={String(resultado.cargo.vagas)} />
        </section>

        <section className="rounded-xl border border-blue-900 bg-blue-950/40 px-4 py-3">
          <p className="text-xs text-blue-300">Quociente eleitoral (QE)</p>
          <p className="text-2xl font-bold text-blue-300">
            {resultado.quocienteEleitoral.toLocaleString("pt-BR")}
          </p>
          <p className="mt-1 text-xs text-neutral-400">
            QE = votos válidos ÷ vagas = {resultado.votosValidos.toLocaleString("pt-BR")} ÷{" "}
            {resultado.cargo.vagas}
          </p>
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Quociente partidário</h2>
          {resultado.partidos.map((p) => (
            <div
              key={p.partidoId}
              className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <div>
                <p className="font-medium">{p.sigla}</p>
                <p className="text-xs text-neutral-500">
                  {p.votos.toLocaleString("pt-BR")} votos · {p.percentual.toFixed(1)}%
                </p>
              </div>
              <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                {p.quocientePartidario} {p.quocientePartidario === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          ))}
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-neutral-400">Eleitos e suplentes</h2>
          {resultado.partidos.map((p) => (
            <div key={p.partidoId} className="flex flex-col gap-2">
              <p className="text-xs font-medium text-neutral-500">{p.sigla}</p>
              {resultado.candidatosComSituacao
                .filter((c) => c.partido.id === p.partidoId)
                .map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
                  >
                    <div>
                      <p>{c.nome}</p>
                      <p className="text-xs text-neutral-500">
                        {c.numero} · {c.votos.toLocaleString("pt-BR")} votos
                      </p>
                    </div>
                    {c.situacao === "eleito" ? (
                      <span className="rounded-full bg-emerald-950 px-2 py-1 text-xs font-medium text-emerald-300">
                        Eleito
                      </span>
                    ) : (
                      <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-400">
                        {c.ordemSuplencia}º suplente
                      </span>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </section>

        <div id="simulador">
          <SimuladorPartido
            candidatos={resultado.candidatosComSituacao.map((c) => ({
              id: c.id,
              nome: c.nome,
              numero: c.numero,
              votos: c.votos,
              partidoId: c.partido.id,
              partidoSigla: c.partido.sigla,
              situacaoOriginal: c.situacao,
            }))}
            partidos={partidos}
            quocienteEleitoral={resultado.quocienteEleitoral}
            candidatoInicialId={candidatoInicialId}
          />
        </div>
      </div>
    );
  }

  const resultado = await calcularMajoritario(cargoId);
  if (!resultado) notFound();

  return (
    <div className="flex flex-col gap-6">
      <Header cargoNome={resultado.cargo.nome} municipioNome={resultado.cargo.municipio?.nome} cargoId={cargoId} />

      <section className="rounded-xl border border-blue-900 bg-blue-950/40 px-4 py-3">
        <p className="text-xs text-blue-300">Votos válidos</p>
        <p className="text-2xl font-bold text-blue-300">
          {resultado.votosValidos.toLocaleString("pt-BR")}
        </p>
        {resultado.segundoTurnoProvavel && (
          <p className="mt-2 rounded-md bg-amber-950 px-2 py-1 text-xs text-amber-300">
            Líder com {resultado.percentualLider.toFixed(1)}% — pode indicar 2º turno se abaixo
            de 50%+1 dos votos válidos.
          </p>
        )}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Apuração majoritária</h2>
        {resultado.candidatos.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {i + 1}º · {c.nome}
              </p>
              <p className="text-xs text-neutral-500">
                {c.numero} · {c.partido.sigla}
              </p>
            </div>
            <span className="text-sm font-semibold text-blue-400">
              {c.votos.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </section>
    </div>
  );
}

function Header({
  cargoNome,
  municipioNome,
  cargoId,
}: {
  cargoNome: string;
  municipioNome?: string;
  cargoId: string;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold">{cargoNome}</h1>
        <p className="text-sm text-neutral-500">{municipioNome ?? "Pará (estadual)"}</p>
      </div>
      <PdfDownloadLink href={`/api/pdf/quociente/${cargoId}`} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-3 text-center">
      <p className="text-lg font-semibold">{value}</p>
      <p className="text-[11px] text-neutral-500">{label}</p>
    </div>
  );
}
