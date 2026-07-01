import { notFound } from "next/navigation";
import { CardLink } from "@/components/CardLink";
import { getRegiao } from "@/lib/data";

export default async function RegiaoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const regiao = await getRegiao(id);
  if (!regiao) notFound();

  const totalVotos = regiao.municipios.reduce((sum, m) => sum + m.totalVotos, 0);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <h1 className="text-lg font-semibold">{regiao.nome}</h1>
        <p className="text-sm text-neutral-500">{regiao.municipios.length} municípios</p>
        <p className="mt-2 text-2xl font-bold text-blue-400">
          {totalVotos.toLocaleString("pt-BR")} votos
        </p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-medium text-neutral-400">Municípios</h2>
        {regiao.municipios.map((m) => (
          <CardLink key={m.id} href={`/municipios/${m.id}`}>
            <span>{m.nome}</span>
            <span className="text-sm font-medium">{m.totalVotos.toLocaleString("pt-BR")}</span>
          </CardLink>
        ))}
      </section>
    </div>
  );
}
