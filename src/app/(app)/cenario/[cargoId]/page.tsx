import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcularQuocienteEleitoral, calcularMajoritario } from "@/lib/eleitoral";
import { getPartidos } from "@/lib/data";
import { SimuladorPartido } from "@/components/SimuladorPartido";
import { MunicipioSwitcher } from "@/components/MunicipioSwitcher";
import { ComposicaoCasa } from "@/components/ComposicaoCasa";

export default async function CenarioDetailPage({
  params,
}: {
  params: Promise<{ cargoId: string }>;
}) {
  const { cargoId } = await params;
  const cargo = await prisma.cargo.findUnique({ where: { id: cargoId } });
  if (!cargo) notFound();

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

    const maxCadeiras = Math.max(...resultado.partidos.map((p) => p.quocientePartidario), 1);
    const partidosComCadeira = [...resultado.partidos].sort(
      (a, b) => b.quocientePartidario - a.quocientePartidario
    );

    return (
      <div className="flex flex-col gap-6">
        <Header
          cargoNome={resultado.cargo.nome}
          municipioNome={resultado.cargo.municipio?.nome}
          ano={resultado.cargo.eleicao.ano}
          municipioSwitcher={
            switcherOpcoes.length > 1 ? (
              <MunicipioSwitcher cargoId={cargoId} opcoes={switcherOpcoes} />
            ) : undefined
          }
        />

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Composição da casa — clique no partido para ver eleitos e suplentes
          </h2>
          <ComposicaoCasa
            partidos={resultado.partidos.map((p) => ({
              partidoId: p.partidoId,
              sigla: p.sigla,
              cadeiras: p.quocientePartidario,
            }))}
            candidatos={resultado.candidatosComSituacao.map((c) => ({
              id: c.id,
              nome: c.nome,
              numero: c.numero,
              votos: c.votos,
              situacao: c.situacao,
              ordemSuplencia: c.ordemSuplencia,
              partidoId: c.partido.id,
              partidoSigla: c.partido.sigla,
            }))}
          />
        </section>

        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Eleitos — por ordem de votação</h2>
          {resultado.candidatosComSituacao
            .filter((c) => c.situacao === "eleito")
            .map((c, i) => (
              <div
                key={c.id}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 text-right text-xs text-neutral-600">{i + 1}º</span>
                  <div>
                    <p>{c.nome}</p>
                    <p className="text-xs text-neutral-500">
                      {c.numero} · {c.partido.sigla}
                    </p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-amber-400">
                  {c.votos.toLocaleString("pt-BR")}
                </span>
              </div>
            ))}
        </section>

        <section className="flex flex-col gap-2 rounded-xl border border-orange-900/50 bg-orange-950/10 px-4 py-4">
          <h2 className="text-sm font-medium text-orange-300">Simular cenário: troca de partido</h2>
          <p className="text-xs text-neutral-500">
            Puramente projetivo — nada aqui altera os dados reais do sistema. Escolha um candidato e
            veja como a composição da casa mudaria.
          </p>
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
          />
        </section>
      </div>
    );
  }

  const resultado = await calcularMajoritario(cargoId);
  if (!resultado) notFound();

  const [titular, ...demais] = resultado.candidatos;

  return (
    <div className="flex flex-col gap-6">
      <Header
        cargoNome={resultado.cargo.nome}
        municipioNome={resultado.cargo.municipio?.nome}
        ano={resultado.cargo.eleicao.ano}
        municipioSwitcher={
          switcherOpcoes.length > 1 ? (
            <MunicipioSwitcher cargoId={cargoId} opcoes={switcherOpcoes} />
          ) : undefined
        }
      />

      {titular && (
        <section className="rounded-xl border border-amber-900 bg-amber-950/40 px-4 py-4">
          <p className="text-xs text-amber-300">Titular eleito</p>
          <p className="text-lg font-semibold text-amber-100">{titular.nome}</p>
          <p className="text-xs text-neutral-400">
            {titular.numero} · {titular.partido.sigla} · {titular.votos.toLocaleString("pt-BR")}{" "}
            votos
          </p>
          {titular.viceNome && (
            <p className="mt-2 rounded-lg border border-amber-900/40 bg-amber-950/30 px-3 py-2 text-sm text-amber-200">
              Vice: {titular.viceNome} ({titular.viceNumero})
            </p>
          )}
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Demais candidatos</h2>
        {demais.map((c, i) => (
          <div
            key={c.id}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
          >
            <div>
              <p className="font-medium">
                {i + 2}º · {c.nome}
              </p>
              <p className="text-xs text-neutral-500">
                {c.numero} · {c.partido.sigla}
                {c.viceNome ? ` · vice: ${c.viceNome}` : ""}
              </p>
            </div>
            <span className="text-sm font-semibold text-amber-400">
              {c.votos.toLocaleString("pt-BR")}
            </span>
          </div>
        ))}
      </section>

      <section className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
        <p className="text-xs text-neutral-500">
          Cargo majoritário — sem distribuição de cadeiras por partido. Para simular troca de
          partido, use o simulador na página de Quociente de um cargo proporcional.
        </p>
      </section>
    </div>
  );
}

function Header({
  cargoNome,
  municipioNome,
  ano,
  municipioSwitcher,
}: {
  cargoNome: string;
  municipioNome?: string;
  ano: number;
  municipioSwitcher?: React.ReactNode;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
        Cenário Eleitoral
      </p>
      <h1 className="text-lg font-semibold">
        {cargoNome} <span className="text-neutral-500">· {ano}</span>
      </h1>
      {municipioSwitcher ?? (
        <p className="text-sm text-neutral-500">{municipioNome ?? "Pará (estadual)"}</p>
      )}
    </div>
  );
}
