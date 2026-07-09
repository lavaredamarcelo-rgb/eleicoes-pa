import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { GraficoBarras } from "@/components/GraficoBarras";
import { TrocaPartidoForm } from "@/components/TrocaPartidoForm";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { getCandidato, getCandidaturasAnteriores, getPartidos } from "@/lib/data";
import { turnoDecisivo, votosTurno } from "@/lib/turnos";
import { verifySession } from "@/lib/dal";

export default async function CandidatoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [candidato, session] = await Promise.all([getCandidato(id), verifySession()]);
  if (!candidato) notFound();

  const candidaturasAnteriores = await getCandidaturasAnteriores(candidato);

  // Exibimos a votação do turno que decidiu a eleição; quando houve 2º
  // turno, o 1º aparece como informação complementar.
  const turno = turnoDecisivo(candidato.resultados);
  const totalVotos = votosTurno(candidato.resultados, turno);
  const votosPrimeiroTurno = turno > 1 ? votosTurno(candidato.resultados, 1) : null;
  const resultadosTurno = candidato.resultados.filter((r) => r.turno === turno);

  const votosPorRegiao = new Map<string, { nome: string; votos: number }>();
  const resultadosPorRegiao = new Map<string, typeof candidato.resultados>();
  for (const r of resultadosTurno) {
    const regiao = r.municipio.regiao;
    const atual = votosPorRegiao.get(regiao.id);
    if (atual) {
      atual.votos += r.votos;
      resultadosPorRegiao.get(regiao.id)!.push(r);
    } else {
      votosPorRegiao.set(regiao.id, { nome: regiao.nome, votos: r.votos });
      resultadosPorRegiao.set(regiao.id, [r]);
    }
  }

  // Linha do tempo de filiações vista pelas urnas: o partido de cada
  // candidatura, em ordem cronológica; a "troca" é a mudança entre uma
  // eleição e a seguinte.
  const filiacoes = [
    ...candidaturasAnteriores.map((c) => ({
      ano: c.cargo.eleicao.ano,
      sigla: c.partido.sigla,
    })),
    { ano: candidato.cargo.eleicao.ano, sigla: candidato.partido.sigla },
  ].sort((a, b) => a.ano - b.ano);
  const trocasUrna: { ano: number; de: string; para: string }[] = [];
  for (let i = 1; i < filiacoes.length; i++) {
    if (filiacoes[i].sigla !== filiacoes[i - 1].sigla) {
      trocasUrna.push({ ano: filiacoes[i].ano, de: filiacoes[i - 1].sigla, para: filiacoes[i].sigla });
    }
  }

  // Evolução: votação (turno decisivo) em cada eleição disputada, ligada
  // pelo CPF, em ordem cronológica.
  const evolucao = [
    ...candidaturasAnteriores.map((c) => ({ ano: c.cargo.eleicao.ano, votos: c.totalVotos })),
    { ano: candidato.cargo.eleicao.ano, votos: totalVotos },
  ].sort((a, b) => a.ano - b.ano);
  const regioesOrdenadas = Array.from(votosPorRegiao.entries()).sort(
    (a, b) => b[1].votos - a[1].votos
  );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="flex items-center gap-2 text-lg font-semibold">
              {candidato.nome}
              {candidato.eleito && (
                <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-xs font-medium text-emerald-300">
                  Eleito em {candidato.cargo.eleicao.ano}
                </span>
              )}
            </h1>
            {candidato.nomeCompleto && candidato.nomeCompleto !== candidato.nome && (
              <p className="text-xs text-neutral-600">{candidato.nomeCompleto}</p>
            )}
            <p className="text-sm text-neutral-500">
              {candidato.numero} · {candidato.partido.sigla} · {candidato.cargo.nome}
              {candidato.cargo.municipio ? ` (${candidato.cargo.municipio.nome})` : " (PA)"} ·
              eleição de {candidato.cargo.eleicao.ano}
            </p>
          </div>
          <PdfDownloadLink href={`/api/pdf/candidato/${candidato.id}`} />
        </div>
        <p className="mt-2 text-2xl font-bold text-amber-400">
          {totalVotos.toLocaleString("pt-BR")} votos
          {turno > 1 && <span className="text-sm font-medium text-neutral-500"> · 2º turno</span>}
        </p>
        {votosPrimeiroTurno != null && (
          <p className="text-xs text-neutral-500">
            1º turno: {votosPrimeiroTurno.toLocaleString("pt-BR")} votos
          </p>
        )}
        {candidato.viceNome && (
          <p className="mt-2 rounded-lg border border-amber-900/40 bg-amber-950/10 px-3 py-2 text-sm text-amber-300">
            Vice: {candidato.viceNome} ({candidato.viceNumero})
          </p>
        )}
      </section>

      <CardLink href={`/candidatos/${candidato.id}/projecao`}>
        <div>
          <p className="font-medium">Projeção de votação</p>
          <p className="text-xs text-neutral-500">Simular crescimento futuro e gerar PDF</p>
        </div>
      </CardLink>

      {candidato.cargo.tipoApuracao === "PROPORCIONAL" && (
        <CardLink
          href={`/quociente/${candidato.cargo.id}?candidato=${candidato.id}#simulador`}
          className="border-orange-900/50 bg-orange-950/10"
        >
          <div>
            <p className="font-medium">Simular cenário: troca de partido + crescimento</p>
            <p className="text-xs text-neutral-500">
              Veja se o candidato se elegeria em outro partido, com mais votos, ou os dois
              combinados
            </p>
          </div>
        </CardLink>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Votos por região</h2>
        {regioesOrdenadas.map(([regiaoId, r]) => (
          <div
            key={regiaoId}
            className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2"
          >
            <span>{r.nome}</span>
            <span className="text-sm font-medium">{r.votos.toLocaleString("pt-BR")}</span>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Votos por município</h2>
        {regioesOrdenadas.map(([regiaoId, r]) => (
          <details key={regiaoId} className="group" open={regioesOrdenadas.length <= 1}>
            <summary className="flex cursor-pointer list-none items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800">
              <span className="font-medium">{r.nome}</span>
              <span className="text-xs text-neutral-500">
                {resultadosPorRegiao.get(regiaoId)!.length} municípios
              </span>
            </summary>
            <div className="mt-2 flex flex-col gap-2">
              {resultadosPorRegiao.get(regiaoId)!.map((res) => (
                <CardLink key={res.id} href={`/municipios/${res.municipio.id}`}>
                  <p>{res.municipio.nome}</p>
                  <span className="text-sm font-medium">
                    {res.votos.toLocaleString("pt-BR")}
                  </span>
                </CardLink>
              ))}
            </div>
          </details>
        ))}
      </section>

      {evolucao.length > 1 && (
        <GraficoBarras
          titulo="Evolução eleitoral"
          subtitulo="Votação em cada eleição disputada (turno decisivo)"
          pontos={evolucao.map((e) => ({ rotulo: String(e.ano), valor: e.votos }))}
        />
      )}

      {candidaturasAnteriores.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Outras candidaturas</h2>
          {candidaturasAnteriores.map((c) => (
            <CardLink key={c.id} href={`/candidatos/${c.id}`}>
              <div>
                <p className="flex items-center gap-2 font-medium">
                  {c.cargo.nome}
                  {c.cargo.municipio ? ` (${c.cargo.municipio.nome})` : " (PA)"}
                  {c.eleito && (
                    <span className="rounded-full bg-emerald-950 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
                      Eleito
                    </span>
                  )}
                </p>
                <p className="text-xs text-neutral-500">
                  {c.cargo.eleicao.ano} · {c.numero} · {c.partido.sigla}
                  {c.viceNome ? ` · vice: ${c.viceNome}` : ""}
                </p>
              </div>
              <span className="text-sm font-medium">{c.totalVotos.toLocaleString("pt-BR")}</span>
            </CardLink>
          ))}
        </section>
      )}

      {filiacoes.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">
            Filiações partidárias (histórico das urnas)
          </h2>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3">
            <div className="flex flex-wrap items-center gap-1.5">
              {filiacoes.map((f, i) => (
                <span key={`${f.ano}-${f.sigla}`} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-neutral-600">→</span>}
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-medium ${
                      i > 0 && filiacoes[i - 1].sigla !== f.sigla
                        ? "border-amber-700 bg-amber-950/40 text-amber-300"
                        : "border-neutral-800 bg-neutral-950 text-neutral-300"
                    }`}
                  >
                    {f.sigla} <span className="text-neutral-500">{f.ano}</span>
                  </span>
                </span>
              ))}
            </div>
            {trocasUrna.length > 0 ? (
              <div className="mt-3 flex flex-col gap-1 border-t border-neutral-800 pt-2">
                {trocasUrna.map((tr) => (
                  <p key={`${tr.ano}-${tr.para}`} className="text-xs text-neutral-500">
                    Trocou de <span className="text-neutral-300">{tr.de}</span> para{" "}
                    <span className="text-amber-300">{tr.para}</span> entre as eleições (concorreu
                    pelo {tr.para} em {tr.ano})
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-xs text-neutral-600">
                Mesmo partido em todas as eleições registradas.
              </p>
            )}
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Trocas registradas manualmente</h2>
        {candidato.trocasPartido.length > 0 ? (
          candidato.trocasPartido.map((t) => (
            <div
              key={t.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3"
            >
              <p className="text-sm">
                {t.partidoOrigem.sigla} → {t.partidoDestino.sigla}
              </p>
              <p className="text-xs text-neutral-500">
                {new Date(t.data).toLocaleDateString("pt-BR")}
                {t.motivo ? ` · ${t.motivo}` : ""}
              </p>
            </div>
          ))
        ) : (
          <p className="rounded-xl border border-dashed border-neutral-700 bg-neutral-900/50 px-4 py-4 text-center text-sm text-neutral-500">
            Nenhuma troca de partido registrada. Filiado desde o cadastro em{" "}
            {candidato.partido.sigla}.
          </p>
        )}
      </section>

      {session.role === "ADMIN" && (
        <TrocaPartidoFormSection candidatoId={candidato.id} partidoAtualId={candidato.partidoId} />
      )}
    </div>
  );
}

async function TrocaPartidoFormSection({
  candidatoId,
  partidoAtualId,
}: {
  candidatoId: string;
  partidoAtualId: string;
}) {
  const partidos = await getPartidos();
  return (
    <TrocaPartidoForm
      candidatoId={candidatoId}
      partidoAtualId={partidoAtualId}
      partidos={partidos}
    />
  );
}
