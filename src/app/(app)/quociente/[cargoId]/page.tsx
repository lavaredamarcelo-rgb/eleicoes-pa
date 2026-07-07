import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcularQuocienteEleitoral, calcularMajoritario } from "@/lib/eleitoral";
import { getPartidos, getEleitoresCargo } from "@/lib/data";
import { SimuladorPartido } from "@/components/SimuladorPartido";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { MunicipioSwitcher } from "@/components/MunicipioSwitcher";
import { CountUp } from "@/components/CountUp";

export default async function QuocienteDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ cargoId: string }>;
  searchParams: Promise<{ candidato?: string }>;
}) {
  const { cargoId } = await params;
  const { candidato: candidatoInicialId } = await searchParams;
  const cargo = await prisma.cargo.findUnique({ where: { id: cargoId }, include: { eleicao: true } });
  if (!cargo) notFound();

  const eleitores = await getEleitoresCargo(cargo.municipioId, cargo.eleicao.ano);

  const cargosIrmaos = cargo.municipioId
    ? await prisma.cargo.findMany({
        where: { eleicaoId: cargo.eleicaoId, nome: cargo.nome, municipioId: { not: null } },
        include: { municipio: true },
        orderBy: { municipio: { nome: "asc" } },
      })
    : [];
  const switcherOpcoes = cargosIrmaos
    .filter((c) => c.municipio)
    .map((c) => ({ cargoId: c.id, municipioNome: c.municipio!.nome }));

  if (cargo.tipoApuracao === "PROPORCIONAL") {
    const [resultado, partidos] = await Promise.all([
      calcularQuocienteEleitoral(cargoId),
      getPartidos(),
    ]);
    if (!resultado) notFound();

    return (
      <div className="flex flex-col gap-6">
        <Header
          cargoNome={resultado.cargo.nome}
          municipioNome={resultado.cargo.municipio?.nome}
          cargoId={cargoId}
          municipioSwitcher={
            switcherOpcoes.length > 1 ? (
              <MunicipioSwitcher cargoId={cargoId} opcoes={switcherOpcoes} />
            ) : undefined
          }
        />

        <section className="grid grid-cols-2 gap-3">
          <StatCard label="Votos válidos" value={resultado.votosValidos.toLocaleString("pt-BR")} />
          <StatCard label="Vagas (cadeiras)" value={String(resultado.cargo.vagas)} />
        </section>

        {eleitores && (
          <section className="grid grid-cols-2 gap-3">
            <StatCard
              label={`Eleitores aptos (${eleitores.ano})`}
              value={eleitores.eleitores.toLocaleString("pt-BR")}
            />
            <StatCard
              label="Eleitores por vaga"
              value={Math.round(eleitores.eleitores / resultado.cargo.vagas).toLocaleString("pt-BR")}
            />
          </section>
        )}

        <section className="rounded-xl border border-amber-900 bg-amber-950/40 px-4 py-3">
          <p className="text-xs text-amber-300">Quociente eleitoral (QE)</p>
          <p className="text-2xl font-bold text-amber-300">
            <CountUp value={resultado.quocienteEleitoral} />
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
                <p className="text-xs text-neutral-600">
                  Faltam {p.votosFaltantesProximaVaga.toLocaleString("pt-BR")} votos para a
                  próxima vaga direta
                </p>
              </div>
              <span className="rounded-full bg-neutral-800 px-2 py-1 text-xs text-neutral-300">
                {p.quocientePartidario} {p.quocientePartidario === 1 ? "vaga" : "vagas"}
              </span>
            </div>
          ))}
          <p className="text-xs text-neutral-600">
            Inclui vagas distribuídas pela regra das sobras (maior média, art. 109). "Vaga
            direta" considera apenas o quociente partidário simples.
          </p>
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

        {!resultado.cargo.municipio && resultado.municipiosComVotos.length > 0 && (
          <VotosPorMunicipio municipios={resultado.municipiosComVotos} />
        )}

        <div id="simulador">
          <SimuladorPartido
            cargoId={cargoId}
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
            vagas={resultado.cargo.vagas}
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
      <Header
        cargoNome={resultado.cargo.nome}
        municipioNome={resultado.cargo.municipio?.nome}
        cargoId={cargoId}
        municipioSwitcher={
          switcherOpcoes.length > 1 ? (
            <MunicipioSwitcher cargoId={cargoId} opcoes={switcherOpcoes} />
          ) : undefined
        }
      />

      {eleitores && (
        <section className="grid grid-cols-2 gap-3">
          <StatCard
            label={`Eleitores aptos (${eleitores.ano})`}
            value={eleitores.eleitores.toLocaleString("pt-BR")}
          />
          <StatCard
            label="Comparecimento estimado"
            value={`${((resultado.votosValidos / eleitores.eleitores) * 100).toFixed(1)}%`}
          />
        </section>
      )}

      <section className="rounded-xl border border-amber-900 bg-amber-950/40 px-4 py-3">
        <p className="text-xs text-amber-300">Votos válidos</p>
        <p className="text-2xl font-bold text-amber-300">
          <CountUp value={resultado.votosValidos} />
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
            <span className="text-sm font-semibold text-amber-400">
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
  municipioSwitcher,
}: {
  cargoNome: string;
  municipioNome?: string;
  cargoId: string;
  municipioSwitcher?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
          Cálculo de quociente
        </p>
        <h1 className="text-lg font-semibold">{cargoNome}</h1>
        {municipioSwitcher ?? (
          <p className="text-sm text-neutral-500">{municipioNome ?? "Pará (estadual)"}</p>
        )}
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

function VotosPorMunicipio({
  municipios,
}: {
  municipios: {
    municipioId: string;
    municipioNome: string;
    regiaoNome: string;
    total: number;
    partidos: { sigla: string; votos: number }[];
  }[];
}) {
  const porRegiao = new Map<string, typeof municipios>();
  for (const m of municipios) {
    const atual = porRegiao.get(m.regiaoNome);
    if (atual) atual.push(m);
    else porRegiao.set(m.regiaoNome, [m]);
  }
  const regioesOrdenadas = Array.from(porRegiao.entries()).sort((a, b) =>
    a[0].localeCompare(b[0], "pt-BR")
  );

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-medium text-neutral-400">Votos por município</h2>
      {regioesOrdenadas.map(([regiaoNome, lista]) => (
        <details key={regiaoNome} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
            <span className="font-medium">{regiaoNome}</span>
            <span className="text-xs text-neutral-500">{lista.length} municípios</span>
          </summary>
          <div className="mt-2 flex flex-col gap-2">
            {lista.map((m) => (
              <div
                key={m.municipioId}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-medium">{m.municipioNome}</p>
                  <span className="text-sm font-semibold text-amber-400">
                    {m.total.toLocaleString("pt-BR")}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">
                  {m.partidos.map((p) => `${p.sigla} ${p.votos.toLocaleString("pt-BR")}`).join(" · ")}
                </p>
              </div>
            ))}
          </div>
        </details>
      ))}
    </section>
  );
}
