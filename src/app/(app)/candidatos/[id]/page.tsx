import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { TrocaPartidoForm } from "@/components/TrocaPartidoForm";
import { PdfDownloadLink } from "@/components/PdfDownloadLink";
import { getCandidato, getCandidaturasAnteriores, getPartidos } from "@/lib/data";
import { verifySession } from "@/lib/dal";

export default async function CandidatoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [candidato, session] = await Promise.all([getCandidato(id), verifySession()]);
  if (!candidato) notFound();

  const candidaturasAnteriores = await getCandidaturasAnteriores(candidato.nome, candidato.id);

  const totalVotos = candidato.resultados.reduce((sum, r) => sum + r.votos, 0);

  const votosPorRegiao = new Map<string, { nome: string; votos: number }>();
  const resultadosPorRegiao = new Map<string, typeof candidato.resultados>();
  for (const r of candidato.resultados) {
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
  const regioesOrdenadas = Array.from(votosPorRegiao.entries()).sort(
    (a, b) => b[1].votos - a[1].votos
  );

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-lg font-semibold">{candidato.nome}</h1>
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
        </p>
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

      {candidaturasAnteriores.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-neutral-400">Outras candidaturas</h2>
          {candidaturasAnteriores.map((c) => (
            <CardLink key={c.id} href={`/candidatos/${c.id}`}>
              <div>
                <p className="font-medium">
                  {c.cargo.nome}
                  {c.cargo.municipio ? ` (${c.cargo.municipio.nome})` : " (PA)"}
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

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Histórico partidário</h2>
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
