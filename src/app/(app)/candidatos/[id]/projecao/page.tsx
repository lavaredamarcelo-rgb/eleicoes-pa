import { notFound } from "next/navigation";
import { getCandidato } from "@/lib/data";
import { ProjecaoCandidato } from "@/components/ProjecaoCandidato";

export default async function ProjecaoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const candidato = await getCandidato(id);
  if (!candidato) notFound();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold">Projeção de votação</h1>
        <p className="text-sm text-neutral-500">
          {candidato.nome} · {candidato.numero} · {candidato.partido.sigla}
        </p>
      </div>

      <ProjecaoCandidato
        candidatoId={candidato.id}
        resultados={candidato.resultados.map((r) => ({
          municipioId: r.municipio.id,
          municipioNome: r.municipio.nome,
          regiaoNome: r.municipio.regiao.nome,
          votosAtuais: r.votos,
        }))}
      />
    </div>
  );
}
